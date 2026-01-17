
import { User, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #D4EBF7 0%, #FFF8F0 100%)' }}>

            {/* Subtle Pattern Overlay */}
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(168, 216, 234, 0.2) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, rgba(255, 182, 185, 0.2) 0%, transparent 50%)`
            }} />

            {/* Personal Section */}
            <div
                className="w-full md:w-1/2 flex-1 relative cursor-pointer overflow-hidden border-b-2 md:border-b-0 md:border-r-2 transition-all duration-500 hover:scale-[1.02]"
                onClick={() => navigate('/personal')}
                style={{ borderColor: '#CBD5E0' }}
            >
                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, rgba(168, 216, 234, 0.3) 0%, rgba(255, 248, 240, 0.5) 100%)'
                }} />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 md:px-16 py-20 md:py-32">
                    {/* Icon with Soft Circle */}
                    <div className="relative mb-12">
                        <div className="absolute -inset-6 opacity-20 rounded-full blur-3xl" style={{
                            background: 'radial-gradient(circle, #A8D8EA 0%, #FFB6B9 100%)'
                        }} />
                        <div
                            className="relative p-10 rounded-3xl transform transition-all duration-500 hover:scale-110 hover:rotate-6"
                            style={{
                                background: 'linear-gradient(135deg, #A8D8EA 0%, #7AC5DC 100%)',
                                border: '3px solid rgba(255, 255, 255, 0.8)'
                            }}
                        >
                            <User size={56} className="text-white" strokeWidth={2.5} />
                        </div>
                        <Sparkles className="absolute -top-3 -right-3 animate-pulse" size={28}
                            style={{ color: '#FFB6B9' }} />
                    </div>

                    {/* Title */}
                    <h2 className="text-6xl md:text-7xl font-hanbok mb-6 text-center leading-tight"
                        style={{ color: '#2D3436' }}>
                        개인 회원
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl mb-12 text-center max-w-md font-korean font-medium leading-relaxed"
                        style={{ color: '#4A5568' }}>
                        당신만을 위한
                        <br />
                        특별한 K-Culture 여정
                    </p>

                    {/* CTA Button */}
                    <button
                        className="group relative overflow-hidden rounded-full px-12 py-5 font-korean font-bold text-xl text-white transition-all duration-500 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #A8D8EA 0%, #7AC5DC 100%)',
                            border: '3px solid #FFFFFF'
                        }}
                    >
                        <span className="flex items-center gap-3">
                            시작하기
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </span>
                    </button>

                    {/* Badge */}
                    <div
                        className="mt-10 px-8 py-3 rounded-full font-korean font-bold text-sm backdrop-blur-sm"
                        style={{
                            backgroundColor: 'rgba(168, 216, 234, 0.2)',
                            border: '2px solid rgba(168, 216, 234, 0.4)',
                            color: '#7AC5DC'
                        }}
                    >
                        PERSONAL
                    </div>
                </div>
            </div>

            {/* Company Section */}
            <div
                className="w-full md:w-1/2 flex-1 relative cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                onClick={() => navigate('/company')}
            >
                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, rgba(255, 201, 204, 0.3) 0%, rgba(255, 229, 180, 0.3) 100%)'
                }} />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 md:px-16 py-20 md:py-32">
                    {/* Icon with Soft Circle */}
                    <div className="relative mb-12">
                        <div className="absolute -inset-6 opacity-20 rounded-full blur-3xl" style={{
                            background: 'radial-gradient(circle, #FFB6B9 0%, #FFE5B4 100%)'
                        }} />
                        <div
                            className="relative p-10 rounded-3xl transform transition-all duration-500 hover:scale-110 hover:-rotate-6"
                            style={{
                                background: 'linear-gradient(135deg, #FFB6B9 0%, #FF9AA2 100%)',
                                border: '3px solid rgba(255, 255, 255, 0.8)'
                            }}
                        >
                            <Building2 size={56} className="text-white" strokeWidth={2.5} />
                        </div>
                        <Sparkles className="absolute -top-3 -right-3 animate-pulse" size={28}
                            style={{ color: '#FFE5B4' }} />
                    </div>

                    {/* Title */}
                    <h2 className="text-6xl md:text-7xl font-hanbok mb-6 text-center leading-tight"
                        style={{ color: '#4A5568' }}>
                        기업 회원
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl mb-12 text-center max-w-md font-korean font-medium leading-relaxed"
                        style={{ color: '#8E9AAF' }}>
                        품격있는 비즈니스
                        <br />
                        K-Culture 파트너십
                    </p>

                    {/* CTA Button */}
                    <button
                        className="group relative overflow-hidden rounded-full px-12 py-5 font-korean font-bold text-xl text-white transition-all duration-500 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #FFB6B9 0%, #FF9AA2 100%)',
                            border: '3px solid #FFFFFF'
                        }}
                    >
                        <span className="flex items-center gap-3">
                            입장하기
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </span>
                    </button>

                    {/* Badge */}
                    <div
                        className="mt-10 px-8 py-3 rounded-full font-korean font-bold text-sm backdrop-blur-sm"
                        style={{
                            backgroundColor: 'rgba(255, 182, 185, 0.2)',
                            border: '2px solid rgba(255, 182, 185, 0.4)',
                            color: '#FF9AA2'
                        }}
                    >
                        BUSINESS
                    </div>
                </div>
            </div>

            {/* Center Logo - Obangsaek */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                <div
                    className="p-10 rounded-full backdrop-blur-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                        boxShadow: 'none',
                        border: '3px solid rgba(203, 213, 224, 0.4)'
                    }}
                >
                    <div className="text-center">
                        <div className="text-4xl font-hanbok mb-1" style={{
                            background: 'linear-gradient(135deg, #A8D8EA 0%, #FFB6B9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>K</div>
                        <div className="text-xs font-korean font-bold tracking-widest" style={{ color: '#8E9AAF' }}>
                            CULTURE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
