import { FiMapPin, FiClock } from "react-icons/fi";

interface JobProps {
  title: string;
  company: string;
  location: string;
  pay: string;
}

const JobCard = ({ title, company, location, pay }: JobProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between h-full">
    <div>
      <p className="text-sm text-blue-600 font-bold mb-1 group-hover:text-blue-800">
        {company}
      </p>

      <h3 className="text-lg font-bold mb-4 line-clamp-1 text-gray-800">
        {title}
      </h3>
    </div>

    <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
      <span className="flex items-center gap-1">
        <FiMapPin className="text-gray-400" /> {location}
      </span>
      <span className="flex items-center gap-1">
        <FiClock className="text-gray-400" /> {pay}
      </span>
    </div>
  </div>
);

export default JobCard;
