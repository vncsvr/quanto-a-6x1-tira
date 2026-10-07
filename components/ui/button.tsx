import * as React from "react";
import { cn } from "@/lib/utils";

function Button({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "condensada block h-[64px] w-full -rotate-1 cursor-pointer rounded-[4px] border-0 bg-vermelho text-[24px] text-white shadow-[1px_1px_0_#a20301,2px_2px_0_#a20301,3px_3px_0_#a20301,4px_4px_0_#a20301,5px_5px_0_#a20301,6px_6px_0_#a20301] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_#a20301,2px_2px_0_#a20301]",
        className
      )}
      {...props}
    />
  );
}

export { Button };
