import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeTab: 'reports' | 'history' | 'profile';
    onTabChange: (tab: 'reports' | 'history' | 'profile') => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            <div className="flex-1 ml-[260px] flex flex-col">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
