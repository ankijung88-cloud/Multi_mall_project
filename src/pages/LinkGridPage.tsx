import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Plane, Building, Bus, ExternalLink, Plus, X, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface LinkItem {
    name: string;
    url: string;
    description?: string;
}

const INITIAL_LINK_DATA: Record<string, LinkItem[]> = {
    airline: [
        { name: 'Korean Air', url: 'https://www.koreanair.com' },
        { name: 'Asiana Airlines', url: 'https://flyasiana.com' },
        { name: 'Jeju Air', url: 'https://www.jejuair.net' },
        { name: 'Jin Air', url: 'https://www.jinair.com' },
        { name: 'T\'way Air', url: 'https://www.twayair.com' },
        { name: 'Air Busan', url: 'https://www.airbusan.com' },
        { name: 'Air Seoul', url: 'https://flyairseoul.com' },
        { name: 'Delta Air Lines', url: 'https://www.delta.com' },
        { name: 'United Airlines', url: 'https://www.united.com' },
        { name: 'American Airlines', url: 'https://www.aa.com' },
        { name: 'Emirates', url: 'https://www.emirates.com' },
        { name: 'Qatar Airways', url: 'https://www.qatarairways.com' },
        { name: 'Singapore Airlines', url: 'https://www.singaporeair.com' },
        { name: 'Cathay Pacific', url: 'https://www.cathaypacific.com' },
        { name: 'Lufthansa', url: 'https://www.lufthansa.com' },
        { name: 'Air France', url: 'https://www.airfrance.com' },
        { name: 'British Airways', url: 'https://www.britishairways.com' },
        { name: 'Etihad Airways', url: 'https://www.etihad.com' },
        { name: 'ANA', url: 'https://www.ana.co.jp' },
        { name: 'JAL', url: 'https://www.jal.co.jp' },
        { name: 'China Eastern', url: 'https://us.ceair.com' },
        { name: 'China Southern', url: 'https://www.csair.com' },
        { name: 'Thai Airways', url: 'https://www.thaiairways.com' },
        { name: 'Vietnam Airlines', url: 'https://www.vietnamairlines.com' },
        { name: 'Garuda Indonesia', url: 'https://www.garuda-indonesia.com' },
        { name: 'Malaysia Airlines', url: 'https://www.malaysiaairlines.com' },
        { name: 'Qantas', url: 'https://www.qantas.com' },
        { name: 'Air Canada', url: 'https://www.aircanada.com' },
        { name: 'KLM', url: 'https://www.klm.com' },
        { name: 'Turkish Airlines', url: 'https://www.turkishairlines.com' },
        { name: 'Finnair', url: 'https://www.finnair.com' },
        { name: 'Aeroflot', url: 'https://www.aeroflot.ru' },
        { name: 'Peach Aviation', url: 'https://www.flypeach.com' },
        { name: 'Cebu Pacific', url: 'https://www.cebupacificair.com' },
        { name: 'Scoot', url: 'https://www.flyscoot.com' },
        { name: 'AirAsia', url: 'https://www.airasia.com' },
        { name: 'VietJet Air', url: 'https://www.vietjetair.com' },
        { name: 'HK Express', url: 'https://www.hkexpress.com' },
        { name: 'Spring Airlines', url: 'https://en.ch.com' },
        { name: 'Eva Air', url: 'https://www.evaair.com' }
    ],
    hotel: [
        { name: 'Agoda', url: 'https://www.agoda.com' },
        { name: 'Booking.com', url: 'https://www.booking.com' },
        { name: 'Hotels.com', url: 'https://www.hotels.com' },
        { name: 'Expedia', url: 'https://www.expedia.com' },
        { name: 'Trip.com', url: 'https://www.trip.com' },
        { name: 'Airbnb', url: 'https://www.airbnb.com' },
        { name: 'Trivago', url: 'https://www.trivago.com' },
        { name: 'Marriott Bonvoy', url: 'https://www.marriott.com' },
        { name: 'Hilton Honors', url: 'https://www.hilton.com' },
        { name: 'Hyatt', url: 'https://www.hyatt.com' },
        { name: 'IHG Hotels', url: 'https://www.ihg.com' },
        { name: 'Accor Live Limitless', url: 'https://all.accor.com' },
        { name: 'Best Western', url: 'https://www.bestwestern.com' },
        { name: 'Wyndham', url: 'https://www.wyndhamhotels.com' },
        { name: 'Choice Hotels', url: 'https://www.choicehotels.com' },
        { name: 'Radisson', url: 'https://www.radissonhotels.com' },
        { name: 'Yanolja', url: 'https://www.yanolja.com' },
        { name: 'Yeogi Eottae', url: 'https://www.yeogi.com' },
        { name: 'Interpark Tour', url: 'https://tour.interpark.com' },
        { name: 'Daily Hotel', url: 'https://www.dailyhotel.com' },
        { name: 'Four Seasons', url: 'https://www.fourseasons.com' },
        { name: 'Shangri-La', url: 'https://www.shangri-la.com' },
        { name: 'Mandarin Oriental', url: 'https://www.mandarinoriental.com' },
        { name: 'Banyan Tree', url: 'https://www.banyantree.com' },
        { name: 'Lotte Hotels', url: 'https://www.lottehotel.com' },
        { name: 'Shilla Hotels', url: 'https://www.shilla.net' },
        { name: 'Westin', url: 'https://westin.marriott.com' },
        { name: 'Sheraton', url: 'https://sheraton.marriott.com' },
        { name: 'Ritz-Carlton', url: 'https://www.ritzcarlton.com' },
        { name: 'W Hotels', url: 'https://w-hotels.marriott.com' },
        { name: 'St. Regis', url: 'https://st-regis.marriott.com' },
        { name: 'Hostelworld', url: 'https://www.hostelworld.com' }
    ],
    transport: [
        { name: 'LetsKorail', url: 'https://www.letskorail.com' },
        { name: 'SRT', url: 'https://etk.srail.kr' },
        { name: 'Express Bus T-money', url: 'https://www.kobus.co.kr' },
        { name: 'Intercity Bus T-money', url: 'https://txbus.t-money.co.kr' },
        { name: 'Bustago', url: 'https://www.bustago.or.kr' },
        { name: 'Incheon Airport', url: 'https://www.airport.kr' },
        { name: 'Gimpo Airport', url: 'https://www.airport.co.kr/gimpo' },
        { name: 'Kakao Taxi', url: 'https://www.kakaocorp.com/service/KakaoT' },
        { name: 'Uber / UT', url: 'https://www.ut.taxi' },
        { name: 'Tada', url: 'https://tadatada.com' },
        { name: 'Socar', url: 'https://www.socar.kr' },
        { name: 'Green Car', url: 'https://www.greencar.co.kr' },
        { name: 'Lotte Rent-a-Car', url: 'https://www.lotterentacar.net' },
        { name: 'SK Rent-a-Car', url: 'https://www.skcarrental.com' },
        { name: 'Naver Map', url: 'https://map.naver.com' },
        { name: 'Kakao Map', url: 'https://map.kakao.com' },
        { name: 'Google Maps', url: 'https://maps.google.com' },
        { name: 'Seoul Metro', url: 'http://www.seoulmetro.co.kr' },
        { name: 'Arex (Airport Railroad)', url: 'https://www.arex.or.kr' },
        { name: 'T-money', url: 'https://www.t-money.co.kr' },
        { name: 'Cashbee', url: 'https://www.cashbee.co.kr' },
        { name: 'Rail Ninja', url: 'https://rail.ninja' },
        { name: 'Rome2rio', url: 'https://www.rome2rio.com' },
        { name: 'Omio', url: 'https://www.omio.com' },
        { name: 'Skyscanner (Car Hire)', url: 'https://www.skyscanner.net/carhire' },
        { name: 'Rentalcars.com', url: 'https://www.rentalcars.com' }
    ]
};

