'use client';

import Link from 'next/link';

export default function MatchError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page">
      <div className="container">
        <div className="card section-card stack-md">
          <div className="notice warn">
            {error.message || 'אירעה שגיאה בטעינת נתוני המשחק.'}
          </div>
          <div className="field-row">
            <button className="button" onClick={reset}>נסה שוב</button>
            <Link className="button secondary" href="/">חזרה לחיפוש</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
