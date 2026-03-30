# PUBG Stats Dashboard v4

אפליקציית Next.js לחיפוש, מעקב והשוואת שחקני PUBG דרך ה-API הרשמי.

## מה יש בפנים
- חיפוש שחקן לפי פלטפורמה: PSN / Xbox / Steam
- השוואה בין עד 4 שחקנים
- דפי שחקן מלאים: current season, ranked, lifetime, mastery, recent matches
- דף Match details עם participants ו-telemetry summary בסיסי
- מועדפים הנשמרים מקומית בדפדפן
- ממשק RTL מלא בעברית
- קריאות API דרך השרת כדי לא לחשוף את ה-API key בדפדפן

## הרצה
```bash
cp .env.example .env.local
# הכנס PUBG_API_KEY לקובץ .env.local
npm install
npm run dev
```

## הערות
- יש להנפיק API key דרך PUBG Developer Portal
- חלק מנתוני telemetry תלויים בכך שה-asset זמין וניתן למשיכה
- מומלץ לפרוס ל-Vercel
