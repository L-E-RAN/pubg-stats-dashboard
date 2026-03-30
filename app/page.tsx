import { SearchPanel } from '@/components/SearchPanel';
import { FavoritesPanel } from '@/components/FavoritesPanel';

export default function HomePage() {
  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <div className="card hero-card">
            <span className="badge">PUBG Developer API powered</span>
            <h1>דשבורד מלא לחיפוש, מעקב והשוואת שחקני PUBG.</h1>
            <p className="subtle" style={{ marginTop: 18 }}>
              חפש שחקן בודד לפי פלטפורמה, קבל סטטיסטיקות עונה נוכחית, lifetime, ranked, mastery,
              משחקים אחרונים והשוואה בין עד 4 שחקנים יחד — עם ממשק RTL מלא בעברית.
            </p>
            <div className="pill-row">
              <span className="pill">PSN / Xbox / Steam</span>
              <span className="pill">השוואה עד 4</span>
              <span className="pill">משחקים אחרונים</span>
              <span className="pill">מועדפים מקומיים</span>
            </div>
          </div>

          <SearchPanel />
        </section>

        <section className="card section-card">
          <div className="section-title">
            <h2>מה יש במערכת</h2>
            <span className="pill">v4</span>
          </div>

          <div className="grid kpi-grid">
            <div className="kpi">
              <span className="label">חיפוש שחקן</span>
              <span className="value">מיידי</span>
            </div>
            <div className="kpi">
              <span className="label">שחקנים להשוואה</span>
              <span className="value">4</span>
            </div>
            <div className="kpi">
              <span className="label">פלטפורמות</span>
              <span className="value">3</span>
            </div>
            <div className="kpi">
              <span className="label">מפתח API</span>
              <span className="value">מוגן</span>
            </div>
          </div>

          <p className="footer-note">
            הוסף את ה-API key שלך בקובץ .env.local, והמערכת תעבוד דרך השרת בלי לחשוף את המפתח לדפדפן.
          </p>
        </section>

        <div style={{ marginTop: 24 }}>
          <FavoritesPanel />
        </div>
      </div>
    </main>
  );
}
