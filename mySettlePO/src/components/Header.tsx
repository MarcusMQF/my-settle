import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Mock Notifications
    const notifications = [
        {
            id: 1,
            title: "New Report Submitted",
            description: "Car Accident at Jalan Tun Razak involving 2 vehicles.",
            time: "2 mins ago",
            isRead: false
        },
        {
            id: 2,
            title: "Verification Required",
            description: "Sketch pending verification for Case #RPT-2025-009.",
            time: "1 hour ago",
            isRead: false
        }
    ];

    const handleLogout = () => {
        alert("Logging out...");
        setIsDropdownOpen(false);
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-300">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm tracking-tight">
                <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">MySettle</span>
                <span className="mx-2.5 text-gray-300">/</span>
                <span className="text-gray-900 font-semibold">Reports List</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className="relative p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 group"
                    >
                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsNotificationsOpen(false)}
                            ></div>
                            <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.15)] border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-5 pb-3 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wide cursor-pointer hover:underline">Mark all read</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{notif.title}</p>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-snug">{notif.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 h-8 relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-full p-1 pr-3 transition-colors group relative"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-900/20 ring-2 ring-white group-hover:ring-blue-100 transition-all">
                            PO
                        </div>
                        <div className="flex flex-col items-start hidden sm:flex">
                            <span className="text-xs font-bold text-gray-900 leading-tight">Officer John</span>
                            <span className="text-[10px] text-gray-500 font-medium">Headquarters</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsDropdownOpen(false)}
                            ></div>
                            <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
