import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[52px] w-full appearance-none rounded-[14px] border-[1.5px] border-ink bg-white px-3 text-[17px] font-medium text-ink",
        className
      )}
      {...props}
    />
  );
}

export { Input };
