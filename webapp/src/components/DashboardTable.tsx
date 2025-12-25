import { Search, Filter, Eye, CheckCircle2, AlertCircle, ChevronDown, SlidersHorizontal, MoreHorizontal, Flag, Pin } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

// 1. Mock Data (Unchanged data, improved visuals)
type ReportStatus = 'Pending' | 'Completed' | 'Mediation';
type HandshakeStatus = 'Verified' | 'Disputed' | 'Pending';

interface Report {
    id: string;
    status: ReportStatus;
    driverA: string;
    driverB: string;
    handshake: HandshakeStatus;
    date: string;
    time: string;
    venue: string;
    plateA: string;
    plateB: string;
    isFlagged?: boolean;
}

const initialReports: Report[] = [
    {
        id: 'RPT-2025-001',
        status: 'Completed',
        driverA: 'Ali Bin Abu',
        plateA: 'VAB 1234',
        driverB: 'Tan Ah Seng',
        plateB: 'JKA 5678',
        handshake: 'Verified',
        date: '22 Dec 2025',
        time: '08:45 AM',
        venue: 'Jalan Tun Razak, KL'
    },
    {
        id: 'RPT-2025-002',
        status: 'Pending',
        driverA: 'Muthusamy A/L Raju',
        plateA: 'WXY 9012',
        driverB: 'Sarah Wong',
        plateB: 'BND 3456',
        handshake: 'Verified',
        date: '22 Dec 2025',
        time: '10:15 AM',
        venue: 'LDP Highway, PJ'
    },
    {
        id: 'RPT-2025-003',
        status: 'Mediation',
        driverA: 'Chong Wei Han',
        plateA: 'PNG 7890',
        driverB: 'Nurul Izzah',
        plateB: 'KED 1122',
        handshake: 'Verified',
        date: '21 Dec 2025',
        time: '11:20 PM',
        venue: 'Jonker Walk, Melaka'
    },
    {
        id: 'RPT-2025-004',
        status: 'Completed',
        driverA: 'Farid Kamil',
        plateA: 'JHR 3344',
        driverB: 'Jason Lim',
        plateB: 'SEL 5566',
        handshake: 'Verified',
        date: '21 Dec 2025',
        time: '06:30 PM',
        venue: 'Penang Bridge'
    },
    {
        id: 'RPT-2025-005',
        status: 'Mediation',
        driverA: 'Siti Aminah',
        plateA: 'KEL 7788',
        driverB: 'Rajesh Kumar',
        plateB: 'PER 9900',
        handshake: 'Verified',
        date: '20 Dec 2025',
        time: '02:00 PM',
        venue: 'Federal Highway'
    },
    {
        id: 'RPT-2025-006',
        status: 'Completed',
        driverA: 'Lee Kuan Yew',
        plateA: 'SGP 1111',
        driverB: 'Ahmad Albab',
        plateB: 'MLK 2222',
        handshake: 'Verified',
        date: '20 Dec 2025',
        time: '09:10 AM',
        venue: 'Jalan Duta'
    },
    {
        id: 'RPT-2025-007',
        status: 'Pending',
        driverA: 'Lim Wei',
        plateA: 'NSE 3333',
        driverB: 'Ahmad bin Hassan',
        plateB: 'TRG 4444',
        handshake: 'Verified',
        date: '19 Dec 2025',
        time: '03:30 PM',
        venue: 'Bukit Bintang'
    },
    {
        id: 'RPT-2025-008',
        status: 'Mediation',
        driverA: 'Suresh Pillai',
        plateA: 'KLU 5555',
        driverB: 'John Doe',
        plateB: 'JOH 6666',
        handshake: 'Verified',
        date: '19 Dec 2025',
        time: '01:15 PM',
        venue: 'Subang Jaya'
    },
    {
        id: 'RPT-2025-009',
        status: 'Completed',
        driverA: 'Wong Siew Ling',
        plateA: 'PHG 7777',
        driverB: 'Fatima Zahra',
        plateB: 'KDR 8888',
        handshake: 'Verified',
        date: '18 Dec 2025',
        time: '11:45 AM',
        venue: 'Cheras'
    },
    {
        id: 'RPT-2025-010',
        status: 'Pending',
        driverA: 'Alice Tan',
        plateA: 'SGR 9999',
        driverB: 'Bob Smith',
        plateB: 'PEN 0001',
        handshake: 'Verified',
        date: '18 Dec 2025',
        time: '09:30 AM',
        venue: 'Bangsar'
    },
    {
        id: 'RPT-2025-011',
        status: 'Mediation',
        driverA: 'Michael Chong',
        plateA: 'PUT 1212',
        driverB: 'Sarah Lee',
        plateB: 'LAB 3434',
        handshake: 'Verified',
        date: '17 Dec 2025',
        time: '04:20 PM',
        venue: 'Petaling Jaya'
    },
    {
        id: 'RPT-2025-012',
        status: 'Completed',
        driverA: 'David Teoh',
        plateA: 'SAB 5656',
        driverB: 'Emily Ng',
        plateB: 'SAR 7878',
        handshake: 'Verified',
        date: '17 Dec 2025',
        time: '02:10 PM',
        venue: 'Klang'
    },
    {
        id: 'RPT-2025-013',
        status: 'Pending',
        driverA: 'Frankie Lam',
        plateA: 'NEG 9090',
        driverB: 'Grace Ho',
        plateB: 'MEL 1313',
        handshake: 'Verified',
        date: '16 Dec 2025',
        time: '10:00 AM',
        venue: 'Shah Alam'
    },
    {
        id: 'RPT-2025-014',
        status: 'Mediation',
        driverA: 'Henry Lau',
        plateA: 'PER 2424',
        driverB: 'Ivy Chen',
        plateB: 'KED 3535',
        handshake: 'Verified',
        date: '16 Dec 2025',
        time: '08:50 AM',
        venue: 'Kepong'
    },
    {
        id: 'RPT-2025-015',
        status: 'Completed',
        driverA: 'Jacky Cheung',
        plateA: 'PEN 4646',
        driverB: 'Kelly Lim',
        plateB: 'JOH 5757',
        handshake: 'Verified',
        date: '15 Dec 2025',
        time: '05:40 PM',
        venue: 'Setapak'
    },
    {
        id: 'RPT-2025-016',
        status: 'Pending',
        driverA: 'Larry Low',
        plateA: 'KEL 6868',
        driverB: 'Mary Jane',
        plateB: 'TER 7979',
        handshake: 'Verified',
        date: '15 Dec 2025',
        time: '03:25 PM',
        venue: 'Ampang'
    },
    {
        id: 'RPT-2025-017',
        status: 'Mediation',
        driverA: 'Nancy Goh',
        plateA: 'PAH 8080',
        driverB: 'Oscar Wilde',
        plateB: 'SEL 9191',
        handshake: 'Verified',
        date: '14 Dec 2025',
        time: '01:05 PM',
        venue: 'Gombak'
    },
    {
        id: 'RPT-2025-018',
        status: 'Completed',
        driverA: 'Peter Parker',
        plateA: 'NYC 1010',
        driverB: 'Quinn Fabray',
        plateB: 'LMA 2020',
        handshake: 'Verified',
        date: '14 Dec 2025',
        time: '11:55 AM',
        venue: 'Selayang'
    },
    {
        id: 'RPT-2025-019',
        status: 'Pending',
        driverA: 'Ricky Martin',
        plateA: 'SJU 3030',
        driverB: 'Susan Boyle',
        plateB: 'UKG 4040',
        handshake: 'Verified',
        date: '13 Dec 2025',
        time: '09:40 AM',
        venue: 'Rawang'
    },
    {
        id: 'RPT-2025-020',
        status: 'Mediation',
        driverA: 'Tom Hanks',
        plateA: 'USA 5050',
        driverB: 'Uma Thurman',
        plateB: 'HOL 6060',
        handshake: 'Verified',
        date: '13 Dec 2025',
        time: '07:30 AM',
        venue: 'Sungai Buloh'
    }
];

