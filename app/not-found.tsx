import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <div className="container">
        <div className="card section-card stack-md" style={{ textAlign: 'center', padding: '48px 28px' }}>
          <h1 style={{ fontSize: 64, marginTop: 0 }}>404</h1>
          <p className="subtle">הדף שחיפשת לא נמצא.</p>
          <div>
            <Link className="button" href="/">חזרה לדף הבית</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
