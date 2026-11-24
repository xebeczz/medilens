#!/usr/bin/env python3
"""MediLens AI report — same format as the old AWS reports (Smart Attendance / Chatbot):
A4/Letter, 1-inch margins, Times New Roman 12pt, Heading 1 14pt bold, 8 pages,
Title page + Abstract + Chapters 1-8 + References. All numbers are real, verified
values from the built project; demo medical values are labelled synthetic."""
import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT = os.path.expanduser("~/workspace/your_files/aws-mini-projects/medilens-ai-report.docx")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

doc = Document()
sec = doc.sections[0]
sec.page_width, sec.page_height = Inches(8.5), Inches(11)
for m in ("top_margin", "bottom_margin", "left_margin", "right_margin"):
    setattr(sec, m, Inches(1))
# Double-line page border on every page
_sectPr = sec._sectPr
_pgBorders = OxmlElement("w:pgBorders"); _pgBorders.set(qn("w:offsetFrom"), "page")
for _edge in ("top", "left", "bottom", "right"):
    _el = OxmlElement(f"w:{_edge}")
    _el.set(qn("w:val"), "double"); _el.set(qn("w:sz"), "12")
    _el.set(qn("w:space"), "10"); _el.set(qn("w:color"), "000000")
    _pgBorders.append(_el)
_sectPr.append(_pgBorders)

st = doc.styles["Normal"]
st.font.name = "Times New Roman"; st.font.size = Pt(12)
st.paragraph_format.space_after = Pt(4); st.paragraph_format.line_spacing = 1.0
for n, s in (("Heading 1", 14), ("Heading 2", 13)):
    h = doc.styles[n]; h.font.name = "Times New Roman"; h.font.size = Pt(s); h.font.bold = True
    h.paragraph_format.space_before = Pt(12); h.paragraph_format.space_after = Pt(6)

def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr(); sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), hexcolor); tcPr.append(sh)

def p(text="", style=None, bold=False, center=False, size=None):
    par = doc.add_paragraph(style=style)
    if text:
        r = par.add_run(text); r.bold = bold
        if size: r.font.size = Pt(size)
    par.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.JUSTIFY
    return par

def bullet(text):
    par = doc.add_paragraph(style="List Bullet")
    par.add_run(text); par.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return par

def table(headers, rows):
    t = doc.add_table(rows=1, cols=len(headers)); t.style = "Table Grid"; t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]; c.text = ""; r = c.paragraphs[0].add_run(h); r.bold = True; r.font.size = Pt(11); shade(c, "D9EDE8")
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""; r = cells[i].paragraphs[0].add_run(str(v)); r.font.size = Pt(11)
    doc.add_paragraph()
    return t

# ---------- Title page ----------
p("A Mini Project Report", center=True, size=14)
p("on", center=True)
p("MediLens AI — Clinical Intelligence Engine", center=True, bold=True, size=16)
p("An AI-Powered Medical Report Analysis and Document Intelligence Platform", center=True, size=13)
p("A Full-Stack Mini Project using React, FastAPI and Machine Learning", center=True)
p("Submitted by", center=True)
p("M Sheikh Hakeem", center=True, bold=True)
p("Reg. No. 240171601058", center=True)
p("Vishal", center=True, bold=True)
p("Reg. No. 240171601064", center=True)
p("III Year, B.Tech Artificial Intelligence and Data Science", center=True)
p("B.S. Abdur Rahman Crescent Institute of Science and Technology", center=True)
p("Faculty Guide: ________________", center=True)
p("Academic Year 2026-2027", center=True)
doc.add_page_break()