export default function DashboardTable({ view, onViewReport }: { view: 'reports' | 'history'; onViewReport: (id: string) => void }) {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Advanced Filters State
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'All'>('All');
    const [dateFilter, setDateFilter] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isRowsMenuOpen, setIsRowsMenuOpen] = useState(false);

    // Filter Logic
    const filteredReports = reports.filter(report => {
        const matchesSearch = (() => {
            const query = searchQuery.toLowerCase();
            return (
                report.id.toLowerCase().includes(query) ||
                report.plateA.toLowerCase().includes(query) ||
                report.plateB.toLowerCase().includes(query)
            );
        })();

        const matchesStatus = view === 'history'
            ? report.status === 'Completed'
            : report.status !== 'Completed' && (statusFilter === 'All' || report.status === statusFilter);

        const matchesDate = (() => {
            if (!dateFilter) return true;
            // Convert "22 Dec 2025" to standard date for comparison
            const reportDate = new Date(report.date);
            const filterDate = new Date(dateFilter);
            return reportDate.toDateString() === filterDate.toDateString();
        })();

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Pagination Logic
    const indexOfLastReport = currentPage * rowsPerPage;
    const indexOfFirstReport = indexOfLastReport - rowsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalReports = filteredReports.length;
    const totalPages = Math.ceil(totalReports / rowsPerPage);

    const toggleDropdown = (id: string) => {
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(id);
        }
    };

    const handleFlag = (id: string) => {
        const updatedReports = reports.map(report => {
            if (report.id === id) {
                return { ...report, isFlagged: !report.isFlagged };
            }
            return report;
        });

        // Sort: Flagged items first
        updatedReports.sort((a, b) => {
            if (a.isFlagged === b.isFlagged) return 0;
            return a.isFlagged ? -1 : 1;
        });

        setReports(updatedReports);
        setActiveDropdown(null);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Page Title & Toolbar */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Incident Reports</h1>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    {/* Left: Search & Filters */}
                    <div className="flex items-center gap-3 flex-1 min-w-[300px]">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search report ID, plate no..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all hover:bg-gray-50"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all shadow-sm",
                                    isFilterMenuOpen || statusFilter !== 'All' || dateFilter
                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {(statusFilter !== 'All' || dateFilter) && (
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                                )}
                            </button>

                            {/* Filter Dropdown */}
                            {isFilterMenuOpen && (
                                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-900">Filter Reports</h3>
                                        <button
                                            onClick={() => {
                                                setStatusFilter('All');
                                                setDateFilter('');
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                        >
                                            Reset All
                                        </button>
                                    </div>

                                    {/* Status Filter - Only show in Reports view */}
                                    {view === 'reports' && (
                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Status</label>
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {['All', 'Pending', 'Mediation'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => setStatusFilter(status as ReportStatus | 'All')}
                                                            className={clsx(
                                                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                                                                statusFilter === status
                                                                    ? "bg-blue-600 text-white border-blue-600"
                                                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                                            )}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Date Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Columns & Rows */}
                    <div className="flex items-center gap-3 text-gray-500">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-gray-900 transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                            Columns
                        </button>
                        <div className="h-4 w-px bg-gray-200"></div>

                        {/* Rows Per Page Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsRowsMenuOpen(!isRowsMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-gray-900 transition-colors"
                            >
                                {rowsPerPage} rows
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {isRowsMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                                    {[5, 10, 15, 20, 25].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                setRowsPerPage(size);
                                                setCurrentPage(1);
                                                setIsRowsMenuOpen(false);
                                            }}
                                            className={clsx(
                                                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                                                rowsPerPage === size ? "text-blue-600 font-medium bg-blue-50/50" : "text-gray-700"
                                            )}
                                        >
                                            {size} rows
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* The Data Table */}
            <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 overflow-visible ring-1 ring-black/5 min-h-[400px]">
                <div className="overflow-x-visible">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <TableHeader label="Report ID" />
                                <TableHeader label="Status" />
                                <TableHeader label="Involved Parties" />
                                <TableHeader label="Car Plate" className="min-w-[140px]" />
                                <TableHeader label="Digital Handshake" className="w-[160px]" />
                                <TableHeader label="Date / Time" />
                                <TableHeader label="Venue" />
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentReports.map((report) => (
                                <tr key={report.id} className={clsx(
                                    "transition-colors group cursor-default relative",
                                    report.isFlagged ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-blue-50/30"
                                )}>
                                    {/* Report ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {report.isFlagged && <Pin className="w-3.5 h-3.5 text-red-500 fill-red-500 rotate-45" />}
                                            <span className="text-sm font-bold text-gray-900 font-mono tracking-tight">{report.id}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={report.status} />
                                    </td>

                                    {/* Involved Parties */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className="text-sm font-medium text-gray-900">{report.driverA}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                <span className="text-sm font-medium text-gray-900">{report.driverB}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Car Plate */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className="text-sm font-medium text-gray-900">{report.plateA}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                <span className="text-sm font-medium text-gray-900">{report.plateB}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Digital Handshake */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <HandshakeBadge status={report.handshake} />
                                    </td>

                                    {/* Date/Time */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{report.date}</span>
                                            <span className="text-xs text-gray-400 font-medium mt-0.5">{report.time}</span>
                                        </div>
                                    </td>

                                    {/* Venue */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 truncate max-w-[180px]" title={report.venue}>{report.venue}</span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onViewReport(report.id)}
                                                className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleDropdown(report.id)}
                                                    className={clsx(
                                                        "text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-all",
                                                        activeDropdown === report.id && "bg-gray-100 text-gray-900"
                                                    )}
                                                    title="More Options"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {activeDropdown === report.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="p-1">
                                                            <button
                                                                onClick={() => handleFlag(report.id)}
                                                                className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg flex items-center gap-2 transition-colors"
                                                            >
                                                                <Flag className={clsx("w-4 h-4", report.isFlagged ? "fill-red-500 text-red-500" : "text-gray-400")} />
                                                                {report.isFlagged ? "Unflag Report" : "Flag for Review"}
                                                                {report.isFlagged && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-auto">Pinned</span>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <span className="text-xs font-medium text-gray-500">
                        Showing <span className="text-gray-900 font-bold">{Math.min(indexOfFirstReport + 1, totalReports)}-{Math.min(indexOfLastReport, totalReports)}</span> of <span className="text-gray-900 font-bold">{totalReports}</span> reports
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TableHeader({ label, className }: { label: string, className?: string }) {
    return (
        <th className={clsx(
            "px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 cursor-pointer hover:bg-gray-100/50 hover:text-gray-600 transition-colors group select-none",
            className
        )}>
            <div className="flex items-center gap-2">
                {label}
                {/* <ArrowUpDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
            </div>
        </th>
    );
}

function StatusBadge({ status }: { status: ReportStatus }) {
    const styles = {
        'Completed': "bg-emerald-50 text-emerald-700 border border-emerald-100",
        'Pending': "bg-amber-50 text-amber-700 border border-amber-100",
        'Mediation': "bg-violet-50 text-violet-700 border border-violet-100"
    };

    const dotStyles = {
        'Completed': "bg-emerald-500",
        'Pending': "bg-amber-500",
        'Mediation': "bg-violet-500"
    };

    return (
        <span className={clsx(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide shadow-sm",
            styles[status]
        )}>
            <span className={clsx("w-1.5 h-1.5 rounded-full mr-1.5", dotStyles[status])}></span>
            {status}
        </span>
    );
}

function HandshakeBadge({ status }: { status: HandshakeStatus }) {
    if (status === 'Verified') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-full text-xs font-bold text-emerald-700 shadow-sm w-fit group cursor-help">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified
                {/* Tooltip hint could go here */}
            </div>
        );
    }
    if (status === 'Disputed') {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/60 rounded-full text-xs font-bold text-red-700 shadow-sm w-fit animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                Disputed
            </div>
        );
    }
    return (
        <span className="text-xs text-gray-400 font-medium italic">Available upon verify</span>
    );
}
