import { useState } from 'react';
import { Search, MoreVertical, Mail, Shield } from 'lucide-react';

export default function AdminMembers() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const members = [
        { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Personal', status: 'Active', date: '2023-01-15' },
        { id: 2, name: 'Acme Corp', email: 'contact@acme.com', type: 'Company', status: 'Verified', date: '2023-02-20' },
        { id: 3, name: 'Jane Smith', email: 'jane@test.com', type: 'Personal', status: 'Inactive', date: '2023-03-10' },
        { id: 4, name: 'Global Tech', email: 'support@global.tech', type: 'Company', status: 'Pending', date: '2023-04-05' },
    ];

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Member Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{member.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} /> {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${member.type === 'Company' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                            {member.type === 'Company' && <Shield size={10} className="mr-1" />}
                                            {member.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${member.status === 'Active' || member.status === 'Verified' ? 'bg-green-100 text-green-800' :
                                            member.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {member.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
