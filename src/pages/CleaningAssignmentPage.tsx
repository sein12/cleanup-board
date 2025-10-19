import { useState } from "react";
import { DEFAULT_PEOPLE, DEFAULT_ZONES } from "../data";
import { useAssignments } from "../hooks/useAssignments";
import { HeaderBar } from "../components/HeaderBar";
import { PersonPicker } from "../components/PersonPicker";
import { ZoneBoard } from "../components/ZoneBoard";
import { ResultDialog } from "../components/ResultDialog";

export default function CleaningAssignmentPage() {
  const {
    people,
    zones,
    assign,
    selected,
    resultText,
    onUnassignPerson,
    onUnassignSelected,
    unassignedPeople,
    onSelectPerson,
    onAssignToZone,
    onResetAll,
    onCopy,
  } = useAssignments(DEFAULT_PEOPLE, DEFAULT_ZONES);

  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-screen-sm p-4 sm:p-4">
      <HeaderBar onFinish={() => setOpen(true)} onReset={onResetAll} />

      <div className="space-y-4 mt-4">
        <ZoneBoard
          zones={zones}
          people={people}
          assign={assign}
          onAssign={onAssignToZone}
          onUnassign={onUnassignPerson}
        />
        <PersonPicker
          people={unassignedPeople}
          selected={selected}
          onSelect={onSelectPerson}
        />
      </div>

      <ResultDialog
        open={open}
        onOpenChange={setOpen}
        resultText={resultText}
        onCopy={onCopy}
      />
    </div>
  );
}