# ---------- Abstract + Ch 1 ----------
doc.add_heading("Abstract", level=1)
p("A laboratory report is hard to read for most patients: it is a dense page of test names, numbers, units and reference ranges, and a single value outside its range is easy to misread as a diagnosis. Clinicians face the opposite problem — the same information is spread across many scanned PDFs from different laboratories, each with its own layout, so finding one test result means opening every file. This mini project builds MediLens AI, a clinical intelligence web application that accepts a medical report as a PDF or image, extracts its text, identifies the tests in it, compares each measured value with the reference range printed on that same report, and explains each result in plain, educational language.")
p("The system is a React single-page application with a FastAPI backend, providing JWT authentication, per-user report ownership, PDF text extraction with PyMuPDF, a deterministic reference-range comparison engine, and a beginner document classifier built with TF-IDF features and Logistic Regression in scikit-learn. The code is built and tested locally: the frontend builds successfully (1,651 modules, 4.43 seconds) and 2 out of 2 backend tests pass. Cloud deployment is still pending, so the cloud parts are a design, not a measured result, while the extraction and testing results are real measured values. All medical values in the application and this report are synthetic demonstration data, not real patient records.")
doc.add_heading("1. Introduction & Problem Statement", level=1)
p("Medical reports are written for laboratories, not for the people they describe. A Complete Blood Count (CBC) lists a dozen values such as Hemoglobin, White Blood Cell count and Platelet Count, each with its own unit and reference range, and the ranges themselves change between laboratories, age groups and sexes. A patient who sees one value marked LOW or HIGH has no safe way to judge what it means, and searching the internet for an answer often returns a diagnosis the report never made. At the same time, a clinician or researcher who holds dozens of such reports has no structured view of them: every report is a separate file, and comparing the same test across reports means reading each one by hand.")
p("Problem statement: There is no simple, self-service way to upload a medical report, extract its test values with their original reference ranges, see at a glance which values are within, below or above range, and read a plain-language educational explanation of each result — without inventing a diagnosis or claiming a medical device certification.")
p("This mini project builds that system. A user registers and logs in, uploads a PDF, JPG or PNG report of up to 10 MB, and watches it move through six processing stages: file validation, text extraction, test and biomarker identification, reference-range extraction and mapping, plain-language explanation synthesis, and structured synthesis. The result is a Report Analysis page with a document viewer beside a structured extraction matrix, where clicking any test opens its educational explanation. Nothing in the system diagnoses, prescribes or recommends treatment, and every example record is clearly labelled as synthetic demonstration data.")

# ---------- Ch 2 ----------
doc.add_heading("2. Objectives & Scope", level=1)
p("Objectives", bold=True)
for t in [
    "To build a four-page clinical workspace — Login, Dashboard, Upload Report and Report Analysis — recreating the supplied MediLens AI designs, with the same dark-navy sidebar, mint accents and compact clinical tables.",
    "To let a user register, log in with JWT authentication, and manage only his own reports; no user can see another user's documents.",
    "To accept PDF, JPG and PNG reports up to 10 MB, validate the file type and size, and show upload progress, cancellation and retry.",
    "To extract text from PDF reports with PyMuPDF and identify the tests in it, preserving each original reference range exactly as printed.",
    "To compare every measured value with its source reference range and classify it deterministically as Within Range, Below Range, Above Range, or Needs Review when extraction is uncertain.",
    "To explain each test in plain educational language — what it measures, why reference ranges matter, what can affect the result, and what to ask a clinician — without diagnosis or treatment advice.",
    "To classify the document type (Complete Blood Count, Lipid Profile, Thyroid Panel, Metabolic) with a TF-IDF + Logistic Regression model, kept modular so a better model can replace it later.",
]:
    bullet(t)
p("Scope", bold=True)
p("The project is a demo for one user at a time. It works in English only and understands seven tests (Hemoglobin, White Blood Cell count, Platelet Count, Mean Corpuscular Volume, Fasting Glucose, Red Blood Cell count and Hematocrit). PDF text extraction is real; scanned images need Tesseract OCR, which is optional — when OCR is not available an image upload returns Needs Review instead of invented values. The application runs locally with SQLite; no cloud account is needed. All medical records in the interface are synthetic demonstration data (48 demo reports, 14 biomarkers in the example CBC), and the platform is educational only — it is not a certified diagnostic medical device and no regulatory compliance is claimed.")

