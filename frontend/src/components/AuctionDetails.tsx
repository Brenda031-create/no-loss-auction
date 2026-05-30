interface Props {
  auction: any;
}

export default function AuctionDetails({
  auction,
}: Props) {
  if (!auction) {
    return <p className="empty-state">No auction loaded</p>;
  }

  return (
    <section className="details-card">
      <h3>Auction Details</h3>

      <pre>{JSON.stringify(auction, null, 2)}</pre>
    </section>
  );
}