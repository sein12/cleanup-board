// src/features/cleaning/components/ZoneBoard.tsx
import type { AssignmentMap, Person, Zone, ZoneId, PersonId } from "../types";
import { groupByZone } from "../lib/format";
import { useMemo } from "react";
import { ZoneCard } from "./ZoneCard";
import { ZoneGroupCard } from "./ZoneGroupCard";

type GroupItem = { zone: Zone; roleLabel: string; order?: number };
type ZoneGroup = { base: string; items: GroupItem[] };

const rxNumeric = /^(.*)\((\d+)\)$/; // base + (n)
const rxCorridor = /^(복도[0-9]+)\s+(생걸|우중걸|우중빗|좌중걸|좌중빗)$/;
const rxStairs = /^(우계단|좌계단|중계단)\s+(걸|빗)$/;
const rxDryer = /^(우|좌)건조기$/;

function numericRoleName(n: number) {
  switch (n) {
    case 1:
      return "최선임";
    case 2:
      return "차선임";
    case 3:
      return "막내";
    case 4:
      return "막내(락스)";
    default:
      return `Slot ${n}`;
  }
}

function splitZones(zones: Zone[]): { singles: Zone[]; groups: ZoneGroup[] } {
  const groupMap = new Map<string, GroupItem[]>();
  const singles: Zone[] = [];

  for (const z of zones) {
    const lbl = z.label.trim();

    // 1) 괄호 숫자
    let m = lbl.match(rxNumeric);
    if (m) {
      const base = m[1].trim();
      const order = Number(m[2]);
      const roleLabel = numericRoleName(order);
      const arr = groupMap.get(base) ?? [];
      arr.push({ zone: z, roleLabel, order });
      groupMap.set(base, arr);
      continue;
    }

    // 2) 복도군
    m = lbl.match(rxCorridor);
    if (m) {
      const base = m[1]; // 복도3 | 복도2
      const roleLabel = m[2]; // 생걸 | 우중걸 | ...
      const arr = groupMap.get(base) ?? [];
      arr.push({ zone: z, roleLabel });
      groupMap.set(base, arr);
      continue;
    }

    // 3) 계단군
    m = lbl.match(rxStairs);
    if (m) {
      const base = m[1]; // 우계단 | 좌계단 | 중계단
      const roleLabel = m[2]; // 걸 | 빗
      const arr = groupMap.get(base) ?? [];
      arr.push({ zone: z, roleLabel });
      groupMap.set(base, arr);
      continue;
    }

    // 4) 건조기
    m = lbl.match(rxDryer);
    if (m) {
      const dir = m[1]; // 우 | 좌
      const base = "건조기";
      const roleLabel = dir;
      const arr = groupMap.get(base) ?? [];
      arr.push({ zone: z, roleLabel });
      groupMap.set(base, arr);
      continue;
    }

    // 기타: 단일
    singles.push(z);
  }

  const groups: ZoneGroup[] = Array.from(groupMap.entries()).map(
    ([base, items]) => {
      const hasOrder = items.some((i) => typeof i.order === "number");
      const sorted = hasOrder
        ? [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [...items].sort((a, b) => a.roleLabel.localeCompare(b.roleLabel));
      return { base, items: sorted };
    }
  );

  return { singles, groups };
}

export function ZoneBoard({
  zones,
  people,
  assign,
  onAssign,
  onUnassign,
}: {
  zones: Zone[];
  people: Person[];
  assign: AssignmentMap;
  onAssign: (zoneId: ZoneId) => void;
  onUnassign: (personId: PersonId) => void;
}) {
  const groupedAssigned = useMemo(
    () => groupByZone(people, zones, assign),
    [people, zones, assign]
  );
  const { singles, groups } = useMemo(() => splitZones(zones), [zones]);

  return (
    <section className="space-y-3">
      {/* 단일 구역 */}
      {singles.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {singles.map((z) => (
            <ZoneCard
              key={z.id}
              zone={z}
              assigned={groupedAssigned.get(z.id) ?? []}
              onClick={() => onAssign(z.id)}
              onUnassign={onUnassign}
            />
          ))}
        </div>
      )}

      {/* 그룹 구역: 체단실/휴게실/우화3/좌화3/사지방/샤워장 등 */}
      {groups.length > 0 && (
        <div className="space-y-2">
          {groups.map((g) => (
            <ZoneGroupCard
              key={g.base}
              baseLabel={g.base}
              items={g.items.map(({ zone, roleLabel }) => ({
                zone,
                roleLabel,
                assigned: groupedAssigned.get(zone.id) ?? [],
              }))}
              onAssign={onAssign}
              onUnassign={onUnassign}
            />
          ))}
        </div>
      )}
    </section>
  );
}
