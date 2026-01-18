import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h2 className="text-xl font-bold font-korean text-gray-800">개인정보처리방침</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 overflow-y-auto leading-relaxed text-sm text-gray-600 space-y-4 font-korean">
                        <h3 className="text-lg font-bold text-gray-800">제1조 (목적)</h3>
                        <p>
                            본 방침은 (주)멀티몰(이하 "회사")이 제공하는 서비스 이용과 관련하여 회원의 개인정보를 보호하고,
                            이와 관련된 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 수립되었습니다.
                        </p>

                        <h3 className="text-lg font-bold text-gray-800 mt-4">제2조 (수집하는 개인정보의 항목)</h3>
                        <p>회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>필수항목: 이름, 이메일, 비밀번호, 휴대전화번호</li>
                            <li>선택항목: 주소, 생년월일, 성별</li>
                            <li>자동수집: IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
                        </ul>

                        <h3 className="text-lg font-bold text-gray-800 mt-4">제3조 (개인정보의 수집 및 이용 목적)</h3>
                        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>서비스 제공에 관한 계약 이행 및 요금 정산</li>
                            <li>회원 관리 (본인 확인, 개인 식별, 부정 이용 방지, 가입 의사 확인)</li>
                            <li>마케팅 및 광고에 활용 (신규 서비스 개발, 이벤트 정보 전달)</li>
                        </ul>

                        <h3 className="text-lg font-bold text-gray-800 mt-4">제4조 (개인정보의 보유 및 이용 기간)</h3>
                        <p>
                            회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서
                            개인정보를 처리·보유합니다. 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                        </p>

                        <h3 className="text-lg font-bold text-gray-800 mt-4">제5조 (개인정보의 제3자 제공)</h3>
                        <p>
                            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>이용자들이 사전에 동의한 경우</li>
                            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                        </ul>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500">
                            이 개인정보처리방침은 2026년 1월 1일부터 적용됩니다.
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 text-right">
                        <button
                            onClick={onClose}
                            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-bold text-sm"
                        >
                            확인
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
