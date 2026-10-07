import { cn } from "@/lib/utils";

// Extrusão sólida tipo cubo (gramática do kit): n sombras de 1px sem desfoque, na cor do lado escuro.
export const extrusao = (cor: string, n = 6) => Array.from({ length: n }, (_, i) => `${i + 1}px ${i + 1}px 0 ${cor}`).join(",");

// Caixa retangular levemente inclinada com extrusão, para títulos e etiquetas.
export function Caixa({ cor, lado, giro = -3, prof = 6, className, children }: {
  cor: string; lado: string; giro?: number; prof?: number; className?: string; children: React.ReactNode;
}) {
  return (
    <span
      className={cn("condensada inline-block px-3 pt-1 pb-0.5", className)}
      style={{ background: cor, transform: `rotate(${giro}deg)`, boxShadow: extrusao(lado, prof) }}
    >
      {children}
    </span>
  );
}
