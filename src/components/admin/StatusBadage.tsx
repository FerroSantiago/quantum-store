interface StatusBadgeProps {
  variant: "success" | "warning" | "error" | "default";
  children: React.ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
