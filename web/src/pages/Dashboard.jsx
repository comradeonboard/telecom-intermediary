import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({ companies: 0, customers: 0, feedback: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/companies").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
      fetch("/api/feedback").then((r) => r.json()),
    ]).then(([companies, customers, feedback]) => {
      setStats({
        companies: companies.length,
        customers: customers.length,
        feedback: feedback.length,
      });
    });
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </section>
  );
}

export default Dashboard;