// 단일 파일 버전: Zustand 제거 + shadcn/ui 적용
// 파일 경로 예시: src/pages/CleaningPage.tsx

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- 타입 ---
type Person = { id: string; name: string };
type Zone = { id: string; label: string; order: number };
// zoneId -> personId | null
type AssignmentMap = Record<string, string | null>;

// --- 샘플 데이터 ---
const initialPeople: Person[] = [
  { id: "kdh", name: "김도헌" },
  { id: "rjk", name: "류제경" },
  { id: "bhj", name: "방뇨정" },
  { id: "jih", name: "박지환" },
  { id: "pms", name: "박민성" },
  { id: "psm", name: "박상민" },
  { id: "pjy", name: "박준영" },
  { id: "ygw", name: "윤건우" },
  { id: "isj", name: "임성재" },
  { id: "lss", name: "이승섭" },
  { id: "lsy", name: "이승윤" },
  { id: "chs", name: "조현성" },
  { id: "cse", name: "최세인" },
  { id: "csm", name: "최성민" },
];

const fixedZones: Zone[] = [
  // (주석 처리된 구역들은 필요시 다시 추가)
  { id: "zone17", label: "우계단 걸", order: 17 },
  { id: "zone18", label: "우계단 빗", order: 18 },
  { id: "zone19", label: "좌계단 걸", order: 19 },
  { id: "zone20", label: "좌계단 빗", order: 20 },
  { id: "zone21", label: "중계단 걸", order: 21 },
  { id: "zone22", label: "중계단 빗", order: 22 },
  { id: "zone23", label: "복도2 생걸", order: 23 },
  { id: "zone24", label: "복도2 우중걸", order: 24 },
  { id: "zone25", label: "복도2 우중빗", order: 25 },
  { id: "zone26", label: "복도2 좌중걸", order: 26 },
  { id: "zone27", label: "복도2 좌중빗", order: 27 },
  { id: "zone28", label: "전자레인지", order: 28 },
  { id: "zone29", label: "우건조기", order: 29 },
  { id: "zone30", label: "좌건조기", order: 30 },
  { id: "zone31", label: "샤워장(1)", order: 31 },
  { id: "zone32", label: "샤워장(2)", order: 32 },
  { id: "zone33", label: "샤워장(3)", order: 33 },
  { id: "zone34", label: "우화3(1)", order: 34 },
  { id: "zone35", label: "우화3(2)", order: 35 },
  { id: "zone36", label: "우화3(3)", order: 36 },
];

// --- 유틸 ---
function normalizeRange(a: number, b: number): [number, number] {
  return a <= b ? [a, b] : [b, a];
}
function inRange(idx: number, s: number | null, e: number | null) {
  if (s === null || e === null) return false;
  const [start, end] = normalizeRange(s, e);
  return idx >= start && idx <= end;
}
function formatResult(assign: AssignmentMap, people: Person[], zones: Zone[]) {
  const pMap = Object.fromEntries(people.map((p) => [p.id, p.name]));
  const zSorted = [...zones].sort((a, b) => a.order - b.order);
  return zSorted
    .filter((z) => assign[z.id])
    .map((z) => `${pMap[assign[z.id] as string]} - ${z.label}`)
    .join("\n");
}

