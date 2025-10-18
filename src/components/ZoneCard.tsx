import { Badge } from "@/components/ui/badge";
import type { Person, Zone } from "../types";

export function ZoneCard({
  zone,
  assigned,
  onClick,
}: {
  zone: Zone;
  assigned: Person[];
  onClick: () => void;
}) {
  return (
    <div
      className="flex flex-col w-full gap-2 rounded-2xl shadow-sm p-4 border-muted"
      onClick={onClick}
      role="button"
    >
      <div className="text-xs">{zone.label}</div>
      {assigned.length === 0 ? (
        <p className="text-sm text-muted-foreground">미배정</p>
      ) : (
        <div className="flex gap-1.5">
          {assigned.map((p) => (
            <Badge key={p.id} variant="outline" className="rounded-xl text-xs">
              {p.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
