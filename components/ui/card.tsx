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
        "rounded-[4px] border-l-[6px] border-l-(--c) bg-white py-3.5 pr-3.5 pl-4 shadow-[4px_4px_0_#320d59] transition-[background-color,border-color,box-shadow] duration-600 gray:border-l-[#5F656B] gray:bg-[#DADCDF] gray:shadow-[4px_4px_0_#9AA0A6]",
        className
      )}
      {...props}
    />
  );
}

export { Card };
