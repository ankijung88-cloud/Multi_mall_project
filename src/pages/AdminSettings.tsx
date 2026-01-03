import { useState, useEffect } from 'react';
import { Save, User, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        id: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const stored = localStorage.getItem('mall_admin_creds');
        if (stored) {
            const { name, id } = JSON.parse(stored);
            setFormData(prev => ({ ...prev, name, id }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        const stored = localStorage.getItem('mall_admin_creds');
        const creds = stored ? JSON.parse(stored) : null;

        if (!creds) {
            alert('Error: Admin credentials not found.');
            setIsLoading(false);
            return;
        }

        if (formData.currentPassword !== creds.password) {
            alert('Current password is incorrect.');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                alert('New passwords do not match.');
                setIsLoading(false);
                return;
            }
            if (formData.newPassword.length < 6) {
                alert('Password must be at least 6 characters.');
                setIsLoading(false);
                return;
            }
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Save
        const newCreds = {
            ...creds,
            name: formData.name,
            // id: formData.id, // Allow ID change? User asked for "Admin Info" change, assuming ID too.
            id: formData.id,
            password: formData.newPassword || creds.password
        };

        localStorage.setItem('mall_admin_creds', JSON.stringify(newCreds));
        alert('Information updated successfully.');

        // Clear sensitive fields
        setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }));

        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">정보 수정 (Admin Profile)</h2>

            <form onSubmit={handleSave}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <User size={20} className="text-red-500" />
                            기본 정보 (Basic Info)
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">관리자 표시 이름과 로그인 ID를 수정할 수 있습니다.</p>
                    </div>
                    <div className="p-6 text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 text-orange-500" />
                            <p>ID를 변경할 경우, 다음 로그인부터 변경된 ID를 사용해야 합니다.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Login ID</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-yellow-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Lock size={20} className="text-red-500" />
                            보안 설정 (Security)
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">비밀번호를 변경하려면 현재 비밀번호를 입력해야 합니다.</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password (현재 비밀번호) *</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                />
                            </div>
                            <div className="pt-4 border-t border-gray-100 mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (새 비밀번호)</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password (새 비밀번호 확인)</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-500/30 transition-all disabled:opacity-70"
                    >
                        <Save size={18} />
                        {isLoading ? 'Saving...' : 'Update Info'}
                    </button>
                </div>
            </form>
        </div>
    );
}
