DEPLOY NOTA + SUPABASE

1. Jalankan supabase-schema.sql di Supabase SQL Editor sampai sukses.
2. Upload index.html ke repository GitHub (rename as index.html if needed).
3. Enable GitHub Pages from the repository settings, or deploy the repository to Vercel.
4. The Supabase publishable key is intentionally in index.html. Never put a service_role/secret key there.
5. The current baseline UI is preserved; the cloud adapter is included without replacing the existing nota UI.

IMPORTANT:
This package prepares the Supabase connection and cloud adapter. The original baseline's exact
localStorage key is detected from its code at build time; if the original app does not expose a
single history array, the cloud adapter will not automatically rewrite its business logic.
Use the app's existing save/edit/delete hooks to call:
  NotaCloud.upsert(note)
  NotaCloud.remove(notaNo)
  NotaCloud.all()
