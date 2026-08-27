import Link from "next/link";
import portal from "./data/portal.json";

const driverByName = new Map(portal.drivers.map((driver) => [driver.name, driver]));
const constructorByName = new Map(portal.constructors.map((team) => [team.name, team]));

export function DriverRecordLink({ name }: { name: string }) {
  const driver = driverByName.get(name);
  return driver ? <Link className="record-link" href={`/drivers/${driver.id}`}>{name}</Link> : <>{name}</>;
}

export function TeamRecordLink({ id, name }: { id?: string; name: string }) {
  const team = id ? portal.constructors.find((entry) => entry.id === id) : constructorByName.get(name);
  const linkId = team?.linkId ?? portal.teams.find((entry) => entry.id === id)?.id ?? null;
  return linkId ? <Link className="record-link" href={`/teams/${linkId}`}>{name}</Link> : <>{name}</>;
}
