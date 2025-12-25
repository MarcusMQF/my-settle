import { User, FileText, History, Shield } from 'lucide-react';

interface SidebarProps {
    activeTab: 'reports' | 'history' | 'profile';
    onTabChange: (tab: 'reports' | 'history' | 'profile') => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    return (
        <div className="w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">
            {/* Header */}
            <div className="h-18 flex items-center px-8 py-6 border-b border-gray-50/50 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-blue-900 group cursor-pointer">
                    <div className="relative">
                        <Shield className="w-8 h-8 fill-blue-900 group-hover:drop-shadow-lg transition-all duration-300" />
                        <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-xl font-bold tracking-tight group-hover:text-blue-700 transition-colors">MySettle</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
                <div
                    onClick={() => onTabChange('profile')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'profile'
                        ? 'bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50 relative group'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 group relative overflow-hidden'
                        }`}
                >
                    {activeTab === 'profile' && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                    )}
                    <User className={`w-5 h-5 relative z-10 ${activeTab !== 'profile' && 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-sm font-semibold relative z-10">Profile</span>
                </div>

                <div className="pt-6 pb-3 px-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-sans">
                        Incident Management
                    </p>
                </div>

                <div
                    onClick={() => onTabChange('reports')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'reports'
                        ? 'bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50 relative group'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 group relative overflow-hidden'
                        }`}
                >
                    {activeTab === 'reports' && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                    )}
                    <FileText className={`w-5 h-5 relative z-10 ${activeTab !== 'reports' && 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-sm font-semibold relative z-10">Reports</span>
                </div>

                <div
                    onClick={() => onTabChange('history')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${activeTab === 'history'
                        ? 'bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50 relative group'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 group relative overflow-hidden'
                        }`}
                >
                    {activeTab === 'history' && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                    )}
                    <History className={`w-5 h-5 relative z-10 ${activeTab !== 'history' && 'group-hover:scale-110 transition-transform duration-200'}`} />
                    <span className="text-sm font-semibold relative z-10">History</span>
                </div>
            </nav>

            {/* Footer Area - Optional polish */}
            <div className="p-4 border-t border-gray-50">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 font-medium">v1.0.2 Admin Portal</p>
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group relative overflow-hidden">
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">{label}</span>
            <div className="absolute inset-0 bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
        </a>
    );
}
