interface StatusMessageProps {
  status: string;
}

export default function StatusMessage({
  status,
}: StatusMessageProps) {
  if (!status) return null;

  return (
    <div className="status-message">
      {status}
    </div>
  );
}