import os
import sys
from datetime import datetime

# Add backend to sys.path
# We assume this script is located in backend/
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# Also add the parent directory if needed to resolve 'srcs'
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from srcs.services.pdf_service import PDFService
from srcs.models.report import PoliceReportDetails

def generate_reports():
    output_dir = os.path.join(current_dir, "test_reports")
    pdf_service = PDFService(output_dir=output_dir)
    
    # Mock Data matching the user's screenshots
    details = PoliceReportDetails(
        # Session
        session_id="session_123",
        
        # 1. Police Report Fields
        report_no="TRAFF/001/25",
        balai_polis="Balai Polis Trafik Jalan Tun H.S. Lee",
        daerah="Kuala Lumpur",
        kontinjen="WPKL",
        tahun="2025",
        tarikh_repot=datetime(2025, 12, 22, 10, 0), # Report made same day later
        
        # Penerima Repot
        penerima_nama="Kpl 12345 Hassan",
        penerima_id="12345",
        penerima_pangkat="Koperal",
        
        # Pengadu (Driver A) - Matched to Image
        pengadu_nama="Ali Bin Abu",
        pengadu_ic="850101-14-1234",
        pengadu_tel="+60 12-345 6789",
        # Deduced/Mocked fields not in image
        pengadu_alamat="No 12, Jalan Damai, 55100 Kuala Lumpur", 
        pengadu_pekerjaan="Private Sector",
        pengadu_tarikh_lahir=datetime(1985, 1, 1),
        pengadu_umur="40",
        pengadu_jantina="Lelaki",
        pengadu_keturunan="Melayu",
        pengadu_warganegara="Malaysia",
        
        # Incident
        tarikh_kejadian=datetime(2025, 12, 22, 8, 45),
        tempat_kejadian="Jalan Tun Razak, KL",
        jenis_kejadian="Kemalangan Rosak Sahaja",
        keterangan_kes="I was stopped at the red light waiting for it to turn green. Suddenly, I felt a strong impact from behind. I checked my rear-view mirror and saw that the car behind me had crashed into my rear bumper. Weather was Rainy, Road Surface was Wet.",
        
        # 2. Rajah Kasar Metadata
        pegawai_penyiasat_sketch="Insp. Johan",
        no_kertas_siasatan="KS/123/25",
        dicetak_oleh="Kpl Hassan",
        
        # 3. Keputusan Metadata
        
        # Driver A Vehicle (Pengadu)
        kenderaan_a_no="VAB 1234",
        kenderaan_a_jenis="Honda City",
        pemandu_a_nama="Ali Bin Abu",
        pemandu_a_ic="850101-14-1234",
        pemandu_a_lesen="Valid till 14 Jan 2028",
        
        # Driver B (Faulty Party) - Mocked
        kenderaan_b_no="WXY 5678",
        kenderaan_b_jenis="Proton Saga",
        pemandu_b_nama="Abu Bakar",
        pemandu_b_ic="900101-14-5678",
        pemandu_b_lesen="Valid",
        
        # Keputusan Details
        seksyen_kesalahan="Rule 10 LN 166/59", # Standard rear-end
        keputusan_awal="Saman dikeluarkan",
        catatan_keputusan="Pemandu B gagal mengawal kenderaan.",
        
        # Pihak Salah Info
        pihak_salah_nama="Abu Bakar",
        pihak_salah_ic="900101-14-5678",
        pihak_salah_alamat="No 55, Jalan Pinang, 50450 Kuala Lumpur",
        pihak_salah_no_kenderaan="WXY 5678",
        pihak_salah_jenis_kenderaan="Proton Saga",
        saman_no="POL-59281",
        saman_amount="RM300",
        
        pegawai_penyiasat_nama="Insp. Johan",
        pegawai_penyiasat_pangkat="Inspektor"
    )
    
    # 1. Generate Repot Polis
    path1 = pdf_service.generate_polis_repot(details, signed_by_pengadu="Ali Bin Abu", signed_by_police="Insp. Johan", filename="repot_polis_driver_a.pdf")
    print(f"Generated Police Report: {path1}")
    
    # 2. Generate Rajah Kasar
    # Absolute path to sketch
    sketch_path = os.path.abspath(os.path.join(current_dir, "../webapp/src/assets/rajahkasar.png"))
    
    if not os.path.exists(sketch_path):
        print(f"Warning: Sketch image not found at {sketch_path}, looking in current dir...")
        # Fallback check
        sketch_path = os.path.join(current_dir, "rajahkasar.png")
        if not os.path.exists(sketch_path):
             print("Still not found, passing None.")
             sketch_path = None
        
    path2 = pdf_service.generate_rajah_kasar(details, sketch_data=sketch_path, filename="rajah_kasar_driver_a.pdf")
    print(f"Generated Sketch: {path2}")
    
    # 3. Generate Keputusan
    path3 = pdf_service.generate_keputusan(details, filename="keputusan_driver_a.pdf")
    print(f"Generated Decision: {path3}")

if __name__ == "__main__":
    generate_reports()
