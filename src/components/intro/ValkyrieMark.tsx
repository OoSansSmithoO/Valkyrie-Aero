import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  glow?: boolean;
  alt?: string;
};

export function ValkyrieMark({ className, alt = "Valkyrie" }: Props) {
  return (
    <img
      src="brand/valkyrie-mark.png"
      alt={alt}
      className={cn("valkyrie-mark", className)}
      draggable={false}
      crossOrigin="anonymous"
    />
  );
}