interface LinkGridPageProps {
    category: 'airline' | 'hotel' | 'transport';
}

// Predefined pastel colors for cards
const CARD_COLORS = [
    'bg-red-50 hover:bg-red-100',
    'bg-orange-50 hover:bg-orange-100',
    'bg-amber-50 hover:bg-amber-100',
    'bg-yellow-50 hover:bg-yellow-100',
    'bg-lime-50 hover:bg-lime-100',
    'bg-green-50 hover:bg-green-100',
    'bg-emerald-50 hover:bg-emerald-100',
    'bg-teal-50 hover:bg-teal-100',
    'bg-cyan-50 hover:bg-cyan-100',
    'bg-sky-50 hover:bg-sky-100',
    'bg-blue-50 hover:bg-blue-100',
    'bg-indigo-50 hover:bg-indigo-100',
    'bg-violet-50 hover:bg-violet-100',
    'bg-purple-50 hover:bg-purple-100',
    'bg-fuchsia-50 hover:bg-fuchsia-100',
    'bg-pink-50 hover:bg-pink-100',
    'bg-rose-50 hover:bg-rose-100',
];

export default function LinkGridPage({ category }: LinkGridPageProps) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';
    const { userType } = useAuthStore();
    const isAdmin = userType === 'admin';

    // State for links
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLink, setNewLink] = useState({ name: '', url: 'https://' });

    // Load data from localStorage or initialize
    useEffect(() => {
        const storedData = localStorage.getItem('mall_link_data');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData[category]) {
                setLinks(parsedData[category]);
                return;
            }
        }
        // Initialize if not present (only for first load)
        setLinks(INITIAL_LINK_DATA[category]);
    }, [category]);

    // Save logic
    const saveLinks = (updatedLinks: LinkItem[]) => {
        setLinks(updatedLinks);
        const storedData = localStorage.getItem('mall_link_data');
        const allData = storedData ? JSON.parse(storedData) : { ...INITIAL_LINK_DATA };
        allData[category] = updatedLinks;
        localStorage.setItem('mall_link_data', JSON.stringify(allData));
    };

    const handleAddLink = () => {
        if (!newLink.name || !newLink.url) return;

        // Basic URL validation
        let urlToAdd = newLink.url;
        if (!/^https?:\/\//i.test(urlToAdd)) {
            urlToAdd = 'https://' + urlToAdd;
        }

        const updated = [...links, { ...newLink, url: urlToAdd }];
        saveLinks(updated);
        setIsAddModalOpen(false);
        setNewLink({ name: '', url: 'https://' });
    };

    const handleDeleteLink = (index: number, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();
        if (confirm('정말로 이 링크를 삭제하시겠습니까?')) {
            const updated = links.filter((_, i) => i !== index);
            saveLinks(updated);
        }
    };

    const config = {
        airline: { title: '항공사 링크', icon: Plane, desc: '전 세계 주요 항공사의 공식 홈페이지를 한곳에서 만나보세요.' },
        hotel: { title: '호텔 예약 링크', icon: Building, desc: '국내외 인기 호텔 및 숙소 예약 사이트 모음입니다.' },
        transport: { title: '교통 링크', icon: Bus, desc: '기차, 버스, 렌터카 등 다양한 교통편 예약 사이트입니다.' }
    }[category];

    const Icon = config.icon;

    return (
        <MainLayout>
            {/* Header */}
            <div className={clsx(
                "py-16 transition-colors duration-300",
                isCompany ? "bg-blue-900 text-white" : "bg-emerald-900 text-white"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <Icon size={40} />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.title}</h1>
                    <p className={clsx("text-xl max-w-2xl mx-auto", isCompany ? "text-blue-200" : "text-emerald-200")}>
                        {config.desc}
                    </p>
                </div>
            </div>

            {/* Link Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-end mb-6">
                    {/* Add Button - Visible to everyone as per request "Add a card", but typically admin. 
                        User didn't strictly say admin-only, but let's assume admin for safety, 
                        OR if user meant "I want to add cards via code", no, "Add a card... to show continuously" implies UI.
                        Let's open it for now based on previous patterns, or restrict to Admin. 
                        Given this is a public page, probably restrict to Admin. 
                        Wait, previous prompt said "Admin only can manage boards". 
                        I'll stick to Admin for Add/Delete to avoid vandalism. */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className={clsx(
                                "flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors shadow-sm",
                                isCompany ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                            )}
                        >
                            <Plus size={20} />
                            <span>링크 추가하기</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {links.map((link, index) => {
                        const colorClass = CARD_COLORS[index % CARD_COLORS.length];

                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clsx(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 h-40 group relative overflow-hidden",
                                    colorClass, // Apply dynamic color
                                    isCompany ? "hover:border-blue-500 hover:shadow-blue-100" : "hover:border-emerald-500 hover:shadow-emerald-100",
                                    "hover:-translate-y-1 shadow-sm hover:shadow-lg cursor-pointer"
                                )}
                            >
                                {/* Admin Delete Button */}
                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDeleteLink(index, e)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
                                        title="삭제"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                <span className="text-xl font-bold text-gray-800 text-center line-clamp-2 px-2 group-hover:text-blue-600 transition-colors">
                                    {link.name}
                                </span>

                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink size={12} className="text-gray-400" />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Add Link Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">새 링크 추가</h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">사이트 이름</label>
                                <input
                                    type="text"
                                    value={newLink.name}
                                    onChange={e => setNewLink({ ...newLink, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="예: Google"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={newLink.url}
                                    onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="https://example.com"
                                />
                                <p className="text-xs text-gray-500 mt-1">도메인 주소를 기반으로 로고를 자동으로 불러옵니다.</p>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddLink}
                                disabled={!newLink.name || !newLink.url}
                                className={clsx(
                                    "px-4 py-2 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
                                    isCompany ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                                )}
                            >
                                추가하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
