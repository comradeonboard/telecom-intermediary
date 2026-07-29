import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

function Feedback() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_id: "", company_id: "", subject: "", message: "" });
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((err) => { throw new Error(err.error); });
        return r.json();
      })
      .then(() => {
        setShowForm(false);
        setForm({ customer_id: "", company_id: "", subject: "", message: "" });
        addToast("Feedback submitted", "success");
        fetch("/api/feedback").then((r) => r.json()).then(setItems);
      })
      .catch((err) => addToast(err.message, "error"));
  };

  const handleDelete = (id) => {
    fetch(`/api/feedback/${id}`, { method: "DELETE" })
      .then(() => {
        addToast("Feedback deleted", "success");
        fetch("/api/feedback").then((r) => r.json()).then(setItems);
      })
      .catch(() => addToast("Failed to delete feedback", "error"));
  };

  const statusColors = {
    open: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feedback</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Feedback"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 max-w-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                placeholder="Customer ID"
                value={form.customer_id}
                onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
              <input
                placeholder="Company ID"
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                placeholder="Brief subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Describe the issue or feedback"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                required
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Feedback
          </button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{f.customer_name || "Unknown"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.company_name || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{f.subject || "No subject"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[f.status] || "bg-gray-100 text-gray-800"}`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.created_at?.split("T")[0] || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="px-6 py-8 text-center text-gray-400 text-sm">No feedback yet. Start the conversation!</p>
        )}
      </div>
    </section>
  );
}

export default Feedback;