import { User, BadgeCheck, Briefcase, Building2, Clock, Award } from 'lucide-react';

export default function OfficerProfile() {
    // Mock Data
    const officer = {
        name: "Sgt. Ahmad bin Kassim",
        position: "Senior Traffic Sergeant",
        id: "PO-8821045",
        department: "Traffic Investigation & Enforcement",
        yearsOfService: "15 Years",
        specialty: "Accident Reconstruction & Forensics"
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Officer Profile</h1>
                <p className="text-sm text-gray-500">View your service details and records.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Banner / Header Card */}
                <div className="bg-blue-600 h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <User className="w-12 h-12" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                {officer.name}
                                <BadgeCheck className="w-5 h-5 text-blue-500" />
                            </h2>
                            <p className="text-gray-500 font-medium">{officer.position}</p>
                        </div>
                        <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Officer ID</span>
                            <span className="font-mono font-medium text-gray-900">{officer.id}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                        <ProfileItem icon={Building2} label="Department" value={officer.department} />
                        <ProfileItem icon={Clock} label="Years of Service" value={officer.yearsOfService} />
                        <ProfileItem icon={Award} label="Specialty" value={officer.specialty} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
                <p className="font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}
