# Jibli

Jibli is a mobile-first delivery web app with three entry points:

- `index.html`: customer storefront, account, checkout, and order history.
- `livreur.html`: courier sign-in, access request, approval state, and assigned deliveries.
- `gestion.html`: administrator dashboard, order management, courier approval, and assignment.

## Firebase project

The app configuration points to `kallem-houssem-gestion`. The linked Firebase Console was checked and showed this same project. Email/Password and Google sign-in are enabled; Phone sign-in is enabled in Firebase but is not used by this app.

The rules in `firestore.rules` are a local proposed ruleset. They have **not** been deployed. They restrict admin access to the current admin Auth UID, require courier approval before assignment or delivery access, and deny access to unlisted collections. If the admin account is replaced, review and update the UID in both `firestore.rules` and `gestion.html`.

Before production use, compare the proposed rules with the live data model, test them in the Firebase Emulator Suite, and deploy them only after a separate review. The live Firestore rules differ from this branch. Do not deploy these rules without confirming that existing records and every client write use the expected fields.

## Order flow

1. Customers can submit guest orders or sign in and associate an order with their account.
2. The admin confirms or cancels an order, then assigns an approved courier.
3. An approved courier sees assigned work and may mark an accepted order delivered.
4. The admin dashboard refreshes order data periodically. Customer and courier access is enforced by Firestore rules.

The storefront can still send the order through WhatsApp. If the Firestore write fails, it reports that the order was not registered in the dashboard so the customer can confirm by phone.

## Progressive Web App

- `manifest.webmanifest` declares the installable customer app.
- `service-worker.js` caches only the public static shell and never caches Firebase or authenticated responses.
- `test.html` performs read-only checks of the app shell and manifest; it does not sign in or write to Firebase.

Install prompts depend on a supported browser and HTTPS. iPhone users may need Safari's Add to Home Screen flow. Verify installation on real iOS and Android devices before release.

## Security notes

- The Firebase web API key is a public client identifier, not a secret. Do not add service account credentials or private keys to this repository.
- Guest checkout is intentionally available. It can create an order but cannot read or edit it later. Production abuse controls and bot protection still need a separate review.
- Admin session refresh tokens are stored for the current browser session only.
- New courier accounts start as `pending`; only an admin can approve, disable, or re-enable them.

## Release status

Work is prepared on `jibli-modern-v2`. The `main` branch, live Firebase configuration, and production data have not been changed. No merge or production deployment has been performed.

## Firestore rules tests

Install the development dependencies with `npm install`, then run `npm run test:rules`. This starts only the local Firestore Emulator using the non-production project ID `demo-jibli` and exercises guest checkout, customer ownership, courier approval, assignment, delivery completion, and denied access. It does not connect to Firebase production.
