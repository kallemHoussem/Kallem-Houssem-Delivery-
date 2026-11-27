# Jibli

Jibli is a mobile-first delivery web app.

## App entry points
- `index.html`: customer storefront and checkout.
- `livreur.html`: courier sign-in, pending approval, and assigned deliveries.
- `gestion.html`: admin dashboard, order management, courier approvals, and courier assignment.

## Progressive Web App
- Installable manifest: `manifest.webmanifest`.
- Static-shell service worker: `service-worker.js`.
- Firebase/API requests are intentionally not cached; account and order operations require a network connection.

## Firebase setup required before production
- Review `firestore.rules` against the live Firebase project and deploy them from the Firebase Console/CLI. The file in this branch is a proposed ruleset; it has NOT been deployed.
- The rules use `ay3afsa@gmail.com` as the administrator email.
- Confirm Firebase Authentication email/password and the customer Google provider are enabled as needed.
- Test guest checkout, signed-in customer orders, courier application, admin approval, courier assignment, and courier delivery completion with test accounts.
- Do not put service-account credentials or private keys in this repository.

## Important safety note
The current customer checkout still supports guest orders. The proposed Firestore rules permit guest order creation but prevent guests from reading or modifying orders. Review abuse controls and the exact production data model before deployment.

## Branch
Changes are prepared on `jibli-modern-v2`. The production `main` branch has not been changed or deployed.
