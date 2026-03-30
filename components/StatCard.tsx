type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="kpi">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}
