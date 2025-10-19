// src/features/cleaning/hooks/useAssignments.ts
import { useMemo, useState } from "react";
import type { AssignmentMap, Person, PersonId, Zone, ZoneId } from "../types";
import { toResultText } from "../lib/format";
import { toast } from "sonner";

export function useAssignments(initialPeople: Person[], initialZones: Zone[]) {
  const [people] = useState<Person[]>(initialPeople);
  const [zones] = useState<Zone[]>(initialZones);
  const [selected, setSelected] = useState<PersonId | null>(null);
  const [assign, setAssign] = useState<AssignmentMap>(
    () =>
      Object.fromEntries(
        initialPeople.map((p) => [p.id, null])
      ) as AssignmentMap
  );

  // ✅ 미배정 인원 목록 (목록에서 배정된 사람 자동 숨김)
  const unassignedPeople = useMemo(
    () => people.filter((p) => assign[p.id] == null),
    [people, assign]
  );

  const resultText = useMemo(
    () => toResultText(people, zones, assign),
    [people, zones, assign]
  );

  const onSelectPerson = (pid: PersonId) =>
    setSelected((cur) => (cur === pid ? null : pid));

  const onAssignToZone = (zoneId: ZoneId) => {
    if (!selected) return;
    setAssign((prev) => {
      // 한 구역 1명: zoneId에 기존 배정자 있으면 해제 → 새 사람으로 교체
      const alreadyAssignedPerson = Object.entries(prev).find(
        ([, z]) => z === zoneId
      )?.[0];
      if (alreadyAssignedPerson && alreadyAssignedPerson !== selected) {
        return { ...prev, [alreadyAssignedPerson]: null, [selected]: zoneId };
      }
      return { ...prev, [selected]: zoneId };
    });
  };

  // ✅ 특정 사람 배정 해제(배지 클릭 시 사용)
  const onUnassignPerson = (pid: PersonId) => {
    setAssign((prev) => ({ ...prev, [pid]: null }));
    if (selected === pid) setSelected(null);
  };

  const onUnassignSelected = () => {
    if (!selected) return;
    setAssign((prev) => ({ ...prev, [selected]: null }));
  };

  const onResetAll = () => {
    setAssign(
      Object.fromEntries(people.map((p) => [p.id, null])) as AssignmentMap
    );
    setSelected(null);
    toast("초기화 완료", { description: "모든 배정이 해제되었습니다." });
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      toast("복사 완료", { description: resultText });
    } catch {
      toast("복사 실패", { description: "브라우저 권한을 확인해주세요." });
    }
  };

  return {
    people,
    zones,
    assign,
    selected,
    resultText,
    // ✅ 추가된 반환값
    unassignedPeople,
    onUnassignPerson,

    onSelectPerson,
    onAssignToZone,
    onUnassignSelected,
    onResetAll,
    onCopy,
  };
}
