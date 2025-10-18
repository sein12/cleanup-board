import type { AssignmentMap, Person, Zone, ZoneId } from "../types";

export function toResultText(
  people: Person[],
  zones: Zone[],
  map: AssignmentMap
) {
  const zoneLabelById = Object.fromEntries(zones.map((z) => [z.id, z.label]));
  return people
    .filter((p) => map[p.id] !== null) // ⬅️ 미배정 인원 제외
    .map((p) => {
      const z = map[p.id] ? zoneLabelById[map[p.id] as ZoneId] : "미배정";
      return `${p.name} - ${z}`;
    })
    .join("\n");
}

export function groupByZone(
  people: Person[],
  zones: Zone[],
  map: AssignmentMap
) {
  const grouped = new Map<ZoneId, Person[]>();
  zones.forEach((z) => grouped.set(z.id, []));
  people.forEach((p) => {
    const z = map[p.id];
    if (z) grouped.get(z)?.push(p);
  });
  return grouped;
}
