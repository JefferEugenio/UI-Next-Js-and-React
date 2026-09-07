export default function StatCard({ label, value, detail, accent }) {
  return (
    <article className="border-b border-line pb-5 sm:border-b-0 sm:border-r sm:pr-6 last:border-0">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </article>
  );
}