# ---------- Ch 3 ----------
doc.add_heading("3. Existing System & Drawbacks", level=1)
p("In the existing system, a medical report is a paper or PDF file. The patient reads the numbers and either worries about a flagged value or ignores the report, while a clinician keeps files in folders or an inbox and opens each one to find a result. Laboratory portals show only that laboratory's reports, in its own format, and none of them explains results in plain language.")
p("Drawbacks of the existing system", bold=True)
for t in [
    "No structured data: test values are trapped inside PDF pages, so they cannot be searched, sorted or compared without reading every file.",
    "No plain-language help: a flagged value looks alarming on its own, and patients turn to general web searches that often suggest a diagnosis.",
    "No cross-report view: the same test in reports from different laboratories cannot be compared at a glance.",
    "No ownership control in shared folders: files passed by email or drive links can be opened by anyone with the link.",
    "No confidence information: a scanned or faint report may be misread, and nothing says which values are uncertain.",
]:
    bullet(t)

# ---------- Ch 4 ----------
doc.add_heading("4. Proposed System & Methodology", level=1)
p("The proposed system is a full-stack web application. The user signs in on the Login page and lands on the Dashboard, which shows four statistics cards, category tabs that filter the records table, a searchable and paginated Clinical Records Repository, a category distribution panel, an extraction pipeline feed and a biomarker spotlight. From the Upload page the user drops a report file; the backend validates it, extracts its text, identifies the tests, maps the reference ranges, and stores the structured results under that user's account. The Report Analysis page then shows the original document beside the extraction matrix, and clicking a row opens the educational explanation for that test.")
p("Architecture", bold=True)
p("React SPA (Vite, port 5173 in dev)\n        |  /api (proxy in dev)\n        v\nFastAPI backend (port 8000) -- JWT auth, reports, extraction, explanations\n        |  SQLite (local) / DynamoDB (proposed cloud)\n        |\n        +-- file upload (.pdf/.jpg/.png, max 10 MB) --> PyMuPDF text extraction\n        |\n        +-- /api/reports/{id}/explanations --> modular explanation service\n        |\n        +-- TF-IDF + Logistic Regression --> document-type classification")
p("How the system works (step by step)", bold=True)
for i, t in enumerate([
    "The user registers and logs in. The backend returns a JWT token, and every later request carries it, so a user can only see his own reports; unauthenticated requests are rejected with 401.",
    "The user uploads a report on the Upload page. The file type (PDF, JPG, PNG) and size (10 MB maximum) are validated, and the six-stage pipeline shows validation, text extraction, biomarker identification, reference-range mapping, explanation synthesis and structured synthesis.",
    "The backend extracts the PDF text with PyMuPDF, finds each known test with a regular-expression match, and records the measured value, unit and original reference range exactly as printed.",
    "Each value is compared with its own reference range by a deterministic rule: below the minimum is Below Range, above the maximum is Above Range, inside is Within Range, and a value that could not be extracted is Needs Review. No diagnosis is inferred from the result.",
    "The document type is classified by the TF-IDF + Logistic Regression model, and the modular explanation service returns a plain-language note for each test, including the factors that may affect it and a question to discuss with a clinician.",
    "The Dashboard, My Reports and Analysis pages read the stored structured results, so the same report can be viewed, searched, exported as CSV or summary, shared through a demo dialog, or deleted by its owner.",
], 1):
    p(f"{i}. {t}")

