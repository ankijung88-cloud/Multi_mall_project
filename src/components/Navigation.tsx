import { useState } from "react";
import { FiGlobe, FiChevronDown } from "react-icons/fi";

const Navigation = () => {
  const [isForeignerOpen, setIsForeignerOpen] = useState(false);

  const menus = ["채용정보", "지역별", "단기알바", "맞춤알바", "고객지원"];
  const visaTypes = [
    { code: "E-9", name: "비전문취업" },
    { code: "H-2", name: "방문취업" },
    { code: "F-2", name: "거주" },
    { code: "F-4", name: "재외동포" },
    { code: "F-5", name: "영주" },
    { code: "F-6", name: "결혼이민" },
    { code: "D-2/D-10", name: "유학/구직" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[66px]">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-yellow-500 cursor-pointer">
              JOB-ALBA
            </h1>

            <ul className="hidden md:flex gap-6 font-semibold text-gray-700 items-center">
              {menus.map((menu) => (
                <li
                  key={menu}
                  className="hover:text-blue-600 cursor-pointer text-sm lg:text-base"
                >
                  {menu}
                </li>
              ))}

              <li
                className="relative"
                onMouseEnter={() => setIsForeignerOpen(true)}
                onMouseLeave={() => setIsForeignerOpen(false)}
              >
                <button className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold text-sm lg:text-base">
                  <FiGlobe /> 외국인 채용 <FiChevronDown />
                </button>

                {isForeignerOpen && (
                  <ul className="absolute left-0 top-full w-48 bg-white border border-gray-200 shadow-xl rounded-md py-2 z-50">
                    <li className="px-4 py-2 text-[10px] text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                      Visa Type
                    </li>
                    {visaTypes.map((visa) => (
                      <li
                        key={visa.code}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex flex-col border-b last:border-0 border-gray-50 transition-colors"
                      >
                        <span className="text-blue-600 font-bold text-sm">
                          {visa.code}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {visa.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-lg gap-2">
              <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white shadow-md hover:shadow-lg transition-all duration-200 rounded-md">
                구직자 로그인
              </button>
              <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white shadow-md hover:shadow-lg transition-all duration-200 rounded-md">
                기업 로그인
              </button>
            </div>

            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 transition">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
