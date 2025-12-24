import sys
import os
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from srcs.models.report import PoliceReportDetails
from srcs.services.pdf_service import PDFService

def test_generate_pdfs():
    print("Testing PDF Generation...")
    
    # Mock Data
    details = PoliceReportDetails(
        session_id="SESSION_123",
        report_no="TRAFF/001/24",
        balai_polis="Balai Polis Trafik KL",
        daerah="Kuala Lumpur",
        kontinjen="WPKL",
        tahun="2024",
        penerima_nama="Kpl 12345 Ali",
        penerima_id="12345",
        penerima_pangkat="KPL/L",
        
        jurubahasa_nama="Ali bin Abu",
        jurubahasa_ic="901010-10-1010",
        jurubahasa_polis_id="RF123456",
        jurubahasa_pasport="A12345678",
        jurubahasa_bahasa_asal="Melayu",
        jurubahasa_alamat="No 123, Jalan Jurubahasa, KL",
 
        tarikh_kejadian=datetime.now(),
        tempat_kejadian="Jalan Tun Razak",
        jenis_kejadian="Kemalangan Rosak Sahaja",
        keterangan_kes="Saya memandu di lorong tengah tiba-tiba dilanggar dari belakang.",
        pegawai_penyiasat_sketch="Insp. Sarah",
        no_kertas_siasatan="J/BAHRU SELATAN/JSPT/KST/14762/24",
        dicetak_oleh="KPL NOORHASANAH BINTI ZULKIFLI 05/12/2024 09:10",
        kenderaan_a_no="WAA 1234",
        kenderaan_a_jenis="M/Car",
        pemandu_a_nama="Ahmad Bin Abu",
        pemandu_a_ic="900101-14-1234",
        pemandu_a_lesen="D",
        kenderaan_b_no="WBB 5678",
        kenderaan_b_jenis="M/Car",
        pemandu_b_nama="Lim Ah Seng",
        pemandu_b_ic="880505-10-5555",
        pemandu_b_lesen="D",
        seksyen_kesalahan="Sek 10 LN 166/59",
        keputusan_awal="Saman Pol 257 (Kpd B)",
        catatan_keputusan="Siasatan selesai.",
        pegawai_penyiasat_nama="Insp. Sarah",
        pegawai_penyiasat_pangkat="Inspektor",
        
        # New Polis Repot Fields
        bahasa_diterima="B. Malaysia",
        no_repot_bersangkut="TRAFF JOHOR BAHRU(S)/039527/24",


        pengadu_alamat_ibubapa="---",
        pengadu_alamat_pejabat="---",
        pengadu_tel="012-7140098", # Bimbit
        pengadu_tel_rumah="---",
        pengadu_tel_pejabat="---",
        pengadu_nama="Ahmad Bin Abu",
        pengadu_ic="900101-14-1234",
        pengadu_polis_tentera="RF99999",
        pengadu_pasport="K12345678",
        pengadu_sijil_beranak="SB987654321",
        pengadu_email="ahmadbinabu123@example.com",
        pengadu_alamat="123 Jalan Test, KL",
        pengadu_pekerjaan="Pemandu Grab",

        pengadu_jantina="Perempuan",
        pengadu_tarikh_lahir=datetime(1982, 12, 6),
        pengadu_umur="41 Tahun 11 Bulan",
        pengadu_keturunan="Cina",
        pengadu_warganegara="Malaysia",

        # Keputusan Letter Details
        penerima_surat_nama="ALI BIN ABU",
        penerima_surat_ic="11233019090",
        penerima_surat_alamat="NO 66 JALAN KUANTAN 10/6, TAMAN BUNGA, 81100 JOHOR",
        penerima_surat_kenderaan_no="JWX3663",
        penerima_surat_kenderaan_jenis="PACUAN EMPAT RODA",
        
        saman_no="CARS240368124",
        saman_amount="RM300",
        pihak_salah_nama="WONG AH LI",
        pihak_salah_ic="880505105555",
        pihak_salah_alamat="NO 01 JALAN ARAH 1/6 TAMAN BUNGA, 81100 JOHOR",
        pihak_salah_no_kenderaan="JWX2072",
        pihak_salah_jenis_kenderaan="Motokar"
    )

    pdf_service = PDFService(output_dir="test_reports")
    
    try:
        f1 = pdf_service.generate_polis_repot(details)
        print(f"Generated Polis Repot: {f1} (Size: {os.path.getsize(f1)} bytes)")
        
        f2 = pdf_service.generate_rajah_kasar(details)
        print(f"Generated Rajah Kasar: {f2} (Size: {os.path.getsize(f2)} bytes)")
        
        f3 = pdf_service.generate_keputusan(details)
        print(f"Generated Keputusan: {f3} (Size: {os.path.getsize(f3)} bytes)")
        
        print("All PDFs generated successfully in 'test_reports' folder.")
    except Exception as e:
        print(f"Error generating PDFs: {e}")

if __name__ == "__main__":
    test_generate_pdfs()