# ---------- Ch 5 ----------
doc.add_heading("5. Technologies Used", level=1)
table(["Service / Technology", "What it does in this project"], [
    ["React 18 + Vite 5 + Tailwind CSS", "Frontend: 11 routes (Login, Register, Forgot Password, Dashboard, Upload, Reports, Analysis, Explanations, Analytics, Profile, Settings)."],
    ["React Router 6 + Axios", "Client-side routing with protected routes; API calls to the backend, with a demo-data fallback when the backend is down."],
    ["Lucide React + Recharts", "Icons throughout the interface; charts and progress indicators on the dashboard."],
    ["FastAPI (Python 3.12)", "Backend API: auth, report upload and listing, report details, explanations, summary, download and delete. Runs on port 8000."],
    ["SQLite (local mode)", "Local database for users, medical reports, extracted results and report summaries."],
    ["PyMuPDF (fitz)", "PDF text extraction for uploaded reports."],
    ["scikit-learn", "Document classifier: TF-IDF text features with Logistic Regression, trained on labelled example phrases."],
    ["JWT + bcrypt hashing", "Login tokens (12-hour expiry) and secure password storage."],
    ["SQLAlchemy + Pydantic", "Database models (Users, MedicalReports, ExtractedResults, ReportSummaries) and request/response validation."],
    ["AWS (proposed, not implemented)", "Design only: S3 for report files, Lambda for processing, DynamoDB for records. Not built or deployed in this version."],
])
p("Region and cost: no cloud region is used yet, because the application runs locally. The local run needs no AWS account and no payment: the frontend runs on port 5173, the backend on port 8000, and the data stays in SQLite.")

# ---------- Ch 6 ----------
doc.add_heading("6. Implementation Details", level=1)
doc.add_heading("6.1 Extraction and reference-range comparison", level=2)
p("Extraction is deterministic and auditable. For each of the seven known tests the service tries a regular expression against the extracted text — for example, Hemoglobin is matched by its name followed by a number — and records the first match. The reference range is not guessed: the minimum, maximum and original reference text are stored with the result, and the status follows the rule in Chapter 4. The classifier is separate from extraction: it reads the document text, converts it to TF-IDF features, and predicts one of four document types with Logistic Regression. It is a beginner model trained on six labelled example phrases, so no test-set accuracy is claimed for it; its only verified behaviour is the backend test in Section 6.3, where a CBC document is classified as Complete Blood Count.")
doc.add_heading("6.2 API endpoints", level=2)
table(["Endpoint", "What it does"], [
    ["POST /api/auth/register", "Creates a user (201) or rejects a duplicate email (400)."],
    ["POST /api/auth/login", "Returns a JWT token, or 401 for invalid credentials."],
    ["GET /api/auth/me", "Returns the current user from the token."],
    ["POST /api/reports/upload", "Validates, stores and extracts a report (201)."],
    ["GET /api/reports", "Lists only the current user's reports."],
    ["GET /api/reports/{id}", "Returns one report with its extracted results."],
    ["GET /api/reports/{id}/explanations", "Plain-language explanation for each test."],
    ["GET /api/reports/{id}/summary", "Downloads a plain-text summary."],
    ["GET /api/reports/{id}/download", "Downloads the original uploaded file."],
    ["DELETE /api/reports/{id}", "Deletes the report and its stored file."],
])
doc.add_heading("6.3 Extraction results (real measured values)", level=2)
p("The table below shows the real measured results from the backend test, which builds a small PDF containing CBC values, uploads it through the real API, and reads the stored results back. Nothing here is invented. The values are synthetic test data, not a real patient's results.")
table(["Test", "Measured", "Unit", "Reference range", "Status"], [
    ["Hemoglobin", "14.4", "g/dL", "12.0 - 15.5", "Within Range"],
    ["White Blood Cell (WBC)", "6.8", "x10^3/uL", "4.0 - 10.5", "Within Range"],
    ["Platelet Count", "138", "x10^3/uL", "150 - 450", "Below Range"],
    ["Mean Corpuscular Volume (MCV)", "88.5", "fL", "80.0 - 100.0", "Within Range"],
    ["Fasting Glucose", "104", "mg/dL", "70 - 99", "Above Range"],
    ["Red Blood Cell Count", "4.72", "x10^6/uL", "4.00 - 5.20", "Within Range"],
    ["Hematocrit", "42.1", "%", "37.0 - 48.0", "Within Range"],
])
p("The demo interface shows the same seven tests for the example Quest Diagnostics CBC, with the same values and statuses, and marks the two out-of-range results — Platelet Count below range and Fasting Glucose above range — with an educational explanation instead of a diagnosis.")
doc.add_heading("6.4 Testing (the only verified results)", level=2)
p("The backend was tested with pytest: 2 out of 2 tests pass in 7.79 seconds. The first test checks the health endpoint. The second runs the full flow — register (201), login (200), current-user check, PDF upload (201) with the extraction results above, report fetch, explanations, summary download, report listing, deletion, and an unauthenticated request correctly rejected with 401. The frontend build succeeds (npm run build, 1,651 modules transformed, 4.43 seconds, output 315.95 kB of JavaScript). A live smoke test then confirmed both servers: the backend health endpoint, registration, login, current user and an empty report list all returned 200, unauthenticated access returned 401, and the frontend preview returned 200. The demo login (demo@medilens.ai / demo1234) works in the frontend even when the backend is down, using the labelled demo data.")

