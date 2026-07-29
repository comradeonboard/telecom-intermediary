export default function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500",
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${colors[toast.type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-fade-in`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-white/70 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}