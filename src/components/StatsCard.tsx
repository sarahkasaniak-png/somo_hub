//src/components/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description: string;
  color: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  description,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
