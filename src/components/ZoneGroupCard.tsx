// src/features/cleaning/components/ZoneGroupCard.tsx
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Person, PersonId, Zone, ZoneId } from "../types";
import { cn } from "@/lib/utils";

export function ZoneGroupCard({
  baseLabel,
  items,
  onAssign,
  onUnassign,
}: {
  baseLabel: string;
  items: Array<{ zone: Zone; roleLabel: string; assigned: Person[] }>;
  onAssign: (zoneId: ZoneId) => void;
  onUnassign: (personId: PersonId) => void;
}) {
  return (
    <div className="rounded-2xl border p-3 shadow-sm">
      {/* 상단 큰 라벨 */}
      <Label className="text-sm font-medium mb-2 block">{baseLabel}</Label>

      {/* 하위 역할 슬롯들 */}
      <div className="flex gap-2">
        {items.map(({ zone, roleLabel, assigned }) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onAssign(zone.id)}
            className={cn(
              "rounded-xl border w-full p-2 text-left transition-colors",
              "hover:bg-muted/40 active:scale-[0.99]"
            )}
          >
            <div className="mb-1 text-xs">{roleLabel}</div>
            {assigned.length === 0 ? (
              <p className="text-xs text-muted-foreground">미배정</p>
            ) : (
              <Badge
                onClick={(e) => {
                  e.stopPropagation();
                  onUnassign(assigned[0].id);
                }}
                variant="outline"
                className="rounded-xl text-xs"
              >
                {assigned[0].name}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
