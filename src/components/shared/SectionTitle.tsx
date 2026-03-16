import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      <h2 className="text-tradisional text-3xl md:text-4xl font-bold text-primary leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={cn(
          "mt-3 h-1 w-16 rounded-full bg-accent",
          centered && "mx-auto"
        )}
      />
    </div>
  );
}
