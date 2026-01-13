interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="flex items-center w-full h-16 bg-white border-b border-gray-200 px-8 text-2xl font-bold text-gray-900">
      {title}
    </div>
  );
}
