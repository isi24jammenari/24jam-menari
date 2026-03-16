import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function PageWrapper({
  children,
  className,
  narrow = false,
}: PageWrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 py-10",
        narrow ? "max-w-2xl" : "max-w-5xl",
        className
      )}
    >
      {children}
    </div>
  );
}
