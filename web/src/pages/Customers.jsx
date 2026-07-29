import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company_id: "" });
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, company_id: form.company_id || null }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((err) => { throw new Error(err.error); });
        return r.json();
      })
      .then(() => {
        setShowForm(false);
        setForm({ name: "", email: "", phone: "", company_id: "" });
        addToast("Customer added successfully", "success");
        fetch("/api/customers").then((r) => r.json()).then(setCustomers);
      })
      .catch((err) => addToast(err.message, "error"));
  };

  const handleDelete = (id) => {
    fetch(`/api/customers/${id}`, { method: "DELETE" })
      .then(() => {
        addToast("Customer deleted", "success");
        fetch("/api/customers").then((r) => r.json()).then(setCustomers);
      })
      .catch(() => addToast("Failed to delete customer", "error"));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Customer"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 max-w-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                placeholder="Customer name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                placeholder="+1234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
              <input
                placeholder="Link to company"
                value={form.company_id}
                onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Customer
          </button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.email || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.phone || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.company_name || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.created_at?.split("T")[0] || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="px-6 py-8 text-center text-gray-400 text-sm">No customers yet. Add one!</p>
        )}
      </div>
    </section>
  );
}

export default Customers;