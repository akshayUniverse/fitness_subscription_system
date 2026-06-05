interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    ACTIVE:
      "bg-green-100 text-green-700",
    COMPLETED:
      "bg-blue-100 text-blue-700",
    PARTIAL:
      "bg-yellow-100 text-yellow-700",
    PENDING:
      "bg-orange-100 text-orange-700",
    EXPIRED:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[
          status as keyof typeof styles
        ] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}