export default function MatchLoading() {
  return (
    <main className="page">
      <div className="container stack-lg">
        <div className="card section-card">
          <div className="stack-sm" style={{ width: '60%' }}>
            <div style={{ height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.06)', width: '50%' }} />
            <div style={{ height: 18, borderRadius: 8, background: 'rgba(255,255,255,0.04)', width: '35%' }} />
          </div>
        </div>

        <div className="grid kpi-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="kpi" key={i}>
              <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.04)', width: '55%', marginBottom: 10 }} />
              <div style={{ height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', width: '35%' }} />
            </div>
          ))}
        </div>

        <div className="card section-card">
          <div style={{ height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: '30%', marginBottom: 18 }} />
          <div className="stack-sm">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 18, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        </div>

        <p className="subtle" style={{ textAlign: 'center' }}>טוען נתוני משחק...</p>
      </div>
    </main>
  );
}
