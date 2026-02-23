# QA Matrix — Quality Assurance Control & Monitoring System

An automotive quality assurance application for tracking defects, managing quality control scores, and monitoring plant/MFG/workstation status across Trim, Chassis, and Final assembly areas.

---

## Table of Contents

1. [Overview](#overview)
2. [Pages & Navigation](#pages--navigation)
3. [QA Matrix Tab](#qa-matrix-tab)
4. [Repeats Tab](#repeats-tab)
5. [Defect Data Page](#defect-data-page)
6. [Data Schema](#data-schema)
7. [Status Calculation Logic](#status-calculation-logic)
8. [Import & Export](#import--export)
9. [AI Defect Matching](#ai-defect-matching)
10. [Database](#database)
11. [Tech Stack](#tech-stack)

---

## Overview

The QA Matrix system helps automotive quality teams:

- **Track quality concerns** across Trim, Chassis, and Final assembly lines
- **Monitor defect recurrence** with weekly tracking (W-6 to W-1)
- **Score quality controls** across 50+ control points (T10–T100, C10–C80, F10–F100, etc.)
- **Auto-calculate statuses** (OK/NG) for Workstation, MFG, and Plant levels
- **Match defects to concerns** using AI-powered semantic matching
- **Upload & manage defect data** from DVX, SCA, and YARD sources

---

## Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| **QA Matrix** | `/` | Main page with QA Matrix table and Repeats tab |
| **Defect Data** | `/defect-upload` | Upload and manage raw defect data (DVX, SCA, YARD) |

The main page has two tabs:
- **QA Matrix** — View/edit the full quality matrix table with dashboard
- **Repeats** — Match defect data against QA concerns and apply recurrence updates

---

## QA Matrix Tab

### Dashboard
Two dashboard views are available:
- **Summary View** — Overview cards showing total concerns, OK counts by Workstation/MFG/Plant, breakdowns by area (Trim/Chassis/Final) and source (DVX/ER3/ER4/Field/SCA). Click any card to filter the table.
- **Matrix Dashboard** — Visual matrix view of defect ratings vs. status levels.

### QA Matrix Table

The table displays all QA concerns with 80+ columns organized into sections:

| Section | Columns | Description |
|---------|---------|-------------|
| **Basic Info** | S.No, Source, Station, Area, Concern | Identity fields |
| **Defect Codes** | Defect Code, Location Code | Defect classification codes |
| **Defect Rating** | DR (1/3/5) | Severity: 1=Low, 3=Medium, 5=High |
| **Recurrence** | W-6 to W-1 | Weekly defect counts (last 6 weeks) |
| **RC+DR** | Recurrence + Defect Rating | Auto-calculated sum |
| **Trim Scores** | T10–T100, TPQG | 11 trim quality control checkpoints |
| **Chassis Scores** | C10–C80, P10–P30, RSub, TS, CPQG | 15 chassis quality control checkpoints |
| **Final Scores** | F10–F100, FPQG | 11 final assembly checkpoints |
| **Residual Torque** | Res. Torque | Torque verification score |
| **Quality Control** | 1.1–5.3 | 11 control method ratings (see below) |
| **Q' Control Detail** | CVT, SHOWER, Dynamic/UB, CC4 | 4 detailed control scores |
| **Control Rating** | MFG, Quality, Plant | Auto-calculated aggregate ratings |
| **Guaranteed Quality** | Workstation, MFG, Plant | Status indicators (OK/NG) |

### Quality Control Methods (1.1–5.3)

| Code | Name | Description |
|------|------|-------------|
| 1.1 | Frequency Control | Periodic frequency-based checking |
| 1.2 | Visual Control | Visual inspection |
| 1.3 | Periodic Audit | Periodic audit / process monitoring |
| 1.4 | Human Control | 100% human control without tracking |
| 3.1 | SAE Alert | SAE (Error Proofing) alert system |
| 3.2 | Frequency Measure | Frequency control with measurements |
| 3.3 | Manual Tool | 100% manual control with tool |
| 3.4 | Human Tracking | 100% human control with tracking |
| 5.1 | Auto Control | 100% automatic control |
| 5.2 | Impossibility | Impossibility of assembly or subsequent machining |
| 5.3 | SAE Prohibition | SAE (Error Proofing) prohibition |

### Inline Editing

- **Weekly recurrence** — Click any W-1 to W-6 cell to edit counts directly
- **Scores** — Click any score cell (Trim/Chassis/Final/QControl) to enter values
- **Defect Rating** — Dropdown selector (1/3/5)
- **Row edit mode** — Click pencil icon to edit Source, Station, Designation, Concern, Action, Resp, Target
- **Delete** — Click trash icon to remove a concern

### Filtering

- **Search** — Filter by concern text, station, or S.No
- **Source filter** — DVX, ER3, ER4, Field, SCA
- **Designation filter** — Trim, Chassis, Final
- **Rating filter** — 1, 3, or 5
- **Status filter** — OK (all OK) or NG (any NG)
- **Dashboard click** — Click dashboard cards to auto-filter

---

## Repeats Tab

The Repeats tab is the core workflow for updating the QA Matrix with new defect data.

### Workflow

1. **Start Pairing** — Fetches all defect data from the database (final_defect table) and triggers AI matching
2. **AI Matching** — The system sends defects to an AI agent that semantically matches each defect to the most relevant QA concern
3. **Review Matches** — View matched pairs and unmatched defects
4. **Manual Adjustments**:
   - **Unpair** — Remove a defect from a matched concern
   - **Reassign** — Move a defect to a different concern
   - **Manual Pair** — Pair an unmatched defect to an existing concern
   - **Add New Concern** — Create a new QA concern from an unmatched defect
5. **Apply to Matrix** — Updates W-1 (Last Week) recurrence counts for all matched concerns
6. **View Changes** — See a diff of what changed (recurrence counts, status changes)
7. **Undo** — Revert all applied changes

### Alternative Upload Methods

- **File Upload** — Upload a DVX/Repeat Issues Excel file directly
- **Google Sheets Link** — Fetch data from a public Google Sheets URL

### Unique Defects View

A collapsible section showing all unique defect types grouped by defect code/description, sorted by total quantity. Exportable to Excel.

---

## Defect Data Page

Manage raw defect data organized by source:

### Sources
- **DVX** — DVX inspection defects
- **SCA** — SCA audit defects  
- **YARD** — Yard inspection defects

### Features per Source
- **Upload CSV/Excel** — Parse and preview before uploading
- **Preview & Edit** — Review parsed data, edit cells, delete rows before confirming upload
- **Review** — View all stored data for a source
- **Clear All** — Delete all data for a source

### Delete Data (Password Protected)
- Click the red **Delete Data** button in the header
- Select target: DVX, SCA, YARD, Final Defect Table, or All
- Enter password to confirm deletion
- Data is permanently removed from the database

### Data Flow
When defect data is uploaded, it is stored in two tables:
1. `defect_data` — Raw upload history with timestamps
2. `final_defect` — Consolidated defect records used by the Repeats pairing engine

---

## Data Schema

### QA Matrix Entry

```typescript
{
  sNo: number;              // Serial number (unique ID)
  source: string;            // DVX, ER3, ER4, FIELD, SCA
  operationStation: string;  // Station code
  designation: string;       // TRIM, CHASSIS, or FINAL
  concern: string;           // Defect description
  defectCode: string;        // Defect classification code
  defectLocationCode: string; // Location classification code
  defectRating: 1 | 3 | 5;  // Severity rating
  weeklyRecurrence: number[]; // [W-6, W-5, W-4, W-3, W-2, W-1]
  recurrence: number;        // Sum of weekly recurrence
  recurrenceCountPlusDefect: number; // recurrence + defectRating
  
  // Score sections (each value: number | null)
  trim: { T10..T100, TPQG }       // 11 trim scores
  chassis: { C10..C80, P10..P30, RSub, TS, CPQG } // 15 chassis scores
  final: { F10..F100, FPQG, ResidualTorque }       // 12 final scores
  qControl: { 11 control method scores }
  qControlDetail: { CVT, SHOWER, DynamicUB, CC4 }
  
  // Auto-calculated
  controlRating: { MFG, Quality, Plant }
  guaranteedQuality: { Workstation, MFG, Plant }
  workstationStatus: 'OK' | 'NG'
  mfgStatus: 'OK' | 'NG'
  plantStatus: 'OK' | 'NG'
  
  // Action tracking
  mfgAction: string;
  resp: string;
  target: string;
}
```

---

## Status Calculation Logic

Statuses are **auto-calculated** whenever scores or recurrence values change:

### MFG Rating
```
MFG Rating = Sum of all non-null values in (Trim + Chassis + Final scores)
             (excluding Residual Torque)
```

### Quality Rating
```
Quality Rating = Sum of all non-null Quality Control scores (1.1 to 5.3)
```

### Plant Rating
```
Plant Rating = Sum of (Residual Torque + all QControl scores + all QControl Detail scores)
```

### Status Rules

| Status | Condition |
|--------|-----------|
| **Workstation OK** | No recurrence (all weeks = 0) AND MFG Rating ≥ Defect Rating |
| **Workstation NG** | Any recurrence > 0 OR MFG Rating < Defect Rating |
| **MFG OK** | MFG Rating ≥ Defect Rating |
| **MFG NG** | MFG Rating < Defect Rating |
| **Plant OK** | Plant Rating ≥ Defect Rating |
| **Plant NG** | Plant Rating < Defect Rating |

---

## Import & Export

### QA Matrix Import (Excel/CSV)

Upload a file with the following column order:

| Col | Field |
|-----|-------|
| 1 | S. No |
| 2 | Source |
| 3 | Operation / Station |
| 4 | Designation |
| 5 | Concern Description [Mode of failure] |
| 6 | Defect Code |
| 7 | Location Code |
| 8 | Defect Rating (1/3/5) |
| 9–14 | W-6 to W-1 (Recurrence) |
| 15 | Recurrence Count + Defect Rating |
| 16–26 | T10–T100, TPQG |
| 27–41 | C10–C80, P10–P30, RSub, TS, CPQG |
| 42–52 | F10–F100, FPQG |
| 53 | Residual Torque |
| 54–64 | Quality Control 1.1–5.3 |
| 65–68 | CVT, SHOWER, Dynamic/UB, CC4 |
| 69–71 | Control Rating (MFG, Quality, Plant) |
| 72–74 | Guaranteed Quality (WS, MFG, Plant) |
| 75 | MFG Action |
| 76 | Responsible |
| 77 | Target |

### QA Matrix Export

- **Export Excel** — Downloads `.xlsx` file with all visible (filtered) data
- **Export CSV** — Downloads `.csv` file with all visible (filtered) data

Both exports use the same column format as imports, so exported files can be re-imported.

---

## AI Defect Matching

The system uses an AI model (Google Gemini) to semantically match defects to QA concerns.

### How It Works

1. All QA concerns are sent to the AI with their S.No, concern text, station, and designation
2. All defects are sent with their location, description, details, and gravity
3. The AI analyzes semantic meaning — not just keyword matching — to find the best match
4. Each match includes a confidence score (0–1) and a reason
5. Matches with confidence < 0.3 are treated as unmatched
6. Results are processed in batches of 200 defects for efficiency

### Backend Function

The `match-defects` edge function handles the AI communication:
- Uses the Lovable AI Gateway (`ai.gateway.lovable.dev`)
- Employs function calling for structured output
- Handles rate limiting (429) and credit depletion (402) gracefully

---

## Database

### Tables

| Table | Purpose |
|-------|---------|
| `qa_matrix_entries` | All QA Matrix concerns with scores, statuses, and metadata |
| `defect_data` | Raw uploaded defect data with source and timestamp |
| `final_defect` | Consolidated defect records for AI pairing |

### Auto-Save

All changes to the QA Matrix table are automatically saved to the database. The system:
- Detects changed entries via JSON comparison
- Upserts only modified rows (by `s_no`)
- Supports batch saves for imports and bulk updates

### Edge Functions

| Function | Purpose |
|----------|---------|
| `match-defects` | AI-powered semantic matching of defects to QA concerns |
| `delete-defects` | Password-protected deletion of defect data |
| `fetch-spreadsheet` | Proxy for fetching external spreadsheet URLs |

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Lovable Cloud (PostgreSQL)
- **AI**: Google Gemini via Lovable AI Gateway
- **File Parsing**: SheetJS (xlsx) for Excel/CSV import/export
- **State Management**: React hooks + custom `useQAMatrixDB` hook
- **Charts**: Recharts (dashboard visualizations)
