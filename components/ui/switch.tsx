"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";

const MOLA = { type: "spring", visualDuration: 0.45, bounce: 0.45 } as const;

// Interruptor gigante: rótulo em cima, trilho 228×124, estado embaixo. A bola cresce enquanto o dedo aperta.
function Switch({
  className,
  label,
  estado,
  checked,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { label: string; estado: string }) {
  const [aperto, setAperto] = React.useState(false);
  const solta = () => setAperto(false);
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={checked}
      onPointerDown={() => setAperto(true)}
      onPointerUp={solta}
      onPointerLeave={solta}
      onPointerCancel={solta}
      className={cn(
        "mx-auto mt-2.5 flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent text-inherit [-webkit-tap-highlight-color:transparent]",
        className
      )}
      {...props}
    >
      <b className="condensada inline-block -rotate-2 bg-amarelo px-3 pt-1 text-[30px] leading-normal text-roxo-escuro shadow-[1px_1px_0_#320d59,2px_2px_0_#320d59,3px_3px_0_#320d59,4px_4px_0_#320d59,5px_5px_0_#320d59] transition-[filter] duration-1000 gray:grayscale">{label}</b>
      <m.span
        className="relative block h-[124px] w-[228px] rounded-[62px] border-[3px] border-roxo-escuro"
        initial={false}
        animate={{ backgroundColor: checked ? "#3A3D41" : "#FFFFFF" }}
        transition={{ duration: 0.45 }}
      >
        <SwitchPrimitive.Thumb asChild>
          <m.span
            className="absolute top-[7px] left-[7px] block h-[104px] rounded-full shadow-[0_4px_0_rgba(0,0,0,.18)]"
            initial={false}
            animate={{
              x: checked ? (aperto ? 92 : 104) : 0,
              width: aperto ? 116 : 104,
              backgroundColor: checked ? "#9AA0A6" : "#ffd400",
            }}
            transition={{ x: MOLA, width: MOLA, backgroundColor: { duration: 0.45 } }}
          />
        </SwitchPrimitive.Thumb>
      </m.span>
      <span className="text-[13px] leading-normal font-bold tracking-[.12em] text-ink2 uppercase">{estado}</span>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
