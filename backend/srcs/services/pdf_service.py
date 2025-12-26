import os
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image, Frame, PageTemplate
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from srcs.models.report import PoliceReportDetails

class PDFService:
    def __init__(self, output_dir: str = "generated_reports"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def _header_footer(self, canvas, doc):
        canvas.saveState()

        page_width = A4[0]
        content_width = 6.5 * inch
        margin_x = (page_width - content_width) / 2
        
        # Header Line
        header_y = A4[1] - doc.topMargin + 10 
        canvas.setLineWidth(1)
        canvas.line(margin_x, header_y, page_width - margin_x, header_y)
        
        # Footer
        footer_y = doc.bottomMargin - 15
        # Footer Line
        canvas.line(margin_x, footer_y + 12, page_width - margin_x, footer_y + 12)
        
        # Footer Text
        footer_text = f"Muka surat {doc.page} daripada 1" 
        canvas.setFont('Helvetica', 9)
        canvas.drawRightString(page_width - margin_x, footer_y, footer_text)
        
        canvas.restoreState()

    def _get_styles(self):
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='CenterTitle', parent=styles['Heading1'], alignment=TA_CENTER, spaceAfter=20, fontSize=12))
        styles.add(ParagraphStyle(name='JustifyText', parent=styles['Normal'], alignment=TA_JUSTIFY, spaceAfter=6))
        return styles

    def _create_doc(self, filepath):
        # Set margins to match the calculated content alignment (approx 0.88 inch)
        margin = (8.27 - 6.5) / 2 * inch
        doc = SimpleDocTemplate(filepath, pagesize=A4, leftMargin=margin, rightMargin=margin, topMargin=50, bottomMargin=50)
        
        # Add Page Template for Header/Footer
        frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='normal', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        template = PageTemplate(id='test', frames=frame, onPage=self._header_footer)
        doc.addPageTemplates([template])
        return doc

    def generate_polis_repot(self, data: PoliceReportDetails, signed_by_pengadu: str = None, signed_by_police: str = None, filename: str = None) -> str:
        if not filename:
            filename = f"PolisRepot_{data.report_no.replace('/', '_')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = self._create_doc(filepath)
        styles = self._get_styles()
        elements = []

        # 1. Header
        # Reduced padding between lines
        style_header_1 = ParagraphStyle(name='Header1', parent=styles['CenterTitle'], spaceAfter=0, leading=16)
        style_header_2 = ParagraphStyle(name='Header2', parent=styles['CenterTitle'], spaceAfter=4)
        
        elements.append(Paragraph("POLIS DIRAJA MALAYSIA", style_header_1))
        elements.append(Paragraph("REPOT POLIS", style_header_2))

        # 2. Meta Block (Split into Left and Right columns)

        # Helper styles
        style_norm = styles['Normal']
        
        # Parsing date/time
        date_str = data.tarikh_repot.strftime("%d/%m/%y")
        time_str = data.tarikh_repot.strftime("%I:%M %p") # 12hr format
        
        # Columns widths (Total 6.5 inch)
        col1_w = 1.2*inch # Label
        col2_w = 0.2*inch # Separator
        col3_w = 2.3*inch # Value
        col4_w = 1.3*inch # Label Right
        col5_w = 0.1*inch # Sep Right
        col6_w = 1.4*inch # Value Right
        
        # Helper for wrapping text in Paragraphs to ensure multi-line alignment
        style_val = ParagraphStyle(name='ValueStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=11)
        
        def p(text):
            if text is None: return "-"
            return Paragraph(str(text), style_val)
        
        # Row 1
        r1 = ["Balai", ":", p(data.balai_polis), "Pegawai Penyiasat", ":", p(data.pegawai_penyiasat_sketch)]
        r2 = ["Daerah", ":", p(data.daerah), "No. Repot Bersangkut", ":", p(data.no_repot_bersangkut)]
        r3 = ["Kontinjen", ":", p(data.kontinjen), "", "", ""]
        r4 = ["No. Repot", ":", p(data.report_no), "", "", ""]
        r5 = ["Tarikh", ":", p(date_str), "", "", ""]
        r6 = ["Waktu", ":", p(time_str), "", "", ""]
        r7 = ["Bahasa Diterima", ":", p(data.bahasa_diterima), "", "", ""]
        
        meta_data = [r1, r2, r3, r4, r5, r6, r7]
        t_meta = Table(meta_data, colWidths=[col1_w, col2_w, col3_w, col4_w, col5_w, col6_w])
        t_meta.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('ALIGN', (0,0), (0,-1), 'LEFT'),
            ('ALIGN', (3,0), (3,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (0,-1), 0), # Align with header line
        ]))
        elements.append(t_meta)
        elements.append(Spacer(1, 0.2*inch))

        # 3. Butir-butir Penerima Repot
        style_bold_small = ParagraphStyle('BoldSmall', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leftIndent=0, firstLineIndent=0)
        elements.append(Paragraph("Butir-butir Penerima Repot :", style_bold_small))
        
        # Nama : ... No. Badan : ... Pangkat : ...
        penerima_data = [
            ["Nama", ":", p(data.penerima_nama), "No. Badan", ":", p(data.penerima_id), "Pangkat", ":", p(data.penerima_pangkat)]
        ]
        t_penerima = Table(penerima_data, colWidths=[0.95*inch, 0.1*inch, 1.3*inch, 0.95*inch, 0.1*inch, 1.15*inch, 0.9*inch, 0.1*inch, 0.95*inch])
        t_penerima.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9), 
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (0,-1), 0),
        ]))
        elements.append(t_penerima)
        elements.append(Spacer(1, 0.15*inch))
        
        # 4. Butir-butir Jurubahasa
        elements.append(Paragraph("Butir-butir Jurubahasa (Jika Ada) :", style_bold_small))
        jurubahasa_data = [
            ["Nama", ":", p(data.jurubahasa_nama or "---"), "No. K/P (Baru)", ":", p(data.jurubahasa_ic or "---"), "No. Polis", ":", p(data.jurubahasa_polis_id or "---")],
            ["No. Pasport", ":", p(data.jurubahasa_pasport or "---"), "Bahasa Asal", ":", p(data.jurubahasa_bahasa_asal or "---"), "", "", ""],
            ["Alamat", ":", p(data.jurubahasa_alamat or "---"), "", "", "", "", "", ""]
        ]
        t_jurubahasa = Table(jurubahasa_data, colWidths=[0.95*inch, 0.1*inch, 1.3*inch, 0.95*inch, 0.1*inch, 1.15*inch, 0.9*inch, 0.1*inch, 0.95*inch])
        t_jurubahasa.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9), 
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (0,-1), 0),
        ]))
        elements.append(t_jurubahasa)
        elements.append(Spacer(1, 0.15*inch))
        
        # 5. Butir-butir Pengadu (The big one)
        elements.append(Paragraph("Butir-butir Pengadu :", style_bold_small))

        col_w_pengadu = [0.95*inch, 0.1*inch, 1.3*inch, 0.95*inch, 0.1*inch, 1.15*inch, 0.9*inch, 0.1*inch, 0.95*inch]
        
        dob = data.pengadu_tarikh_lahir.strftime("%d/%m/%Y") if data.pengadu_tarikh_lahir else "---"
        
        pengadu_grid = [
            ["Nama", ":", p(data.pengadu_nama), "", "", "", "", "", ""], # Row 1
            ["No. K/P (Baru)", ":", p(data.pengadu_ic), "No. Polis", ":", p(data.pengadu_polis_tentera or "---"), "No. Pasport", ":", p(data.pengadu_pasport or "---")],
            ["No. Sijil Beranak", ":", p(data.pengadu_sijil_beranak or "---"), "Jantina", ":", p(data.pengadu_jantina or "---"), "Tarikh Lahir", ":", p(dob)],
            ["Umur", ":", p(data.pengadu_umur or "---"), "Keturunan", ":", p(data.pengadu_keturunan or "---"), "Warganegara", ":", p(data.pengadu_warganegara or "Malaysia")],
            ["Pekerjaan", ":", p(data.pengadu_pekerjaan), "", "", "", "", "", ""],
            ["Alamat Tinggal", ":", p(data.pengadu_alamat), "", "", "", "", "", ""], # Needs wrapping logic if long
            ["Alamat IbuBapa", ":", p(data.pengadu_alamat_ibubapa or "---"), "", "", "", "", "", ""],
            ["Alamat Pejabat", ":", p(data.pengadu_alamat_pejabat or "---"), "", "", "", "", "", ""],
            ["No. Tel (Rumah)", ":", p(data.pengadu_tel_rumah or "---"), "No. Tel (Pejabat)", ":", p(data.pengadu_tel_pejabat or "---"), "No. Tel (Bimbit)", ":", p(data.pengadu_tel)],
            ["Emel", ":", p(data.pengadu_email or "---"), "", "", "", "", "", ""]
        ]
        
        t_pengadu = Table(pengadu_grid, colWidths=col_w_pengadu)
        t_pengadu.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (0,-1), 0),
            ('SPAN', (2,5), (-1,5)), # Alamat Tinggal span across
            ('SPAN', (2,6), (-1,6)), # IbuBapa
            ('SPAN', (2,7), (-1,7)), # Pejabat
            ('SPAN', (2,4), (-1,4)), # Pekerjaan
            ('SPAN', (2,0), (-1,0)), # Nama
            ('SPAN', (2,9), (-1,9)), # Emel
        ]))
        elements.append(t_pengadu)
        elements.append(Spacer(1, 0.1*inch))
        
        # 6. Pengadu Menyatakan
        elements.append(Paragraph("Pengadu Menyatakan :", style_bold_small))
        elements.append(Spacer(1, 0.05*inch))
        # Upper case body text
        elements.append(Paragraph(data.keterangan_kes.upper(), ParagraphStyle('BodyUpper', parent=styles['Normal'], fontSize=9, leading=10)))
        elements.append(Spacer(1, 1*inch))
        
        # 7. Signatures
        # 6.5 inch total width
        
        # Signature styling
        # If signed, we replace the line with the name in Bold/Italic
        
        sig_pengadu_display = "_"*25
        if signed_by_pengadu:
            sig_pengadu_display = f"{signed_by_pengadu.upper()}<br/>(digital signature)"
            
        sig_police_display = "_"*25
        if signed_by_police:
             sig_police_display = f"{signed_by_police.upper()}<br/>(digital signature)"
        
        sig_data = [
            ["Tandatangan Pengadu:", "Tandatangan Jurubahasa\n(Jika ada):", "Tandatangan Penerima Repot:"],
            [Spacer(1, 0.4*inch), "", ""],
            [Paragraph(sig_pengadu_display, style_val), "_"*25, Paragraph(sig_police_display, style_val)]
        ]
        t_sig = Table(sig_data, colWidths=[2.16*inch, 2.16*inch, 2.16*inch]) # Equal split ~2.16 inch
        t_sig.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 9), 
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('LEFTPADDING', (0,0), (0,-1), 0),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(t_sig)
        elements.append(Spacer(1, 0.3*inch))

        doc.build(elements)
        return filepath

    def generate_rajah_kasar(self, data: PoliceReportDetails, sketch_data: any = None, filename: str = None) -> str:
        """
        sketch_data: Can be a file path (str) OR a file-like object (BytesIO)
        """
        if not filename:
            filename = f"RajahKasar_{data.report_no.replace('/', '_')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = self._create_doc(filepath)
        styles = self._get_styles()
        elements = []

        # 1. Aligned Metadata Block
        lbl_w = 1.8 * inch
        sep_w = 0.2 * inch
        val_w = 4.5 * inch
        
        # Format date properly
        fmt_date = data.tarikh_kejadian.strftime("%d/%m/%y %I:%M %p")
        
        meta_data = [
            ["NO REPOT POLIS", ":", data.report_no],
            ["NO KERTAS SIASATAN", ":", data.no_kertas_siasatan or "-"],
            ["PEGAWAI PENYIASAT", ":", data.pegawai_penyiasat_sketch],
            ["TARIKH KEJADIAN", ":", fmt_date],
            ["DICETAK OLEH", ":", data.dicetak_oleh or "-"]
        ]
        
        t_meta = Table(meta_data, colWidths=[lbl_w, sep_w, val_w])
        t_meta.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('ALIGN', (0,0), (0,-1), 'LEFT'),  # Label Left
            ('ALIGN', (1,0), (1,-1), 'CENTER'), # Colon Center
            ('ALIGN', (2,0), (2,-1), 'LEFT'),   # Value Left
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(t_meta)
        elements.append(Spacer(1, 0.3*inch))

        # 2. Title
        elements.append(Paragraph("RAJAH KASAR (TIDAK MENGIKUT SKALA)", styles['CenterTitle']))
        
        # 3. Sketch Box
        
        # Inner content of the box
        box_content = []
        
        # Check if sketch_data is valid
        has_sketch = False
        if sketch_data:
             if isinstance(sketch_data, str) and os.path.exists(sketch_data):
                  has_sketch = True
             elif hasattr(sketch_data, 'read'): # File-like object (BytesIO)
                  has_sketch = True
        
        if has_sketch:
             # reportlab Image supports file-like objects directly
             box_content.append(Image(sketch_data, width=5.5*inch, height=4*inch, kind='proportional'))
        else:
             # Placeholder space
             box_content.append(Spacer(1, 4*inch))
        
        box_content.append(Spacer(1, 0.5*inch))
        
        final_box_data = [
             [box_content[0] if len(box_content) > 0 else Spacer(1, 4*inch)], # Image or Space
        ]
        
        t_box = Table(final_box_data, colWidths=[6.5*inch])
        t_box.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black), # The main border
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (0,0), 'MIDDLE'), # Image Center
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        
        elements.append(t_box)

        doc.build(elements)
        return filepath

    def generate_keputusan(self, data: PoliceReportDetails, filename: str = None) -> str:
        if not filename:
            filename = f"Keputusan_{data.report_no.replace('/', '_')}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        doc = self._create_doc(filepath)
        styles = self._get_styles()
        elements = []

        # Styles for the Letter
        style_right = ParagraphStyle(name='RightAlign', parent=styles['Normal'], alignment=TA_LEFT, leftIndent=3.5*inch)
        style_bold = ParagraphStyle(name='Bold', parent=styles['Normal'], fontName='Helvetica-Bold')

        # 1. Top Right Info (Rujukan Kami, Tarikh)
        # Malaysia Time
        from datetime import timedelta
        now_my = datetime.utcnow() + timedelta(hours=8)
        fmt_now = now_my.strftime("%d/%m/%y %I:%M %p")
        rujukan = f"Rujukan Kami: {data.no_kertas_siasatan or data.report_no}"
        
        elements.append(Paragraph(rujukan, style_right))
        elements.append(Paragraph(f"Tarikh: {fmt_now}", style_right))
        elements.append(Spacer(1, 0.4*inch))

        # 2. Recipient Info
        penerima_nama = data.penerima_surat_nama or data.pengadu_nama or "PENERIMA"
        penerima_ic = data.penerima_surat_ic or data.pengadu_ic or "-"
        penerima_addr = data.penerima_surat_alamat or data.pengadu_alamat or "-"
        penerima_veh = data.penerima_surat_kenderaan_no or "Unknown"
        penerima_veh_type = data.penerima_surat_kenderaan_jenis or "KENDERAAN"
        
        # Recipient Block
        # Name (IC) - Added space before (NO KP)
        # Address
        # Vehicle Info
        elements.append(Paragraph(f"{penerima_nama} (NO KP: {penerima_ic})", styles['Normal']))
        # Multiline address handling
        for line in penerima_addr.split(','):
             elements.append(Paragraph(line.strip(), styles['Normal']))
        elements.append(Paragraph(f"{penerima_veh_type.upper()} {penerima_veh}", styles['Normal']))
        elements.append(Spacer(1, 0.4*inch))

        # 3. Title - Bold, Underline, No Italic
        style_title_kv = ParagraphStyle(name='KeputusanTitle', parent=styles['Heading3'], fontName='Helvetica-Bold', leftIndent=0)
        elements.append(Paragraph("<u>KEPUTUSAN PENYIASATAN KES</u>", style_title_kv))
        
        # 4. Details List (Table with very small left col for alignment if needed, or just colon alignment)

        # Helper for key-value rows
        lbl_w = 2.2*inch
        sep_w = 0.2*inch
        val_w = 4.0*inch
        
        details_list = [
            ["No. Repot Polis", ":", data.report_no],
            ["Tarikh & Masa Repot Polis", ":", data.tarikh_repot.strftime("%d/%m/%y %I:%M %p")],
            ["Kesalahan", ":", data.seksyen_kesalahan or "-"],
            ["Tempat Kejadian", ":", data.tempat_kejadian],
            ["Tarikh & Masa Kejadian", ":", data.tarikh_kejadian.strftime("%d/%m/%y %I:%M %p")],
            ["Tarikh & Masa Surat Dijana", ":", fmt_now]
        ]
        
        # Ensure hAlign='LEFT' so table starts at frame edge
        t_details = Table(details_list, colWidths=[lbl_w, sep_w, val_w], hAlign='LEFT')
        t_details.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (0,0), (0,-1), 'LEFT'),
            ('ALIGN', (1,0), (1,-1), 'CENTER'),
            ('ALIGN', (2,0), (2,-1), 'LEFT'),
            # Remove left padding for first column so text aligns with the Title above (which is at left frame edge)
            ('LEFTPADDING', (0,0), (0,-1), 0),
        ]))
        elements.append(t_details)
        elements.append(Spacer(1, 0.2*inch))
        
        # 5. Body Paragraphs
        elements.append(Paragraph("Dengan hormatnya saya merujuk kepada pengaduan yang dibuat sepertimana dinyatakan di atas", styles['JustifyText']))
        elements.append(Spacer(1, 0.1*inch))
        
        # Paragraph 2
        
        # If no saman data, fallback to generic
        pihak_salah = data.pihak_salah_nama or "pihak berkenaan"
        saman_no = data.saman_no or "Unknown"
        saman_amt = data.saman_amount or "RM-"
        
        para_2 = f"2. Untuk makluman, pihak yang bertanggungjawab melakukan kesalahan di atas telah disaman oleh polis pada {fmt_now.split(' ')[0]} dengan no saman: {saman_no} sebanyak {saman_amt}."
        elements.append(Paragraph(para_2, styles['JustifyText']))
        elements.append(Spacer(1, 0.1*inch))
        
        # Paragraph 3
        elements.append(Paragraph("3. Butir-butir pihak yang disalahkan adalah seperti berikut:", styles['Normal']))
        elements.append(Spacer(1, 0.1*inch))
        
        # Offender Details Table aligned
        # JENIS KENDERAAN : ...
        # NAMA PEMANDU : ...
        # ALAMAT PEMANDU : ...
        
        offender_data = [
            ["JENIS KENDERAAN", ":", f"{data.pihak_salah_jenis_kenderaan or ''} {data.pihak_salah_no_kenderaan or ''}"],
            ["NAMA PEMANDU", ":", f"{data.pihak_salah_nama or '-'} (NO KP: {data.pihak_salah_ic or '-'})"],
            # Address needs specific handling if multiline? Table cell auto wraps.
            ["ALAMAT PEMANDU", ":", data.pihak_salah_alamat or "-"]
        ]
        
        t_offender = Table(offender_data, colWidths=[lbl_w, sep_w, val_w])
        t_offender.setStyle(TableStyle([
             ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
             ('VALIGN', (0,0), (-1,-1), 'TOP'),
             ('ALIGN', (0,0), (0,-1), 'LEFT'),
             ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ]))
        elements.append(t_offender)
        elements.append(Spacer(1, 0.4*inch))
        
        # Safety Slogan
        elements.append(Paragraph('"BERHATI-HATI DI JALAN RAYA"', style_bold))
        elements.append(Spacer(1, 0.4*inch))
        
        # Signoff Block
        # Name
        # Rank
        # Station
        
        elements.append(Paragraph(data.pegawai_penyiasat_nama.upper(), styles['Normal']))
        elements.append(Paragraph(data.pegawai_penyiasat_pangkat.upper(), styles['Normal']))
        elements.append(Paragraph(f"IBU PEJABAT POLIS {data.daerah.upper()}", styles['Normal']))
        
        elements.append(Spacer(1, 0.4*inch))
        
        # S.K. section (footer-ish but distinct)
        sk_text = f"S.K. NO KST: {data.no_kertas_siasatan or data.report_no}<br/>(Notis ini hanya sebagai makluman anda sahaja)"
        elements.append(Paragraph(sk_text, styles['Normal']))

        doc.build(elements)
        return filepath
