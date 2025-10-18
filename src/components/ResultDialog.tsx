import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ResultDialog({
  open,
  onOpenChange,
  resultText,
  onCopy,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  resultText: string;
  onCopy: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>담당자 결과</DialogTitle>
        </DialogHeader>
        <div className="rounded-xl border bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre">
          {resultText}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button
            onClick={() => {
              onCopy();
              onOpenChange(false);
            }}
          >
            복사하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
