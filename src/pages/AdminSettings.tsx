import { useState, useEffect } from 'react';
import { Save, User, Lock, AlertCircle, Key, Shield, RefreshCw, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePartners } from '../context/PartnerContext';
import { useAgents } from '../context/AgentContext';
import { useFreelancers } from '../context/FreelancerContext';

export default function AdminSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const { logout, adminRole, adminTargetId } = useAuthStore();
    const { partners, updatePartner, deletePartner } = usePartners();
    const { agents, updateAgent, deleteAgent } = useAgents();
    const { freelancers, updateFreelancer, deleteFreelancer } = useFreelancers();

    const handleDeleteEntity = (type: 'partner' | 'agent' | 'freelancer', id: any, name: string) => {
        if (!window.confirm(`정말로 '${name}' 계정을 영구 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;

        if (type === 'partner') {
            deletePartner(id); // id is number
        } else if (type === 'agent') {
            deleteAgent(id); // id is number
        } else {
            deleteFreelancer(id); // id is string
        }
        alert('삭제되었습니다.');
    };


    // Super Admin Form State
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Partner/Agent/Freelancer Form State
    const [myProfile, setMyProfile] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Load Data
    useEffect(() => {
        if (adminRole === 'super') {
            const stored = localStorage.getItem('mall_admin_creds');
            if (stored) {
                const { name, id } = JSON.parse(stored);
                setFormData(prev => ({ ...prev, name, id }));
            }
        } else if (adminRole === 'partner' && adminTargetId) {
            const p = partners.find(i => i.id === adminTargetId);
            if (p && p.credentials) {
                setMyProfile({
                    name: p.name,
                    username: p.credentials.username,
                    password: p.credentials.password,
                    confirmPassword: p.credentials.password
                });
            }
        } else if (adminRole === 'agent' && adminTargetId) {
            const a = agents.find(i => i.id === adminTargetId);
            if (a && a.credentials) {
                setMyProfile({
                    name: a.name,
                    username: a.credentials.username,
                    password: a.credentials.password,
                    confirmPassword: a.credentials.password
                });
            }
        } else if (adminRole === 'freelancer' && adminTargetId) {
            const f = freelancers.find(i => i.id === adminTargetId);
            if (f && f.credentials) {
                setMyProfile({
                    name: f.name,
                    username: f.credentials.username,
                    password: f.credentials.password,
                    confirmPassword: f.credentials.password
                });
            }
        }
    }, [adminRole, adminTargetId, partners, agents, freelancers]);

    // Super Admin Update Handler
    const handleSuperSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const stored = localStorage.getItem('mall_admin_creds');
        const creds = stored ? JSON.parse(stored) : null;

        if (!creds || formData.currentPassword !== creds.password) {
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
            if (formData.newPassword.length < 4) {
                alert('Password too short.');
                setIsLoading(false);
                return;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const newCreds = {
            ...creds,
            name: formData.name,
            id: formData.id,
            password: formData.newPassword || creds.password
        };
        localStorage.setItem('mall_admin_creds', JSON.stringify(newCreds));
        alert('Super Admin info updated.');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setIsLoading(false);
    };

    // Partner/Agent/Freelancer Update Handler
    const handleMyProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminTargetId) return;

        if (myProfile.password !== myProfile.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const updates = {
            name: myProfile.name,
            credentials: {
                username: myProfile.username,
                password: myProfile.password
            }
        };

        if (adminRole === 'partner') {
            updatePartner(adminTargetId, updates);
        } else if (adminRole === 'agent') {
            updateAgent(adminTargetId, updates);
        } else if (adminRole === 'freelancer') {
            updateFreelancer(String(adminTargetId), updates);
        }

        alert("Profile updated successfully.");
        setIsLoading(false);
    };

    // Re-issue Password (Super Admin Only)
    const handleResetPassword = (type: 'partner' | 'agent' | 'freelancer', entity: any) => {
        if (!window.confirm(`Reset password for ${entity.name}? This will generate a new random password.`)) return;

        const newPassword = Math.random().toString(36).slice(-8); // Random 8 chars
        const updates = {
            credentials: {
                username: entity.credentials?.username || 'user',
                password: newPassword
            }
        };

        if (type === 'partner') {
            updatePartner(entity.id, updates);
        } else if (type === 'agent') {
            updateAgent(entity.id, updates);
        } else {
            updateFreelancer(entity.id, updates);
        }

        alert(`Password for ${entity.name} has been reset to:\n\n${newPassword}\n\nPlease copy this password securely.`);
    };



    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {adminRole === 'super' ? '시스템 관리자 설정 (System Admin)' : '내 정보 관리 (My Profile)'}
            </h2>

            {/* Super Admin Profile Form */}
            {adminRole === 'super' && (
                <form onSubmit={handleSuperSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 p-6 space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2"><User size={20} /> Super Admin Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Login ID</label>
                            <input type="text" name="id" value={formData.id} onChange={handleFormChange} className="w-full border rounded px-3 py-2 bg-yellow-50" />
                        </div>
                    </div>
                    <div className="space-y-4 border-t pt-4">
                        <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleFormChange} placeholder="Current Password *" required className="w-full border rounded px-3 py-2" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleFormChange} placeholder="New Password" className="w-full border rounded px-3 py-2" />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} placeholder="Confirm New Password" className="w-full border rounded px-3 py-2" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isLoading} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">
                            {isLoading ? 'Saving...' : 'Update Super Admin'}
                        </button>
                    </div>
                </form>
            )}

            {/* Partner/Agent/Freelancer Personal Profile Form */}
            {(adminRole === 'partner' || adminRole === 'agent' || adminRole === 'freelancer') && (
                <form onSubmit={handleMyProfileSave} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 p-6 space-y-6">
                    <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-2"><User size={20} /> Account Details ({adminRole?.toUpperCase()})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Display Name</label>
                            <input
                                type="text"
                                value={myProfile.name}
                                onChange={e => setMyProfile({ ...myProfile, name: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Login ID</label>
                            <input
                                type="text"
                                value={myProfile.username}
                                onChange={e => setMyProfile({ ...myProfile, username: e.target.value })}
                                className="w-full border rounded px-3 py-2 bg-yellow-50"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="text"
                                    value={myProfile.password}
                                    onChange={e => setMyProfile({ ...myProfile, password: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <input
                                    type="text"
                                    value={myProfile.confirmPassword}
                                    onChange={e => setMyProfile({ ...myProfile, confirmPassword: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                            {isLoading ? 'Saving...' : 'Update My Profile'}
                        </button>
                    </div>
                </form>
            )}

            {/* Super Admin Only: Partner/Agent/Freelancer Account Management (Read Only + Reset) */}
            {adminRole === 'super' && (
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <Shield size={24} className="text-blue-600" />
                        제휴업체 및 에이전트/프리랜서 계정 관리
                    </h2>

                    {/* Partners */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-200 bg-blue-50">
                            <h3 className="text-lg font-bold text-gray-900">제휴 업체 (Partners)</h3>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left">업체명</th>
                                        <th className="px-4 py-3 text-left">Login ID</th>
                                        <th className="px-4 py-3 text-left">Password (Locked)</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {partners.map(partner => (
                                        <tr key={partner.id}>
                                            <td className="px-4 py-3">{partner.name}</td>
                                            <td className="px-4 py-3 bg-gray-50 text-gray-500">{partner.credentials?.username || '-'}</td>
                                            <td className="px-4 py-3 bg-gray-50 text-gray-400">
                                                {partner.credentials ? '********' : 'No Access'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleResetPassword('partner', partner)}
                                                        className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 flex items-center"
                                                        title="비밀번호 재발행"
                                                    >
                                                        <RefreshCw size={14} className="mr-1" /> 재발행
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEntity('partner', partner.id, partner.name)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600 flex items-center"
                                                        title="계정 영구 삭제 (Delete Account)"
                                                    >
                                                        <Trash2 size={14} className="mr-1" /> 삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Agents */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-200 bg-purple-50">
                            <h3 className="text-lg font-bold text-gray-900">에이전트 (Agents)</h3>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left">에이전트명</th>
                                        <th className="px-4 py-3 text-left">Login ID</th>
                                        <th className="px-4 py-3 text-left">Password (Locked)</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {agents.map(agent => (
                                        <tr key={agent.id}>
                                            <td className="px-4 py-3">{agent.name}</td>
                                            <td className="px-4 py-3 bg-gray-50 text-gray-500">{agent.credentials?.username || '-'}</td>
                                            <td className="px-4 py-3 bg-gray-50 text-gray-400">
                                                {agent.credentials ? '********' : 'No Access'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleResetPassword('agent', agent)}
                                                        className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 flex items-center"
                                                        title="비밀번호 재발행"
                                                    >
                                                        <RefreshCw size={14} className="mr-1" /> 재발행
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEntity('agent', agent.id, agent.name)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600 flex items-center"
                                                        title="계정 영구 삭제 (Delete Account)"
                                                    >
                                                        <Trash2 size={14} className="mr-1" /> 삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Freelancers - Added below Agents */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-orange-50">
                            <h3 className="text-lg font-bold text-gray-900">프리랜서 (Freelancers)</h3>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left">이름</th>
                                        <th className="px-4 py-3 text-left">Login ID</th>
                                        <th className="px-4 py-3 text-left">Password (Locked)</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {freelancers.map(freelancer => (
                                        <tr key={freelancer.id}>
                                            <td className="px-4 py-3">{freelancer.name}</td>
                                            <td className="px-4 py-3 bg-gray-50 text-gray-500">{freelancer.credentials?.username || '-'}</td>
                                            <td className="px-4 py-3 bg-gray-50 text-gray-400">
                                                {freelancer.credentials ? '********' : 'No Access'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleResetPassword('freelancer', freelancer)}
                                                        className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 flex items-center"
                                                        title="비밀번호 재발행"
                                                    >
                                                        <RefreshCw size={14} className="mr-1" /> 재발행
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEntity('freelancer', freelancer.id, freelancer.name)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600 flex items-center"
                                                        title="계정 영구 삭제 (Delete Account)"
                                                    >
                                                        <Trash2 size={14} className="mr-1" /> 삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
