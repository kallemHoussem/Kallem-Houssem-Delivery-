# Jibli

Jibli is a mobile-first delivery web app. The customer experience is served from `index.html`; administration is served from `gestion.html`.

## Progressive Web App
- Installable manifest at `manifest.webmanifest`.
- Static-shell service worker at `service-worker.js`.
- Firebase/API requests are intentionally not cached; order and account operations require a network connection.

## Important deployment and security notes
- Keep Firebase Authentication and Firestore security rules configured in the Firebase Console before production use.
- Do not put service-account credentials or private keys in this repository.
- The courier screen is not present in the current `main` branch snapshot. A courier workflow must be implemented with server-enforced courier approval and order assignment before it is exposed; client-side hiding is not authorization.
- Deploy this branch only after testing Firebase sign-in, order creation, admin permissions, and Firestore rules.

## Branch
This work is being prepared on `jibli-modern-v2`; the production `main` branch is unchanged.
