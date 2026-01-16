interface ContentHeaderProps {
  title: string;
  description: string;
}

export function ContentHeader({ title, description }: ContentHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 pb-5">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
