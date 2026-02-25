import { Link } from "react-router-dom";
import { Shield, Database, Brain, FileSpreadsheet, BarChart3, Upload, ArrowRight, Repeat, CheckCircle2, Server, Layout, Cpu, Layers } from "lucide-react";
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
    description: "Automatic rating logic: MFG Rating = Defect Rating × Recurrence. Quality Rating combines Trim, Chassis, and Final scores. Plant Status = NG if MFG or Quality is NG.",
  },
  {
    title: "7. Dashboard & Export",
    description: "View summary dashboards with NG/OK breakdowns, designation distribution, and rating analytics. Export the full matrix as Excel or CSV at any time.",
  },
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
                <p><code className="bg-muted px-1 rounded font-mono">Defect Rating × Recurrence</code></p>
                <p>NG if rating ≥ 3, OK otherwise</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quality Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1 rounded font-mono">Trim + Chassis + Final scores</code></p>
                <p>NG if any section sum &gt; 0, OK otherwise</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Plant Status</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1 rounded font-mono">MFG Status ∧ Quality Status</code></p>
                <p>NG if either MFG or Quality is NG</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 inline-block">
                    <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold">Frontend</h4>
                  <p className="text-xs text-muted-foreground">React SPA with QA Matrix Table, Repeats Tab, Defect Upload, Dashboard views. All state managed via React hooks and TanStack Query.</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 inline-block">
                    <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-sm font-bold">Backend</h4>
                  <p className="text-xs text-muted-foreground">PostgreSQL database with 3 tables (qa_matrix_entries, defect_data, final_defect). Edge Functions for AI matching and defect management.</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 inline-block">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
