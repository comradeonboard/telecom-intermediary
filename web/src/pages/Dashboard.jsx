import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

function PieChart({ data, size = 160 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    );
  }

  const colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];
  let cumulativeAngle = 0;
  const radius = size / 2 - 10;

  const slices = data.map((item, i) => {
    const angle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    const endAngle = cumulativeAngle;
    const largeArc = angle > 180 ? 1 : 0;

    const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

    const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      path,
      color: colors[i % colors.length],
      ...item,
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((slice, i) => (
        <path key={i} d={slice.path} fill={slice.color} stroke="white" strokeWidth="2" />
      ))}
      {total > 0 && (
        <text x={radius} y={radius - 4} textAnchor="middle" className="text-sm font-bold" fill="#333">
          {total}
        </text>
      )}
      {total > 0 && (
        <text x={radius} y={radius + 12} textAnchor="middle" className="text-xs" fill="#888">
          total
        </text>
      )}
    </svg>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ companies: 0, customers: 0, feedback: 0 });
  const [feedbackByStatus, setFeedbackByStatus] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([
      fetch("/api/companies").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
      fetch("/api/feedback").then((r) => r.json()),
    ])
      .then(([companies, customers, feedback]) => {
        setStats({
          companies: companies.length,
          customers: customers.length,
          feedback: feedback.length,
        });
        const byStatus = {};
        feedback.forEach((f) => {
          byStatus[f.status] = (byStatus[f.status] || 0) + 1;
        });
        setFeedbackByStatus(
          Object.entries(byStatus).map(([status, value]) => ({ status, value }))
        );
      })
      .catch(() => addToast("Failed to load dashboard data", "error"));
  }, [addToast]);

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Companies</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.companies}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Customers</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.customers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Feedback</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.feedback}</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Status Breakdown</h2>
      {feedbackByStatus.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-8 flex-wrap">
          <PieChart data={feedbackByStatus} size={160} />
          <div className="space-y-3">
            {feedbackByStatus.map((item, i) => (
              <div key={item.status} className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"][i],
                  }}
                />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {item.status.replace("_", " ")}
                </span>
                <span className="text-sm text-gray-500">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
          No feedback data yet
        </div>
      )}
    </section>
  );
}

export default Dashboard;