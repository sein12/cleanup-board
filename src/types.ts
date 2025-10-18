export type ZoneId = string;
export type PersonId = string;

export type Person = {
  id: PersonId;
  name: string;
};

export type Zone = {
  id: ZoneId;
  label: string; // 예: "좌화2"
};

export type AssignmentMap = Record<PersonId, ZoneId | null>; // 각 사람 → 1개 구역
