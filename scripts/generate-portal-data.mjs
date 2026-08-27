import fs from "node:fs";

const source = "/tmp/f1db-csv";
const cutoff = 2025;

function parseCsv(file) {
  const lines = fs.readFileSync(`${source}/${file}`, "utf8").trim().split(/\r?\n/);
  const parse = (line) => {
    const values = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"') {
        if (quoted && line[index + 1] === '"') { value += '"'; index += 1; }
        else quoted = !quoted;
      } else if (character === "," && !quoted) { values.push(value); value = ""; }
      else value += character;
    }
    values.push(value);
    return values;
  };
  const headers = parse(lines.shift());
  return lines.map((line) => {
    const values = parse(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
}

const drivers = parseCsv("f1db-drivers.csv");
const constructors = parseCsv("f1db-constructors.csv");
const results = parseCsv("f1db-races-race-results.csv").filter((row) => Number(row.year) <= cutoff);
const driverStandings = parseCsv("f1db-seasons-driver-standings.csv").filter((row) => Number(row.year) <= cutoff);
const constructorStandings = parseCsv("f1db-seasons-constructor-standings.csv").filter((row) => Number(row.year) <= cutoff);
const entries = parseCsv("f1db-seasons-entrants-drivers.csv").filter((row) => Number(row.year) <= cutoff && row.testDriver !== "true");
const chronology = parseCsv("f1db-constructors-chronology.csv");

const driverById = new Map(drivers.map((driver) => [driver.id, driver]));
const constructorById = new Map(constructors.map((constructor) => [constructor.id, constructor]));
const driverStats = new Map();
const constructorStats = new Map();

for (const result of results) {
  const driver = driverStats.get(result.driverId) ?? { starts: 0, wins: 0, pointsFinishes: 0, podiums: 0 };
  if (!/did not start|withdrawn|did not qualify|did not prequalify/i.test(result.reasonRetired ?? "")) driver.starts += 1;
  if (result.positionNumber === "1") driver.wins += 1;
  if (Number(result.points) > 0) driver.pointsFinishes += 1;
  if (["1", "2", "3"].includes(result.positionNumber)) driver.podiums += 1;
  driverStats.set(result.driverId, driver);

  const team = constructorStats.get(result.constructorId) ?? { starts: new Set(), wins: 0, pointsFinishes: 0, podiums: 0, firstYear: Number(result.year), lastYear: Number(result.year) };
  team.starts.add(result.raceId);
  if (result.positionNumber === "1") team.wins += 1;
  if (Number(result.points) > 0) team.pointsFinishes += 1;
  if (["1", "2", "3"].includes(result.positionNumber)) team.podiums += 1;
  team.firstYear = Math.min(team.firstYear, Number(result.year));
  team.lastYear = Math.max(team.lastYear, Number(result.year));
  constructorStats.set(result.constructorId, team);
}

const driverTitles = new Map();
for (const row of driverStandings) if (row.championshipWon === "true") driverTitles.set(row.driverId, (driverTitles.get(row.driverId) ?? 0) + 1);
const constructorTitles = new Map();
for (const row of constructorStandings) if (row.championshipWon === "true") constructorTitles.set(row.constructorId, (constructorTitles.get(row.constructorId) ?? 0) + 1);

const currentTeamIds = ["alpine", "aston-martin", "audi", "ferrari", "mclaren", "mercedes", "racing-bulls", "red-bull", "williams"];
const lineageByRoot = new Map();
for (const root of currentTeamIds) {
  const items = chronology.filter((row) => row.parentConstructorId === root).map((row) => ({ id: row.constructorId, from: Number(row.yearFrom), to: row.yearTo ? Number(row.yearTo) : null }));
  if (!items.length) {
    const stats = constructorStats.get(root);
    items.push({ id: root, from: stats?.firstYear ?? cutoff, to: null });
  }
  lineageByRoot.set(root, items);
}

const activeRootByConstructor = {};
for (const [root, items] of lineageByRoot) for (const item of items) activeRootByConstructor[item.id] = root;

const allDrivers = Array.from(driverStats, ([id, stats]) => {
  const driver = driverById.get(id);
  const seasons = driverStandings.filter((row) => row.driverId === id).map((row) => Number(row.year));
  const teamRows = entries.filter((row) => row.driverId === id);
  const teamMap = new Map();
  for (const row of teamRows) {
    const stint = teamMap.get(row.constructorId) ?? { id: row.constructorId, from: Number(row.year), to: Number(row.year) };
    stint.from = Math.min(stint.from, Number(row.year));
    stint.to = Math.max(stint.to, Number(row.year));
    teamMap.set(row.constructorId, stint);
  }
  return {
    id,
    name: driver?.name ?? id,
    nationality: driver?.nationalityCountryId ?? "unknown",
    starts: stats.starts,
    wins: stats.wins,
    pointsFinishes: stats.pointsFinishes,
    podiums: stats.podiums,
    titles: driverTitles.get(id) ?? 0,
    debutYear: Math.min(...seasons),
    finalYear: Math.max(...seasons),
    teams: Array.from(teamMap.values()).sort((a,b) => a.from-b.from).map((team) => ({ ...team, name: constructorById.get(team.id)?.name ?? team.id, linkId: activeRootByConstructor[team.id] ?? null })),
  };
});

const allConstructors = Array.from(constructorStats, ([id, stats]) => ({
  id,
  name: constructorById.get(id)?.name ?? id,
  nationality: constructorById.get(id)?.countryId ?? "unknown",
  starts: stats.starts.size,
  wins: stats.wins,
  pointsFinishes: stats.pointsFinishes,
  podiums: stats.podiums,
  titles: constructorTitles.get(id) ?? 0,
  firstYear: stats.firstYear,
  lastYear: stats.lastYear,
  linkId: activeRootByConstructor[id] ?? null,
}));

const metricKeys = ["wins", "starts", "pointsFinishes", "podiums", "titles"];
const rank = (items, metric) => items.filter((entry) => entry[metric] > 0).sort((a,b) => b[metric]-a[metric] || b.wins-a.wins || b.titles-a.titles || a.name.localeCompare(b.name)).slice(0,50);
const rankings = {
  drivers: Object.fromEntries(metricKeys.map((metric) => [metric, rank(allDrivers, metric)])),
  constructors: Object.fromEntries(metricKeys.map((metric) => [metric, rank(allConstructors, metric)])),
};
const rankedDriverIds = new Set(metricKeys.flatMap((metric) => rankings.drivers[metric].map((entry) => entry.id)));
const rankedConstructorIds = new Set(metricKeys.flatMap((metric) => rankings.constructors[metric].map((entry) => entry.id)));
const topDrivers = allDrivers.filter((entry) => rankedDriverIds.has(entry.id)).sort((a,b) => b.wins-a.wins || a.name.localeCompare(b.name));
const topConstructors = allConstructors.filter((entry) => rankedConstructorIds.has(entry.id)).sort((a,b) => b.wins-a.wins || a.name.localeCompare(b.name));

const teamPages = currentTeamIds.filter((root) => topConstructors.some((team) => team.linkId === root)).map((root) => {
  const lineage = lineageByRoot.get(root);
  const memberIds = new Set(lineage.map((item) => item.id));
  const current = constructorById.get(root);
  return {
    id: root,
    name: current?.name ?? root,
    nationality: current?.countryId ?? "unknown",
    firstYear: Math.min(...lineage.map((item) => item.from)),
    finalYear: Math.max(...lineage.map((item) => item.to ?? 2026)),
    wins: Array.from(memberIds).reduce((sum, id) => sum + (constructorStats.get(id)?.wins ?? 0), 0),
    titles: Array.from(memberIds).reduce((sum, id) => sum + (constructorTitles.get(id) ?? 0), 0),
    lineage: lineage.map((item) => ({ ...item, name: constructorById.get(item.id)?.name ?? item.id })),
  };
});

fs.writeFileSync("app/data/portal.json", `${JSON.stringify({ cutoff, rankings, drivers: topDrivers, constructors: topConstructors, teams: teamPages }, null, 2)}\n`);
console.log(`Portal: ${topDrivers.length} ranked drivers, ${topConstructors.length} ranked constructors, ${teamPages.length} active lineage pages.`);
