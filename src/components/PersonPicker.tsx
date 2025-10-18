import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import type { Person, PersonId } from "../types";

export function PersonPicker({
  people,
  selected,
  onSelect,
}: {
  people: Person[];
  selected: PersonId | null;
  onSelect: (pid: PersonId) => void;
}) {
  return (
    <div className="sticky bottom-6 z-10 rounded-2xl border p-3 shadow-sm bg-white">
      {/* 전체를 한 줄 정렬: 왼쪽 스크롤 리스트 + 오른쪽 버튼 */}
      <ScrollArea className="w-full">
        {/* 한 줄 유지 & 가로 스크롤 & 스냅 */}
        <div className="flex flex-nowrap items-center gap-2 py-1 pr-4 whitespace-nowrap snap-x snap-mandatory">
          {people.map((p) => (
            <Badge
              key={p.id}
              variant={selected === p.id ? "default" : "secondary"}
              className={cn(
                "select-none px-3 py-2 text-sm rounded-2xl shrink-0 snap-start",
                selected === p.id && "ring-2 ring-primary/40"
              )}
              onClick={() => onSelect(p.id)}
            >
              <User className="mr-1 size-4" /> {p.name}
            </Badge>
          ))}
        </div>
        {/* 가로 스크롤바 표시 */}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
