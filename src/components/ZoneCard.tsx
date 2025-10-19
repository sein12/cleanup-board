import { Badge } from "@/components/ui/badge";
import type { Person, PersonId, Zone } from "../types";

export function ZoneCard({
  zone,
  assigned,
  onClick,
  onUnassign,
}: {
  zone: Zone;
  assigned: Person[];
  onClick: () => void;
  onUnassign: (personId: PersonId) => void;
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
        <div
          className="flex gap-1.5"
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            onUnassign(assigned[0].id);
          }}
        >
          {assigned.map((p) => (
            <Badge key={p.id} variant="outline" className="rounded-xl text-xs">
              {assigned[0].name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
