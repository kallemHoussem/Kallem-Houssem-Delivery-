const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  Timestamp,
} = require("firebase/firestore");

const projectId = "demo-jibli";
const adminUid = "f4vrNGRMPCZGXiVPLp6lg9BerZP2";
const rules = fs.readFileSync(path.resolve(__dirname, "../firestore.rules"), "utf8");
let env;

function order(overrides = {}) {
  return {
    kind: "commande",
    nom: "Test Client",
    adr: "Test address",
    text: "Test order",
    total: 25,
    status: "new",
    tel: "20123456",
    maps: "",
    ts: Timestamp.now(),
    ...overrides,
  };
}

function courier(email) {
  return {
    name: "Test Courier",
    phone: "20111111",
    email,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

test.before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: { host: "127.0.0.1", port: 8080, rules },
  });
  await env.clearFirestore();
});

test.after(async () => {
  if (env) await env.cleanup();
});

test("customer, admin, and courier order lifecycle is rule-protected", async () => {
  const guest = env.unauthenticatedContext().firestore();
  const client = env.authenticatedContext("customer-1", { email: "customer@example.test" }).firestore();
  const stranger = env.authenticatedContext("customer-2", { email: "other@example.test" }).firestore();
  const admin = env.authenticatedContext(adminUid, { email: "ay3afsa@gmail.com" }).firestore();
  const pending = env.authenticatedContext("courier-pending", { email: "pending@example.test" }).firestore();
  const pending2 = env.authenticatedContext("courier-pending-2", { email: "pending2@example.test" }).firestore();

  const guestOrderRef = doc(guest, "orders/guest-order");
  await assertSucceeds(setDoc(guestOrderRef, order()));
  await assertFails(getDoc(guestOrderRef));
  await assertFails(setDoc(doc(guest, "orders/bad-order"), order({ total: -1 })));
  await assertFails(setDoc(doc(guest, "orders/extra-field"), order({ isAdmin: true })));

  const customerOrderRef = doc(client, "orders/customer-order");
  await assertSucceeds(setDoc(customerOrderRef, order({ uid: "customer-1" })));
  await assertSucceeds(getDoc(customerOrderRef));
  await assertFails(getDoc(doc(stranger, "orders/customer-order")));
  await assertFails(setDoc(doc(client, "orders/spoofed-order"), order({ uid: "customer-2" })));
  await assertFails(updateDoc(customerOrderRef, { status: "confirmed" }));

  await assertSucceeds(setDoc(doc(pending, "couriers/courier-pending"), courier("pending@example.test")));
  await assertFails(updateDoc(doc(pending, "couriers/courier-pending"), { status: "approved" }));
  await assertSucceeds(setDoc(doc(pending2, "couriers/courier-pending-2"), courier("pending2@example.test")));

  await assertSucceeds(updateDoc(doc(admin, "couriers/courier-pending"), { status: "approved" }));
  await assertFails(updateDoc(doc(stranger, "couriers/courier-pending-2"), { status: "approved" }));

  await assertSucceeds(updateDoc(doc(admin, "orders/customer-order"), { status: "confirmed" }));
  await assertFails(updateDoc(doc(admin, "orders/customer-order"), {
    status: "accepted",
    courierUid: "courier-pending-2",
  }));
  await assertSucceeds(updateDoc(doc(admin, "orders/customer-order"), {
    status: "accepted",
    courierUid: "courier-pending",
  }));
  await assertSucceeds(getDoc(doc(pending, "orders/customer-order")));
  await assertFails(getDoc(doc(pending2, "orders/customer-order")));
  await assertFails(updateDoc(doc(pending, "orders/customer-order"), { status: "cancel" }));
  await assertFails(updateDoc(doc(pending, "orders/customer-order"), { tel: "99999999" }));
  await assertSucceeds(updateDoc(doc(pending, "orders/customer-order"), { status: "done" }));
  await assertFails(updateDoc(doc(pending, "orders/customer-order"), { status: "accepted" }));

  await assertSucceeds(setDoc(doc(admin, "gestion/main"), { data: "{}" }));
  await assertSucceeds(getDocs(collection(guest, "restaurants")));
  await assertSucceeds(getDocs(collection(guest, "shops")));
  await assertFails(getDocs(collection(guest, "privateCollection")));
  await assertFails(setDoc(doc(admin, "privateCollection/doc"), { value: true }));
});