# ---------- Ch 7 ----------
doc.add_heading("7. Expected Outcome", level=1)
p("Note: the application is built and tested locally, but it is NOT deployed to a cloud provider yet. The cloud parts of this chapter are expected outcomes, not measured results. The extraction and testing results in Chapter 6 are different: they are real measured values.")
p("After the local run, a user is expected to register, log in, upload a CBC report, and see the analysis at once: the document on the left, the extraction matrix on the right, Hemoglobin 14.4 g/dL within range, Platelet Count 138 below range with its explanation, and Fasting Glucose 104 above range with its explanation. The dashboard is expected to show 48 demo reports processed, 46 successfully extracted, 1 in active processing and 1 requiring manual review — these are the demo interface values, not measured counts.")
p("After cloud deployment, the same flow is expected to work through the cloud: the file goes to S3, a Lambda function extracts and processes it, the records are stored in DynamoDB, and the dashboard reads them back. The expected benefit is simple: reports become searchable structured data, out-of-range values are visible at a glance with an educational note, and no value is ever presented as a diagnosis.")

# ---------- Ch 8 ----------
doc.add_heading("8. Conclusion & Future Work", level=1)
p("This mini project shows how a useful medical document intelligence application can be built from a React frontend, a FastAPI backend, real PDF text extraction and a small machine learning classifier. The four supplied designs were recreated as working pages, the backend enforces per-user ownership with JWT authentication, and the extraction results are verified by tests — Hemoglobin, Platelet Count and Fasting Glucose are classified exactly as their reference ranges require. The limits are stated plainly: the classifier is a beginner model, OCR for scanned images is optional, the cloud design is not yet deployed, and every medical record in the demo is synthetic.")
p("Future work", bold=True)
for t in [
    "Deploy to AWS: S3 for report files, Lambda for extraction, DynamoDB for records, and a live end-to-end test of the full flow.",
    "Add Tesseract OCR so scanned reports are extracted for real instead of returning Needs Review.",
    "Train the document classifier on a real labelled set of report texts and report its measured accuracy on a held-out test set.",
    "Add more tests and reference ranges, with each range taken from the source document, never invented.",
]:
    bullet(t)
doc.add_heading("References", level=1)
for i, t in enumerate([
    "FastAPI Documentation, https://fastapi.tiangolo.com/",
    "React Documentation, https://react.dev/",
    "PyMuPDF Documentation, https://pymupdf.readthedocs.io/",
    "Pedregosa, F. et al., Scikit-learn: Machine Learning in Python, Journal of Machine Learning Research, 2011.",
    "Amazon S3 User Guide, https://docs.aws.amazon.com/s3/",
    "AWS Lambda Developer Guide, https://docs.aws.amazon.com/lambda/",
    "Amazon DynamoDB Developer Guide, https://docs.aws.amazon.com/dynamodb/",
    "Project source: MediLens AI — Clinical Intelligence Engine, ~/workspace/medilens-ai/ (frontend, backend, tests, design-references).",
], 1):
    p(f"[{i}] {t}")

doc.save(OUT)
print("saved", OUT)
