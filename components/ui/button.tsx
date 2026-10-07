import * as React from "react";
import { cn } from "@/lib/utils";

function Button({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "block h-[60px] w-full cursor-pointer rounded-[30px] border-0 bg-ink font-display text-[17px] font-bold text-white",
        className
      )}
      {...props}
    />
  );
}

export { Button };
