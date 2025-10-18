// src/features/cleaning/lib/format.ts
import type { AssignmentMap, Person, Zone, ZoneId } from "../types";

// (1) "(숫자)" → 역할명 매핑 (ZoneBoard의 numericRoleName과 동일하게 유지)
const rxNumeric = /^(.*)\((\d+)\)$/;
function roleName(n: number) {
  switch (n) {
    case 1:
      return "최선임";
    case 2:
      return "차선임";
    case 3:
      return "막내";
    case 4:
      return "막내(락스)"; // ← 현재 사용 중인 표기
    default:
      return `Slot ${n}`;
  }
}

// (2) 구역 라벨을 결과용으로 이쁘게 변환
//     예) "체단실(1)" → "체단실 최선임"
function prettyZoneLabel(label: string) {
  const m = label.match(rxNumeric);
  if (m) {
    const base = m[1].trim();
    const n = Number(m[2]);
    return `${base} ${roleName(n)}`;
  }
  return label;
}

export function toResultText(
  people: Person[],
  zones: Zone[],
  map: AssignmentMap
) {
  // zones 배열(= DEFAULT_ZONES)의 순서를 그대로 따르기 위한 인덱스 맵
  const zoneOrderById: Record<ZoneId, number> = Object.fromEntries(
    zones.map((z, i) => [z.id, i])
  );
  const zoneById: Record<ZoneId, Zone> = Object.fromEntries(
    zones.map((z) => [z.id, z])
  );

  // 미배정 제외 → zones 순서대로 정렬 → 역할명 치환해서 출력
  return people
    .filter((p) => map[p.id] !== null)
    .map((p) => {
      const zid = map[p.id] as ZoneId;
      const z = zoneById[zid];
      return {
        name: p.name,
        zoneLabel: prettyZoneLabel(z.label),
        order: zoneOrderById[zid],
      };
    })
    .sort((a, b) => a.order - b.order) // DEFAULT_ZONES 순서대로
    .map((row) => `${row.name} - ${row.zoneLabel}`)
    .join("\n");
}

// (참고) groupByZone는 그대로 사용
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
