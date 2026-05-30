interface Props {
  onFinalize: () => Promise<void>;
  onCancel: () => Promise<void>;
}

export default function AdminActions({
  onFinalize,
  onCancel,
}: Props) {
  return (
    <section className="form-card compact-card">
      <h3>Admin controls</h3>

      <div className="button-row">
        <button onClick={onFinalize}>
          Finalize Auction
        </button>

        <button onClick={onCancel} className="secondary-button">
          Cancel Auction
        </button>
      </div>
    </section>
  );
}