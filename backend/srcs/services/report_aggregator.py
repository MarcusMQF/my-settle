from datetime import datetime, timedelta
from srcs.models.report import PoliceReportDetails, AccidentReportDraft, AccidentReport
from srcs.models.user import User

def parse_ic_details(ic_no: str):
    """
    Parses a Malaysian IC number (format: YYMMDD-PB-####) to extract
    birth date, age, and gender.
    Returns: (birth_date_obj, age_str, gender_str)
    """
    if not ic_no or len(ic_no) < 12:
        return None, None, None
        
    # Clean the IC (remove hyphens)
    clean_ic = ic_no.replace("-", "").strip()
    
    if len(clean_ic) != 12 or not clean_ic.isdigit():
        return None, None, None
        
    # 1. Parse Date of Birth
    yy = int(clean_ic[0:2])
    mm = int(clean_ic[2:4])
    dd = int(clean_ic[4:6])
    
    # Heuristic: If YY > current year last 2 digits, likely 19YY.
    # Current year 2025 -> 25. If YY=92 -> 1992. If YY=10 -> 2010.
    current_year = datetime.now().year
    current_yy = int(str(current_year)[-2:])
    
    prefix = "19" if yy > current_yy else "20"
    dob_year = int(f"{prefix}{yy:02d}")
    
    try:
        dob = datetime(dob_year, mm, dd)
    except ValueError:
        return None, None, None
        
    # 2. Calculate Age
    today = datetime.now()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    
    # 3. Determine Gender (Last digit: Odd=Male, Even=Female)
    last_digit = int(clean_ic[-1])
    gender = "Lelaki" if last_digit % 2 != 0 else "Perempuan"
    
    return dob, str(age), gender

def generate_police_details(
    session_id: str,
    draft_a: AccidentReportDraft,
    draft_b: AccidentReportDraft,
    user_a: User,
    user_b: User
) -> PoliceReportDetails:
    """
    Aggregates data from two drafts and two users to create a preliminary PoliceReportDetails.
    Driver A is treated as the 'Pengadu' (Complainant).
    """
    
    # --- 1. Resolution / Merging Logic ---
    # Primary Source: Draft A (as Pengadu)
    # Secondary Source: Draft B (Fallback if Draft A is missing info)
    
    # 1.1 Incident Time
    accident_time = draft_a.accident_time or draft_b.accident_time or datetime.now()
    
    # 1.2 Location
    location = draft_a.location or draft_b.location or "Lokasi Tidak Dinyatakan"
    
    # 1.3 Incident Type (Jenis Kemalangan)
    incident_type = draft_a.incident_type or draft_b.incident_type or "Kemalangan Jalan Raya"
    
    # 1.4 Description (Keterangan Kes)
    # We combine important context if available
    description_parts = []
    
    # Main Story
    story = draft_a.description or draft_b.description or "Tiada keterangan kejadian."
    description_parts.append(story)
    
    # Context (Weather, Road) - Only add if provided
    context_info = []
    weather = draft_a.weather or draft_b.weather
    if weather:
        context_info.append(f"Cuaca: {weather}")
        
    surface = draft_a.road_surface or draft_b.road_surface
    if surface:
        context_info.append(f"Jalan: {surface}")
        
    road_type = draft_a.road_type or draft_b.road_type
    if road_type:
        context_info.append(f"Jenis Jalan: {road_type}")
        
    if context_info:
        description_parts.append("\n(" + ", ".join(context_info) + ")")

    final_description = " ".join(description_parts)

    
    # --- 2. Construct Object ---
    current_year = str(datetime.now().year)
    
    # Parse User A IC details
    pengadu_dob, pengadu_age, pengadu_gender = parse_ic_details(user_a.ic_no)
    
    return PoliceReportDetails(
        session_id=session_id,
        
        # 1. Header Info (Placeholders)
        report_no=f"DRAFT/{session_id[:8].upper()}/{current_year}",
        balai_polis="TBD (Auto-assigned)",
        daerah="TBD",
        kontinjen="TBD",
        tahun=current_year,
        
        # 2. Penerima (System)
        penerima_nama="SISTEM MYSETTLE",
        penerima_id="SYS-AUTO",
        penerima_pangkat="-",
        
        # 3. Pengadu (Driver A)
        pengadu_nama=user_a.name,
        pengadu_ic=user_a.ic_no,
        pengadu_alamat=user_a.address or "Alamat Tidak Dinyatakan",
        pengadu_tel=user_a.phone_number or "-",
        pengadu_pekerjaan=user_a.job or "-",
        pengadu_warganegara="Malaysia", # Default
        pengadu_tarikh_lahir=pengadu_dob,
        pengadu_umur=pengadu_age or "-",
        pengadu_jantina=pengadu_gender or "-",
        pengadu_keturunan="-", # Not derivable from IC
        
        # 4. Incident Details
        tarikh_kejadian=accident_time,
        tempat_kejadian=location,
        jenis_kejadian=incident_type,
        keterangan_kes=final_description,
        
        # 5. Rajah Kasar Metadata
        pegawai_penyiasat_sketch="TBD",
        
        # 6. Vehicles
        # Driver A
        kenderaan_a_no=user_a.car_plate,
        kenderaan_a_jenis=user_a.car_model, 
        pemandu_a_nama=user_a.name,
        pemandu_a_ic=user_a.ic_no,
        pemandu_a_lesen=user_a.license_number or "D",
        
        # Driver B
        kenderaan_b_no=user_b.car_plate,
        kenderaan_b_jenis=user_b.car_model,
        pemandu_b_nama=user_b.name,
        pemandu_b_ic=user_b.ic_no,
        pemandu_b_lesen=user_b.license_number or "D",
        
        # 7. Decision (Placeholders)
        seksyen_kesalahan="Siasatan Dijalankan",
        keputusan_awal="Belum Diputuskan",
        catatan_keputusan="-",
        
        # 8. Officer
        pegawai_penyiasat_nama="TBD",
        pegawai_penyiasat_pangkat="-"
    )

def create_accident_report(
    session_id: str,
    draft_a: AccidentReportDraft,
    draft_b: AccidentReportDraft,
    user_a: User,
    user_b: User
) -> AccidentReport:
    """
    Creates the main AccidentReport linking to the drafts and the generated PoliceReportDetails.
    """
    
    # 1. Generate the details
    details = generate_police_details(session_id, draft_a, draft_b, user_a, user_b)
    
    # 2. Create the Report container
    report = AccidentReport(
        session_id=session_id,
        driver_a_draft_id=draft_a.id,
        driver_b_draft_id=draft_b.id,
        # report_details_id will be set after details is committed if not doing cascade
        # but for now we return the object structure to be handled by the caller/session
    )
    
    # Note: caller responsible for saving 'details' and 'report' to DB
    return report, details