// =============================
// 단일 페이지 컴포넌트
// =============================
export default function App() {
  // 상태: 인원/구역/배정/범위/모달
  const [people] = useState<Person[]>(initialPeople);
  const [zones] = useState<Zone[]>(fixedZones);
  const [assign, setAssign] = useState<AssignmentMap>(
    () =>
      Object.fromEntries(fixedZones.map((z) => [z.id, null])) as AssignmentMap
  );
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // 파생 값들
  const zSorted = useMemo(
    () => [...zones].sort((a, b) => a.order - b.order),
    [zones]
  );
  const zoneIdsInRange = useMemo(() => {
    if (rangeStart === null || rangeEnd === null) return [] as string[];
    const [s, e] = normalizeRange(rangeStart, rangeEnd);
    return zSorted.slice(s, e + 1).map((z) => z.id);
  }, [rangeStart, rangeEnd, zSorted]);

  const nextEmptyZoneId = useMemo(() => {
    for (const zid of zoneIdsInRange) if (!assign[zid]) return zid;
    return null;
  }, [zoneIdsInRange, assign]);

  const assignedPersonIds = new Set(
    Object.values(assign).filter(Boolean) as string[]
  );
  const availablePeople = people.filter((p) => !assignedPersonIds.has(p.id));

  // 액션
  const pickZoneIndex = (idx: number) => {
    if (rangeStart === null) return setRangeStart(idx);
    if (rangeEnd === null) {
      setRangeEnd(idx);
    } else {
      setRangeStart(idx);
      setRangeEnd(null);
    }
  };

  const pickPerson = (pid: string) => {
    if (!nextEmptyZoneId) return;
    setAssign((cur) => ({ ...cur, [nextEmptyZoneId]: pid }));
  };

  const unassignZone = (zoneId: string) =>
    setAssign((cur) => ({ ...cur, [zoneId]: null }));

  const reset = () => {
    setAssign(
      Object.fromEntries(zones.map((z) => [z.id, null])) as AssignmentMap
    );
    setRangeStart(null);
    setRangeEnd(null);
  };

  const result = useMemo(
    () => formatResult(assign, people, zones),
    [assign, people, zones]
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch {}
  };

  // 뷰
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-4">
        <header className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur flex items-center justify-between">
          <h1 className="text-2xl font-bold">청소 구역 배정</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={reset}>
              초기화
            </Button>
            <Button onClick={() => setOpen(true)}>완료</Button>
          </div>
        </header>

        {/* 좌: 구역 선택 / 우: 인원 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 구역 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">구역 선택 (시작/끝)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 w-full pr-1">
                <div className="flex flex-col gap-2">
                  {zSorted.map((z, idx) => {
                    const active = inRange(idx, rangeStart, rangeEnd); // 범위 내부
                    const isStart = idx === rangeStart;
                    const isEnd = idx === rangeEnd;

                    return (
                      <Button
                        key={z.id}
                        onClick={() => pickZoneIndex(idx)}
                        title={`순서 ${z.order}`}
                        variant={active ? "secondary" : "outline"}
                        className={[
                          "w-full justify-between",
                          // 시작/끝 강조: 테두리/링 + 진한 폰트
                          isStart || isEnd ? "bg-primary/20 font-semibold" : "",
                        ].join(" ")}
                      >
                        <span>{z.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 인원 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">인원 (배정 대기)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 pr-2">
                <div className="flex flex-col gap-2">
                  {availablePeople.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      배정 대기 인원이 없습니다.
                    </p>
                  )}
                  {availablePeople.map((p) => (
                    <Button
                      key={p.id}
                      variant="outline"
                      disabled={!nextEmptyZoneId}
                      onClick={() => pickPerson(p.id)}
                      className="justify-between"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        다음 구역에 배정
                      </span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 구역별 배정: 깔끔한 리스트 UI */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">구역별 배정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              {zSorted.map((z, i) => {
                const pid = assign[z.id];
                const person = people.find((p) => p.id === pid);
                const inSel = zoneIdsInRange.includes(z.id);
                if (!!inSel) {
                  return (
                    <div
                      key={z.id}
                      className={[
                        "flex items-center justify-between gap-3 px-3 py-2",
                        i !== zSorted.length - 1 ? "border-b" : "",
                        // 범위에 포함된 항목은 살짝 하이라이트
                        inSel ? "bg-background" : "bg-background",
                        "hover:bg-muted/60 transition-colors",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={inSel ? "secondary" : "outline"}
                          className="w-28 justify-center"
                        >
                          {z.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {person ? (
                          <>
                            <Badge variant="outline" className="px-3 py-1">
                              {person.name}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => unassignZone(z.id)}
                              title="배정 취소"
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            미배정
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>결과</DialogTitle>
            </DialogHeader>

            <Textarea readOnly className="h-56" value={result} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={copy}>
                복사
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
