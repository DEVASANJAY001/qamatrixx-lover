import { Link } from "react-router-dom";
import { Shield, Database, Brain, FileSpreadsheet, BarChart3, Upload, ArrowRight, Repeat, CheckCircle2, Server, Layout, Cpu, Layers, Code2, Terminal, GitBranch, Zap, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";

const phases = [
  {
    phase: "Phase 1",
    title: "Data Collection",
    color: "bg-red-100 dark:bg-red-900/30",
    accent: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
    icon: Upload,
    steps: [
      "Upload QA Matrix via Excel (.xlsx)",
      "Import defect reports (DVX/SCA/YARD)",
      "Capture defect codes & location codes",
      "Parse and validate raw data",
    ],
  },
  {
    phase: "Phase 2",
    title: "Processing & Matching",
    color: "bg-purple-100 dark:bg-purple-900/30",
    accent: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
    icon: Brain,
    steps: [
      "AI semantic analysis (Google Gemini)",
      "Defect-to-concern pairing",
      "Confidence scoring (threshold ≥ 0.3)",
      "Manual review & reassignment",
    ],
  },
  {
    phase: "Phase 3",
    title: "Analysis & Calculation",
    color: "bg-green-100 dark:bg-green-900/30",
    accent: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800",
    icon: BarChart3,
    steps: [
      "Recurrence aggregation per concern",
      "MFG / Quality / Plant rating calculation",
      "Workstation OK/NG status determination",
      "Weekly trend tracking (W-1 to W-6)",
    ],
  },
  {
    phase: "Phase 4",
    title: "Export & Archive",
    color: "bg-blue-100 dark:bg-blue-900/30",
    accent: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: FileSpreadsheet,
    steps: [
      "Export to Excel / CSV",
      "Dashboard visualization",
      "Status monitoring (OK/NG)",
      "Historical data retention",
    ],
  },
];

const techStack = [
  { name: "React 18", desc: "Component-based UI framework", icon: Layout, category: "Frontend" },
  { name: "TypeScript", desc: "Type-safe development", icon: Cpu, category: "Frontend" },
  { name: "Tailwind CSS", desc: "Utility-first styling", icon: Layers, category: "Frontend" },
  { name: "Recharts", desc: "Dashboard visualizations", icon: BarChart3, category: "Frontend" },
  { name: "PostgreSQL", desc: "Relational database", icon: Database, category: "Backend" },
  { name: "Edge Functions", desc: "Serverless backend logic", icon: Server, category: "Backend" },
  { name: "Google Gemini", desc: "AI semantic matching", icon: Brain, category: "AI/NLP" },
  { name: "XLSX Parser", desc: "Excel import/export", icon: FileSpreadsheet, category: "Data" },
  { name: "Python / Pandas", desc: "Offline data processing", icon: Terminal, category: "Scripts" },
];

const workflowSteps = [
  {
    title: "1. QA Matrix Setup",
    description: "Upload your quality concern matrix via Excel. Each row represents a concern with fields like S.No, Concern Description, Operation Station, Designation, Defect Code, Location Code, and Defect Rating (1/3/5).",
  },
  {
    title: "2. Defect Data Ingestion",
    description: "Import defect reports from DVX, SCA, or YARD sources. The system parses location details, defect descriptions, gravity levels, and quantities from the uploaded files.",
  },
  {
    title: "3. AI-Powered Matching",
    description: "The Repeats tab uses Google Gemini AI to semantically match incoming defects to existing QA concerns. It analyzes defect descriptions, locations, and component types — not just keywords.",
  },
  {
    title: "4. Manual Review & Pairing",
    description: "Review AI matches, unpair incorrect assignments, reassign defects to better-fitting concerns, or create new concerns for unmatched defects. Each match shows a confidence score.",
  },
  {
    title: "5. Apply to Matrix",
    description: "Apply matched repeats to the QA Matrix. The W-1 (last week) recurrence count updates, and all dependent statuses (Workstation, MFG, Plant) auto-recalculate.",
  },
  {
    title: "6. Status Calculation",
    description: "Automatic rating logic: MFG Rating = sum(Trim + Chassis + Final). Workstation = NG if recurrence exists. Plant = NG if Plant Rating < Defect Rating.",
  },
  {
    title: "7. Dashboard & Export",
    description: "View summary dashboards with NG/OK breakdowns, designation distribution, and rating analytics. Export the full matrix as Excel or CSV at any time.",
  },
];

const pythonScripts = [
  {
    file: "defect_processor.py",
    title: "Defect Data Processing & Validation",
    desc: "Ingests raw Excel/CSV defect files, auto-detects headers, normalizes columns, validates data quality, and deduplicates entries.",
    cmd: "python defect_processor.py -i defects.xlsx -s DVX -o cleaned.csv --dedup",
    functions: ["load_defect_file()", "preprocess_defects()", "validate_defects()", "separate_by_source()", "deduplicate_defects()"],
  },
  {
    file: "recurrence_aggregator.py",
    title: "Recurrence Aggregation (W-6 to W-1)",
    desc: "Manages the 6-week rolling recurrence window. Shifts weekly buckets, aggregates defect counts into W-1, and calculates total recurrence.",
    cmd: "python recurrence_aggregator.py -m qa_matrix.csv -d matches.csv -o updated.csv",
    functions: ["shift_weekly_window()", "aggregate_defect_counts()", "calculate_total_recurrence()", "weekly_trend_analysis()"],
  },
  {
    file: "severity_scorer.py",
    title: "Severity & Controllability Scoring (1-3-5)",
    desc: "Implements the 1-3-5 defect rating scale and calculates controllability across Trim (T10-T100), Chassis (C10-C80), and Final (F10-F100) areas.",
    cmd: "python severity_scorer.py -m qa_matrix.csv -o scored_matrix.csv",
    functions: ["calculate_mfg_rating()", "calculate_quality_rating()", "calculate_plant_rating()", "calculate_controllability()"],
  },
  {
    file: "rating_calculator.py",
    title: "MFG / Plant Rating Calculator",
    desc: "Computes MFG, Quality, and Plant ratings from JSONB score data. Mirrors the TypeScript recalculateStatuses() function exactly.",
    cmd: "python rating_calculator.py -m qa_matrix.csv -o rated.csv --report",
    functions: ["recalculate_entry()", "batch_recalculate()", "generate_rating_report()"],
  },
  {
    file: "status_automator.py",
    title: "OK/NG Status Automation",
    desc: "Vectorized status computation using NumPy. Detects status transitions, generates diff reports, and applies repeat updates to the matrix.",
    cmd: "python status_automator.py -m qa_matrix.csv -o final.csv --summary",
    functions: ["compute_statuses_vectorized()", "detect_status_changes()", "apply_repeat_updates()", "generate_ng_summary()"],
  },
  {
    file: "ai_defect_matcher.py",
    title: "AI-Assisted Defect Matching",
    desc: "Semantic matching using fuzzy NLP (Jaccard, Dice, synonym expansion) and Google Gemini AI. Supports batch processing with fallback.",
    cmd: "python ai_defect_matcher.py -d defects.csv -m matrix.csv --mode ai --api-key KEY",
    functions: ["fuzzy_match_single()", "batch_fuzzy_match()", "ai_match_batch()", "aggregate_matches()"],
  },
];

// Workflow diagram nodes
const diagramNodes = [
  { id: "upload", label: "Excel / CSV Upload", x: 0, y: 0, color: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700" },
  { id: "parse", label: "Header Detection & Parsing", x: 1, y: 0, color: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700" },
  { id: "validate", label: "Validation & Cleaning", x: 2, y: 0, color: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700" },
  { id: "separate", label: "Source Separation", x: 0, y: 1, color: "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700" },
  { id: "tokenize", label: "Tokenization & Synonym Expansion", x: 1, y: 1, color: "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700" },
  { id: "ai_match", label: "AI Semantic Matching (Gemini)", x: 2, y: 1, color: "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700" },
  { id: "confidence", label: "Confidence Filter (≥ 0.3)", x: 0, y: 2, color: "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700" },
  { id: "aggregate", label: "Recurrence Aggregation", x: 1, y: 2, color: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700" },
  { id: "scoring", label: "MFG / Quality / Plant Scoring", x: 2, y: 2, color: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700" },
  { id: "status", label: "OK / NG Status Automation", x: 0, y: 3, color: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700" },
  { id: "dashboard", label: "Dashboard & Analytics", x: 1, y: 3, color: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700" },
  { id: "export", label: "Excel / CSV Export", x: 2, y: 3, color: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700" },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">How It Works</h1>
            <p className="text-[11px] text-muted-foreground">QA Matrix — System Documentation</p>
          </div>
          <Link to="/" className="ml-auto text-xs font-semibold text-primary hover:underline">
            ← Back to Matrix
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-10 space-y-16 flex-1">
        {/* Hero */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">
            QA Matrix <span className="text-primary">Workflow</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            An end-to-end automotive quality assurance system that combines AI-powered defect matching
            with structured concern tracking to maintain manufacturing excellence.
          </p>
        </section>

        {/* ═══ WORKFLOW DIAGRAM ═══ */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Application Workflow Diagram</h3>
          <Card className="overflow-hidden">
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-3 gap-3">
                {diagramNodes.map((node, i) => (
                  <div key={node.id} className="relative">
                    <div className={`${node.color} border-2 rounded-lg px-3 py-3 text-center transition-all hover:scale-105`}>
                      <p className="text-xs font-bold text-foreground">{node.label}</p>
                    </div>
                    {/* Arrows: show down arrow after every 3rd item except last row */}
                    {i < 9 && i % 3 === 2 && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                        <ArrowDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    {/* Right arrows within row */}
                    {i % 3 < 2 && (
                      <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-200 dark:bg-red-900/40 border border-red-300" />
                  <span className="text-[10px] text-muted-foreground">Collection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-purple-200 dark:bg-purple-900/40 border border-purple-300" />
                  <span className="text-[10px] text-muted-foreground">Matching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-900/40 border border-green-300" />
                  <span className="text-[10px] text-muted-foreground">Calculation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-900/40 border border-blue-300" />
                  <span className="text-[10px] text-muted-foreground">Export</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4-Phase Pipeline */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Data Pipeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((p, i) => (
              <Card key={i} className={`${p.borderColor} border-2 relative overflow-hidden`}>
                <div className={`${p.color} px-4 py-3`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${p.accent}`}>{p.phase}</span>
                  <h4 className="text-sm font-bold mt-0.5">{p.title}</h4>
                </div>
                <CardContent className="pt-4 pb-4 space-y-2">
                  {p.steps.map((s, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${p.accent}`} />
                      <span className="text-foreground/80">{s}</span>
                    </div>
                  ))}
                </CardContent>
                {i < phases.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Workflow */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Detailed Workflow</h3>
          <div className="space-y-4">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status Calculation Logic */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Status Calculation Logic</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">MFG Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1 rounded font-mono">sum(Trim) + sum(Chassis) + sum(Final)</code></p>
                <p>OK if MFG Rating ≥ Defect Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quality Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1 rounded font-mono">sum(QControl scores)</code></p>
                <p>Combines all 11 control checkpoints</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Plant Status</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1 rounded font-mono">ResidualTorque + QControl + QDetail</code></p>
                <p>NG if Plant Rating &lt; Defect Rating</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ PYTHON SCRIPTS SECTION ═══ */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Code2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Python Processing Scripts</h3>
              <p className="text-xs text-muted-foreground">Standalone pipeline scripts in <code className="bg-muted px-1 rounded font-mono">python/</code> directory</p>
            </div>
          </div>

          {/* Pipeline command */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-4 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Full Pipeline Command</p>
              <div className="font-mono text-xs space-y-1 text-foreground/80">
                <p>$ pip install -r python/requirements.txt</p>
                <p>$ python python/defect_processor.py -i defects.xlsx -s DVX -o cleaned.csv</p>
                <p>$ python python/ai_defect_matcher.py -d cleaned.csv -m matrix.csv -o matches.csv</p>
                <p>$ python python/recurrence_aggregator.py -m matrix.csv -d matches.csv -o updated.csv</p>
                <p>$ python python/rating_calculator.py -m updated.csv -o rated.csv --report</p>
                <p>$ python python/status_automator.py -m rated.csv -o final.csv --summary</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pythonScripts.map((script, i) => (
              <Card key={i} className="hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    {script.file}
                  </CardTitle>
                  <p className="text-xs font-semibold text-foreground/80">{script.title}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{script.desc}</p>
                  <div className="bg-muted/60 rounded-md px-3 py-2">
                    <p className="font-mono text-[10px] text-foreground/70 break-all">$ {script.cmd}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {script.functions.map((fn, j) => (
                      <span key={j} className="text-[9px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {fn}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {techStack.map((t, i) => (
              <Card key={i} className="hover:border-primary/40 transition-colors">
                <CardContent className="pt-4 pb-4 flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <t.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    <span className="text-[9px] font-mono text-primary/60 uppercase">{t.category}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">System Architecture</h3>
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-primary/10 inline-block">
                    <Layout className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold">Frontend</h4>
                  <p className="text-xs text-muted-foreground">React SPA with QA Matrix Table, Repeats Tab, Defect Upload, Dashboard views. All state managed via React hooks and TanStack Query.</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-primary/10 inline-block">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold">Backend</h4>
                  <p className="text-xs text-muted-foreground">PostgreSQL database with 3 tables (qa_matrix_entries, defect_data, final_defect). Edge Functions for AI matching and defect management.</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-primary/10 inline-block">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold">AI/NLP Layer</h4>
                  <p className="text-xs text-muted-foreground">Google Gemini via Edge Functions for semantic defect matching. Uses tool-calling for structured output with confidence scoring.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Edge Functions */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Backend Functions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Brain className="w-4 h-4" /> match-defects</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">Sends batches of defects + concerns to Google Gemini. Returns semantic matches with confidence scores via tool-calling.</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Database className="w-4 h-4" /> delete-defects</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">Password-protected bulk deletion of defect data by source (DVX/SCA/YARD/ALL/FINAL).</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" /> fetch-spreadsheet</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">Imports QA matrix data from external spreadsheet sources into the system.</CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
