interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={`text-2xl font-bold tracking-tight text-[#0F0A4D] ${className ?? ''}`}
    >
      {children}
    </h1>
  );
}
