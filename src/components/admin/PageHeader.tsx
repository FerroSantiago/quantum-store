interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children && (
        <div className="flex justify-between items-center">{children}</div>
      )}
    </div>
  );
}
