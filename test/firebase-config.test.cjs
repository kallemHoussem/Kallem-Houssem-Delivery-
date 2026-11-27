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

  assert.match(index, /databases\\/\\(default\\)\\/documents/);
  assert.match(index, /getFirestore\\(app\\)/);
  assert.doesNotMatch(index, /getFirestore\\(app\\s*,\\s*['"]default['"]\\)/);
  assert.match(admin, /databases\\/\\(default\\)\\/documents/);
  assert.match(courier, /databases\\/\\(default\\)\\/documents/);
  for (const app of [index, admin, courier]) {
    assert.doesNotMatch(app, /databases\\/default\\/documents/);
  }
});
