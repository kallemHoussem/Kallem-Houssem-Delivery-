const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const source = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("all app entry points use the Firebase default Firestore database", () => {
  const index = source("index.html");
  const admin = source("gestion.html");
  const courier = source("livreur.html");

  assert.ok(index.includes("databases/(default)/documents"));
  assert.ok(index.includes("getFirestore(app)"));
  assert.ok(!index.includes("getFirestore(app,'default')"));
  assert.ok(admin.includes("databases/(default)/documents"));
  assert.ok(courier.includes("databases/(default)/documents"));
  for (const app of [index, admin, courier]) {
    assert.ok(!app.includes("databases/default/documents"));
  }
});
