import { ArrowLeft, FileText, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ReportSelectionProps {
    onBack: () => void;
}

export default function ReportSelection({ onBack }: ReportSelectionProps) {
    const [selectedDriver, setSelectedDriver] = useState<'A' | 'B' | null>(null);

    const reports = [
        { name: 'Repot Polis', file: 'repot_polis_driver_a.pdf' },
        { name: 'Rajah Kasar', file: 'rajah_kasar_driver_a.pdf' },
        { name: 'Keputusan', file: 'keputusan_driver_a.pdf' },
    ];

    const [viewingPdf, setViewingPdf] = useState<{ name: string, file: string } | null>(null);

    if (viewingPdf) {
        return (
            <PDFModal
                document={viewingPdf}
                onClose={() => setViewingPdf(null)}
            />
        );
    }

    if (selectedDriver === 'A') {
        return (
            <div className="animate-fade-in-up">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => setSelectedDriver(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Driver A Reports</h1>
                        <p className="text-sm text-gray-500">Ali Bin Abu (VAB 1234)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{report.name}</h3>
                            <button
                                onClick={() => setViewingPdf(report)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                                View Document
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (selectedDriver === 'B') {
        return (
            <div className="animate-fade-in-up">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => setSelectedDriver(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Driver B Reports</h1>
                        <p className="text-sm text-gray-500">Tan Ah Seng (JKA 5678)</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No reports generated yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Select Driver</h1>
                    <p className="text-sm text-gray-500">Choose a driver to view generated reports</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => setSelectedDriver('A')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Driver A</h3>
                    <p className="text-sm text-gray-500">Ali Bin Abu (Complainant)</p>
                </button>

                <button
                    onClick={() => setSelectedDriver('B')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-left group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Driver B</h3>
                    <p className="text-sm text-gray-500">Tan Ah Seng (Respondent)</p>
                </button>
            </div>
        </div>
    );
}

import { X, Download } from 'lucide-react';

function PDFModal({ document, onClose }: { document: { name: string, file: string }, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0">
            <div className="absolute inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-gray-900/5">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{document.name}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">PDF Document</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`/reports/${document.file}`}
                            download
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 bg-gray-100 p-0 overflow-hidden relative rounded-b-2xl">
                    <iframe
                        src={`/reports/${document.file}`}
                        className="w-full h-full border-0"
                        title={document.name}
                    />
                </div>
            </div>
        </div>
    );
}
