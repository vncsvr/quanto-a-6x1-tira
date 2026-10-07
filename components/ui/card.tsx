"use client";

import * as React from "react";
import * as m from "motion/react-m";
import { type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

// Cartão com filete colorido à esquerda (--c); fica cinza quando a 6x1 liga.
function Card({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <m.div
      data-slot="card"
      className={cn(
        "rounded-[18px] border-l-[6px] border-l-(--c) bg-white py-3.5 pr-3.5 pl-4 transition-colors duration-600 gray:border-l-[#5F656B] gray:bg-[#DADCDF]",
        className
      )}
      {...props}
    />
  );
}

export { Card };
