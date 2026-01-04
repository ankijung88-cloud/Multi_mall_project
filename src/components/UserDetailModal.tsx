import { X, User, Phone, Mail, MapPin, Calendar, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userType: 'Personal' | 'Company' | 'personal' | 'company'; // Handle case variations
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    detailAddress?: string;
    joinDate?: string; // or createdAt
    companyName?: string; // specific to company
    ceoName?: string;
    businessNumber?: string;
    memberNumber?: string;
}

export default function UserDetailModal({ isOpen, onClose, userId, userType }: UserDetailModalProps) {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        if (isOpen && userId) {
            // Determine which storage to look in
            const isCompany = userType.toLowerCase() === 'company';
            const storageKey = isCompany ? 'mall_companies' : 'mall_users';

            try {
                const storedData = localStorage.getItem(storageKey);
                if (storedData) {
                    const users: UserData[] = JSON.parse(storedData);
                    // Find user by ID
                    const foundUser = users.find(u => u.id === userId);
                    setUserData(foundUser || null);
                }
            } catch (error) {
                console.error("Failed to load user data", error);
                setUserData(null);
            }
        } else {
            setUserData(null);
        }
    }, [isOpen, userId, userType]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <User size={20} className="text-orange-500" />
                        회원 상세 정보
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {userData ? (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="text-center pb-4 border-b border-gray-100">
                                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                                    {userData.name.charAt(0)}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">{userData.name}</h4>
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md mt-1">
                                    {userType} Member
                                </span>
                                {userData.memberNumber && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Member No: {userData.memberNumber}
                                    </div>
                                )}
                            </div>

                            {/* Details List */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><User size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">아이디 (ID)</p>
                                        <p className="text-sm font-medium text-gray-900">{userData.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><Mail size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">이메일 (Email)</p>
                                        <p className="text-sm font-medium text-gray-900">{userData.email || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-gray-400"><Phone size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">연락처 (Phone)</p>
                                        <p className="text-sm font-medium text-gray-900">{userData.phone || '-'}</p>
                                    </div>
                                </div>

                                {(userData.address) && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400"><MapPin size={16} /></div>
                                        <div>
                                            <p className="text-xs text-gray-500">주소 (Address)</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {userData.address} {userData.detailAddress}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Company Specifics */}
                                {userType.toLowerCase() === 'company' && (
                                    <>
                                        {userData.companyName && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 text-gray-400"><Building2 size={16} /></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">회사명 (Company)</p>
                                                    <p className="text-sm font-medium text-gray-900">{userData.companyName}</p>
                                                </div>
                                            </div>
                                        )}
                                        {userData.businessNumber && (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 text-gray-400"><Building2 size={16} /></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">사업자등록번호</p>
                                                    <p className="text-sm font-medium text-gray-900">{userData.businessNumber}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>사용자 정보를 찾을 수 없습니다.</p>
                            <p className="text-xs mt-1">(이미 탈퇴했거나 데이터가 없을 수 있습니다)</p>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
