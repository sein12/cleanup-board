import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Eraser, Users } from "lucide-react";

export function HeaderBar({
  onFinish,
  onReset,
}: {
  onFinish: () => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 pt-4 px-2 -mx-3 -mt-3 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:-mx-4 sm:-mt-4">
      <div className="mx-auto max-w-screen-sm p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5" />
            <h1 className="text-lg font-semibold">868기 청소판</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              <Eraser className="mr-1 size-4" /> 초기화
            </Button>
            <Button size="sm" onClick={onFinish}>
              <Check className="mr-1 size-4" /> 완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
