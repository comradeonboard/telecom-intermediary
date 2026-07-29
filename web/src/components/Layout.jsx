import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "◉" },
  { path: "/companies", label: "Companies", icon: "◆" },
  { path: "/customers", label: "Customers", icon: "◇" },
  { path: "/feedback", label: "Feedback", icon: "◎" },
];

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          TelLink
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          Telecom Intermediary &copy; {new Date().getFullYear()}
        </div>
      </aside>
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find((i) => i.path === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default Layout;