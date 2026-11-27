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


test("PWA icons include install sizes and the offline shell", () => {
  const manifest = JSON.parse(source("manifest.webmanifest"));
  const serviceWorker = source("service-worker.js");
  const index = source("index.html");
  const bySize = new Map(manifest.icons.map((icon) => [icon.sizes, icon.src]));

  for (const size of ["192x192", "512x512"]) {
    const icon = bySize.get(size);
    assert.ok(icon, `manifest should declare a ${size} icon`);
    assert.ok(fs.existsSync(path.join(root, icon)), `icon file should exist: ${icon}`);
    assert.ok(serviceWorker.includes(icon), `offline shell should cache ${icon}`);
  }
  assert.ok(index.includes('rel="apple-touch-icon" href="./icons/icon-180.png"'));
  assert.ok(fs.existsSync(path.join(root, "icons/icon-180.png")));
});
