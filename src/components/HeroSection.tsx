import { FiSearch } from "react-icons/fi";

const HeroSection = () => {
  return (
    <div className="bg-slate-100 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          어떤 직무를 찾고 계신가요?
        </h2>
        <div className="relative flex items-center bg-white rounded-lg shadow-lg p-2">
          <FiSearch className="ml-4 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="직무, 회사명, 키워드를 입력하세요"
            className="w-full p-4 outline-none text-lg"
          />
          <button className="bg-blue-600 text-white px-8 py-4 rounded-md font-bold hover:bg-blue-700 transition">
            검색
          </button>
        </div>
        <div className="mt-4 flex gap-3 justify-center text-sm text-gray-500">
          <span className="cursor-pointer hover:underline">#재택알바</span>
          <span className="cursor-pointer hover:underline">#편의점</span>
          <span className="cursor-pointer hover:underline">#카페</span>
          <span className="cursor-pointer hover:underline">#단기</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
