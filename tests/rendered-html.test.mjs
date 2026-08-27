import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders ranking-first home with linked records", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /歴代ランキング/);
  assert.match(html, /Lewis Hamilton/);
  assert.match(html, /\/drivers\/lewis-hamilton/);
  assert.match(html, /\/teams\/alpine/);
  assert.match(html, /1950—2025/);
  assert.doesNotMatch(html, /\/timeline|年表/);
});

test("keeps the detail-page scope exact", async () => {
  const portal = JSON.parse(await readFile(new URL("../app/data/portal.json", import.meta.url), "utf8"));
  assert.equal(portal.cutoff, 2025);
  assert.equal(portal.rankings.drivers.wins.length, 50);
  assert.equal(portal.rankings.drivers.starts.length, 50);
  assert.equal(portal.rankings.drivers.pointsFinishes.length, 50);
  assert.equal(portal.rankings.drivers.podiums.length, 50);
  assert.equal(portal.rankings.drivers.titles.length, 35);
  assert.equal(portal.rankings.constructors.titles.length, 15);
  assert.ok(portal.drivers.length > 50);
  assert.ok(portal.constructors.length > 50);
  assert.equal(portal.teams.length, 9);
  assert.equal(portal.drivers[0].name, "Lewis Hamilton");
  assert.equal(portal.drivers[0].starts, 380);
  assert.equal(portal.constructors.find((team) => team.id === "lotus").linkId, null);
  assert.equal(portal.constructors.find((team) => team.id === "renault").linkId, "alpine");
});
