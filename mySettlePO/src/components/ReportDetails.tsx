import {
    ArrowLeft, Calendar, Clock, MapPin, CloudRain, Navigation, FileCheck, ShieldCheck, Download, FileText
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface ReportDetailsProps {
    reportId: string;
    onBack: () => void;
}

// Mock Detailed Data
const mockReportDetails = {
    id: "RPT-2025-001",
    status: "Pending",
    driverA: {
        name: "Ali Bin Abu",
        ic: "850101-14-1234",
        phone: "+60 12-345 6789",
        licenseValidity: "14 Jan 2028",
        carModel: "Honda City",
        plate: "VAB 1234",
        roadtaxValidity: "20 Sep 2026"
    },
    driverB: {
        name: "Tan Ah Seng",
        ic: "900505-10-5678",
        phone: "+60 19-876 5432",
        licenseValidity: "22 Dec 2027",
        carModel: "Toyota Vios",
        plate: "JKA 5678",
        roadtaxValidity: "15 Mar 2026"
    },
    accidentInfo: {
        weather: "Rainy",
        date: "22 Dec 2025",
        time: "08:45 AM",
        surface: "Wet",
        roadType: "T-Junction",
        location: "Jalan Tun Razak, KL",
    },
    description: {
        whatHappened: "Driver B rear-ended Driver A at the traffic light.",
        whoWrong: "Driver B",
        whyWrong: "Failed to brake in time.",
        dashcam: "https://example.com/footage.mp4"
    },
    verification: {
        policeOfficer: "",
        fault: "Pending" // Driver A, Driver B, Shared, Pending
    }
};

export default function ReportDetails({ reportId, onBack }: ReportDetailsProps) {
    const [fault, setFault] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);

    const handleVerify = () => {
        setIsVerified(true);
        // In real app, this would generate the PDF
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-24">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
                    <p className="text-sm text-gray-500">ID: <span className="font-mono font-medium text-gray-700">{reportId}</span></p>
                </div>
                {isVerified && (
                    <div className="ml-auto bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Report
                    </div>
                )}
            </div>

            {/* Section 1: Involved Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DriverCard label="Driver A (Complainant)" data={mockReportDetails.driverA} color="blue" />
                <DriverCard label="Driver B (Respondent)" data={mockReportDetails.driverB} color="gray" />
            </div>

            {/* Section 2: Evidence Photos */}
            <Section title="Evidence Photos">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Driver A ({mockReportDetails.driverA.plate})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {['Front', 'Back', 'Left', 'Right', 'Damage'].map((view) => (
                                <PhotoPlaceholder key={`A-${view}`} view={view} />
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Driver B ({mockReportDetails.driverB.plate})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {['Front', 'Back', 'Left', 'Right', 'Damage'].map((view) => (
                                <PhotoPlaceholder key={`B-${view}`} view={view} />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Section 3: Accident Information */}
            <Section title="Accident Information">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <InfoItem icon={CloudRain} label="Weather" value={mockReportDetails.accidentInfo.weather} />
                    <InfoItem icon={Calendar} label="Date" value={mockReportDetails.accidentInfo.date} />
                    <InfoItem icon={Clock} label="Time" value={mockReportDetails.accidentInfo.time} />
                    <InfoItem icon={Navigation} label="Road Surface" value={mockReportDetails.accidentInfo.surface} />
                    <InfoItem icon={Navigation} label="Road Type" value={mockReportDetails.accidentInfo.roadType} />
                    <InfoItem icon={MapPin} label="Location" value={mockReportDetails.accidentInfo.location} />
                </div>
                <div className="mt-6 border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Rajah Kasar (Sketch)</h4>
                    <div className="aspect-[21/9] bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Sketch Canvas Placeholder</span>
                    </div>
                </div>
            </Section>

            {/* Section 4: Incident Description */}
            <Section title="Incident Description">
                <div className="space-y-4">
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">What Happened</span>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{mockReportDetails.description.whatHappened}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Who Was Wrong</span>
                            <p className="font-medium text-gray-900">{mockReportDetails.description.whoWrong}</p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Why Wrong</span>
                            <p className="font-medium text-gray-900">{mockReportDetails.description.whyWrong}</p>
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Dashcam Footage</span>
                        <a href="#" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-2">
                            <FileCheck className="w-4 h-4" />
                            View Footage
                        </a>
                    </div>
                </div>
            </Section>

            {/* Section 5: Verification & Interactive Module */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Police Verification</h2>
                        <p className="text-sm text-gray-500 mt-1">Verify details and assign fault to generate the official report.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                        Official Use
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Assign Fault</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Driver A', 'Driver B', 'Shared Responsibility'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setFault(option)}
                                className={clsx(
                                    "py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all",
                                    fault === option
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button onClick={onBack} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleVerify}
                        disabled={!fault || isVerified}
                        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        {isVerified ? "Report Generated" : "Verify & Generate Report"}
                    </button>
                </div>
            </div>
            {/* Action Bar Fixed at Bottom */}
            {isVerified && (
                <div className="fixed bottom-0 left-0 md:left-[260px] right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-5 duration-300 z-50">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden md:block">
                            <p className="text-sm font-bold text-gray-900">Report Ready</p>
                            <p className="text-xs text-gray-500">Authenticated on {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => alert("Opening Report View...")}
                                className="flex-1 md:flex-none bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                            >
                                <FileText className="w-4 h-4" />
                                View Report
                            </button>
                            <button
                                onClick={() => alert("Downloading Report PDF...")}
                                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                {title}
            </h3>
            {children}
        </div>
    );
}

function DriverCard({ label, data, color }: { label: string, data: any, color: 'blue' | 'gray' }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={clsx("px-6 py-4 border-b border-gray-100 flex items-center justify-between", color === 'blue' ? "bg-blue-50/50" : "bg-gray-50/50")}>
                <h3 className="font-bold text-gray-900">{label}</h3>
                <div className={clsx("w-2 h-2 rounded-full", color === 'blue' ? "bg-blue-500" : "bg-gray-400")}></div>
            </div>
            <div className="p-6 space-y-4">
                <DetailRow label="Full Name" value={data.name} />
                <DetailRow label="IC Number" value={data.ic} mono />
                <DetailRow label="Phone" value={data.phone} mono />
                <div className="h-px bg-gray-50 my-2"></div>
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Car Model" value={data.carModel} />
                    <DetailRow label="Plate Number" value={data.plate} mono />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="License Valid" value={data.licenseValidity} />
                    <DetailRow label="Roadtax Valid" value={data.roadtaxValidity} />
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, mono = false }: { label: string, value: string, mono?: boolean }) {
    return (
        <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
            <span className={clsx("text-sm font-medium text-gray-900", mono && "font-mono")}>{value}</span>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
        </div>
    );
}

function PhotoPlaceholder({ view }: { view: string }) {
    return (
        <div className="space-y-2">
            <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-blue-200 flex items-center justify-center mx-auto mb-2 transition-colors">
                        <CloudRain className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium group-hover:text-blue-600">{view}</span>
                </div>
            </div>
        </div>
    );
}
