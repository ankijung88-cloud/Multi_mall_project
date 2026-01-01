import { useState } from 'react';
import { Save, User, Lock } from 'lucide-react';

export default function AdminSettings() {
    const [isLoading, setIsLoading] = useState(false);

    // Mock Profile Data
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@jobproject.com',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Settings Saved Successfully');
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <User size={20} className="text-red-500" />
                        Profile Information
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Update your admin account details.</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Lock size={20} className="text-red-500" />
                        Security
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Change your password.</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-500/30 transition-all disabled:opacity-70"
                >
                    <Save size={18} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
