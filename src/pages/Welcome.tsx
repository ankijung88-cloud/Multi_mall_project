
import { User, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row relative">

            {/* Personal Section */}
            <div
                className="w-full md:w-1/2 flex-1 relative group cursor-pointer overflow-hidden border-b md:border-b-0 md:border-r border-gray-800"
                onClick={() => navigate('/personal')}
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70" />
                <div className="absolute inset-0 bg-emerald-900/80 group-hover:bg-emerald-800/70 transition-colors duration-500" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                    <div
                        className="bg-emerald-500 p-4 rounded-full mb-6 shadow-lg shadow-emerald-500/30 transform transition-transform hover:scale-110"
                    >
                        <User size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">개인 회원</h2>
                    <p className="text-emerald-50 text-lg mb-8 text-center max-w-sm drop-shadow-sm">
                        당신만을 위해 엄선된 프리미엄 라이프스타일 상품을 만나보세요.
                    </p>
                    <div className="flex items-center space-x-2 bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all font-semibold">
                        <span>개인 회원</span>
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>

            {/* Company Section */}
            <div
                className="w-full md:w-1/2 flex-1 relative group cursor-pointer overflow-hidden"
                onClick={() => navigate('/company')}
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70" />
                <div className="absolute inset-0 bg-blue-900/80 group-hover:bg-blue-800/70 transition-colors duration-500" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                    <div
                        className="bg-blue-600 p-4 rounded-full mb-6 shadow-lg shadow-blue-600/30 transform transition-transform hover:scale-110"
                    >
                        <Building2 size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">기업 회원</h2>
                    <p className="text-blue-50 text-lg mb-8 text-center max-w-sm drop-shadow-sm">
                        기업을 위한 대량 구매 혜택과 전용 요금제를 이용해보세요.
                    </p>
                    <div className="flex items-center space-x-2 bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all font-semibold">
                        <span>기업 회원</span>
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>

            {/* Center Divider/Logo Logic could go here */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full">
                    <span className="text-white font-bold text-xl">OR</span>
                </div>
            </div>

        </div>
    );
}
