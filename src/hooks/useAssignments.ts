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

  const resultText = useMemo(
    () => toResultText(people, zones, assign),
    [people, zones, assign]
  );

  const onSelectPerson = (pid: PersonId) =>
    setSelected((cur) => (cur === pid ? null : pid));

  const onAssignToZone = (zoneId: ZoneId) => {
    if (!selected) return;
    setAssign((prev) => {
      // 1️⃣ 이미 그 구역에 배정된 사람이 있는지 확인
      const alreadyAssignedPerson = Object.entries(prev).find(
        ([, z]) => z === zoneId
      )?.[0];
      if (alreadyAssignedPerson && alreadyAssignedPerson !== selected) {
        // 기존 배정 해제
        const updated: AssignmentMap = {
          ...prev,
          [alreadyAssignedPerson]: null,
          [selected]: zoneId,
        };
        return updated;
      }
      return { ...prev, [selected]: zoneId };
    });
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
      toast("복사 실패", {
        description: "브라우저 권한을 확인해주세요.",
      });
    }
  };

  return {
    people,
    zones,
    assign,
    selected,
    resultText,
    onSelectPerson,
    onAssignToZone,
    onUnassignSelected,
    onResetAll,
    onCopy,
  };
}
