import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[52px] w-full appearance-none rounded-[4px] border-2 border-ink bg-white px-3 text-[17px] font-semibold text-ink shadow-[3px_3px_0_#320d59]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
