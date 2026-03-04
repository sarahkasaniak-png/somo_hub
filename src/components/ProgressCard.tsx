//src/components/ProgressCard.tsx
interface ProgressCardProps {
  title: string;
  instructor: string;
  progress: number;
  attendedClasses: number;
  totalClasses: number;
  status: string;
  onView: () => void;
}

export default function ProgressCard({
  title,
  instructor,
  progress,
  attendedClasses,
  totalClasses,
  status,
  onView,
}: ProgressCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">Instructor: {instructor}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Classes attended: {attendedClasses}/{totalClasses}
        </div>
        <button
          onClick={onView}
          className="text-green-600 hover:text-green-800 font-medium text-sm"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
