from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from enum import Enum

from srcs.models.enums import EvidenceTag

class EvidenceType(str, Enum):
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"
    MAP_SKETCH = "MAP_SKETCH"
    TEXT = "TEXT"

class Evidence(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    report_id: int | None = Field(default=None, foreign_key="accidentreport.id")
    uploader_id: str = Field(foreign_key="user.id")
    title: str
    type: EvidenceType
    content: str  # Base64 or URL or raw text
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Link to draft
    draft_id: int | None = Field(default=None, foreign_key="accidentreportdraft.id")
    tag: EvidenceTag | None = None  # e.g. "Car Front", "Car Back"


class AccidentReportDraft(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="accidentsession.id")

    # Android Input Fields
    weather: str | None = None
    accident_time: datetime | None = None
    road_surface: str | None = None
    road_type: str | None = None
    location: str | None = None

    # Statement
    description: str | None = None  # What happened
    at_fault_driver: str | None = None  # who was wrong
    reason: str | None = None

    # Incident Specific Missing Fields (Required for Polic Report)
    incident_type: str | None = None  # jenis_kejadian e.g., "Maut", "Cedera", "Rosak"
    light_condition: str | None = None  # Keadaan Cahaya e.g., Day, Night


class AccidentReport(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="accidentsession.id")

    # Source Draft IDs
    driver_a_draft_id: int | None = Field(default=None, foreign_key="accidentreportdraft.id")
    driver_b_draft_id: int | None = Field(default=None, foreign_key="accidentreportdraft.id")
    report_details_id: int | None = Field(default=None, foreign_key="policereportdetails.id")

    # Signatures
    police_signature: str | None = None
    driver_a_signature: str | None = None
    driver_b_signature: str | None = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PoliceReportDetails(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    session_id: str = Field(foreign_key="accidentsession.id", unique=True)
    
    # 1. POLIS REPOT Fields
    report_no: str  # No. Repot: TRAFF/001/24
    balai_polis: str # Balai: Balai Polis Trafik KL
    daerah: str # Daerah: Kuala Lumpur
    kontinjen: str # Kontinjen: WPKL
    tahun: str # Tahun: 2024
    
    tarikh_repot: datetime = Field(default_factory=datetime.utcnow)
    bahasa_diterima: str | None = "B. Malaysia"
    no_repot_bersangkut: str | None = None
    
    # Butir-butir Penerima
    penerima_nama: str
    penerima_id: str
    penerima_pangkat: str | None = None
    
    # Butir-butir Jurubahasa (Optional placeholder fields)
    jurubahasa_nama: str | None = None
    jurubahasa_ic: str | None = None
    jurubahasa_polis_id: str | None = None
    jurubahasa_pasport: str | None = None
    jurubahasa_bahasa_asal: str | None = None
    jurubahasa_alamat: str | None = None
    
    # Butir-butir Pengadu (Driver A usually)
    pengadu_nama: str
    pengadu_ic: str
    pengadu_polis_tentera: str | None = None
    pengadu_pasport: str | None = None
    pengadu_sijil_beranak: str | None = None
    pengadu_alamat: str
    pengadu_alamat_ibubapa: str | None = None
    pengadu_alamat_pejabat: str | None = None
    pengadu_tel: str # Mobile
    pengadu_tel_rumah: str | None = None
    pengadu_tel_pejabat: str | None = None
    pengadu_email: str | None = None
    pengadu_pekerjaan: str
    pengadu_tarikh_lahir: datetime | None = None
    pengadu_umur: str | None = None
    pengadu_jantina: str | None = None
    pengadu_keturunan: str | None = None
    pengadu_warganegara: str | None = "Malaysia"
    
    # Butir-butir Jurubahasa (Optional placeholder fields)
    jurubahasa_nama: str | None = None
    jurubahasa_ic: str | None = None
    
    # Butir-butir Kejadian
    
    # Butir-butir Kejadian
    tarikh_kejadian: datetime
    tempat_kejadian: str
    jenis_kejadian: str # Kemalangan Rosak Sahaja / Kecederaan ...
    
    # Keterangan (Story)
    keterangan_kes: str
    
    # 2. RAJAH KASAR Metadata
    # The actual drawing will be stored as an Evidence (MAP_SKETCH)
    pegawai_penyiasat_sketch: str # Name of officer who did the sketch
    no_kertas_siasatan: str | None = None
    dicetak_oleh: str | None = None 
    
    # 3. KEPUTUSAN PENYIASATAN Fields
    # Recipient Info (Usually Pengadu, but good to have explicit)
    penerima_surat_nama: str | None = None
    penerima_surat_ic: str | None = None
    penerima_surat_alamat: str | None = None
    penerima_surat_kenderaan_no: str | None = None
    penerima_surat_kenderaan_jenis: str | None = None

    # Butir-butir Kenderaan & Pemandu (Driver A)
    kenderaan_a_no: str
    kenderaan_a_jenis: str # M/Car, M/Cycle
    pemandu_a_nama: str
    pemandu_a_ic: str
    pemandu_a_lesen: str
    
    # Butir-butir Kenderaan & Pemandu (Driver B)
    kenderaan_b_no: str
    kenderaan_b_jenis: str
    pemandu_b_nama: str
    pemandu_b_ic: str
    pemandu_b_lesen: str
    
    # Keputusan
    seksyen_kesalahan: str # e.g., "Sek 10 LN 166/59"
    keputusan_awal: str # e.g., "Saman Pol 257 (Kpd B)"
    catatan_keputusan: str
    
    # Pihak Yang Disalahkan (For the letter)
    saman_no: str | None = None
    saman_amount: str | None = None # e.g. "RM300"
    pihak_salah_nama: str | None = None
    pihak_salah_ic: str | None = None
    pihak_salah_alamat: str | None = None
    pihak_salah_no_kenderaan: str | None = None
    pihak_salah_jenis_kenderaan: str | None = None
    
    pegawai_penyiasat_nama: str
    pegawai_penyiasat_pangkat: str
