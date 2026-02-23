import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Upload, Trash2, ArrowLeft, Eye, Edit2, Save, Check, X, Calendar, Database, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Source = "DVX" | "SCA" | "YARD";

interface DefectRow {
  defect_code: string;
  defect_location_code: string;
  defect_description_details: string;
}

interface StoredDefect extends DefectRow {
  id: string;
  source: Source;
  uploaded_at: string;
}

const SOURCES: Source[] = ["DVX", "SCA", "YARD"];

function parseFile(file: File): Promise<DefectRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (rows.length < 2) { resolve([]); return; }

        const headers = (rows[0] || []).map((h: any) => String(h || "").trim().toLowerCase());
        const findCol = (...names: string[]) => {
          for (const name of names) {
            const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
            if (idx !== -1) return idx;
          }
          return -1;
        };

        const codeCol = findCol("defect code", "code");
        const locCol = findCol("location code", "location", "loc code");
        const descCol = findCol("description detail", "defect description", "description");

        const entries: DefectRow[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;
          const code = String(row[codeCol] ?? "").trim();
          const loc = String(row[locCol] ?? "").trim();
          const desc = String(row[descCol] ?? "").trim();
          if (!code && !desc) continue;
          entries.push({ defect_code: code, defect_location_code: loc, defect_description_details: desc });
        }
        resolve(entries);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

const SourceSection = ({ source, data, onRefresh, lastUploadDate }: { source: Source; data: StoredDefect[]; onRefresh: () => void; lastUploadDate: string | null }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<DefectRow[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<DefectRow>({ defect_code: "", defect_location_code: "", defect_description_details: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasEdits, setHasEdits] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseFile(file);
      if (rows.length === 0) {
        toast({ title: "No data found", description: "The file has no valid rows.", variant: "destructive" });
        return;
      }
      setPreview(rows);
      setShowPreview(true);
      setHasEdits(false);
      setConfirmUpload(false);
    } catch {
      toast({ title: "Parse error", description: "Could not read the file.", variant: "destructive" });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditRow({ ...preview[idx] });
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const updated = [...preview];
    updated[editingIdx] = { ...editRow };
    setPreview(updated);
    setEditingIdx(null);
    setHasEdits(true);
  };

  const deletePreviewRow = (idx: number) => {
    setPreview(prev => prev.filter((_, i) => i !== idx));
    setHasEdits(true);
  };

  const handleConfirmEdits = () => {
    setHasEdits(false);
    toast({ title: "Edits saved", description: "Changes confirmed. Ready to upload." });
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const insertRows = preview.map(r => ({ ...r, source }));
      const { error } = await supabase.from("defect_data").insert(insertRows);
      if (error) throw error;

      const finalRows = preview
        .filter(r => r.defect_code || r.defect_description_details)
        .map(r => ({
          defect_code: r.defect_code,
          defect_location_code: r.defect_location_code,
          defect_description_details: r.defect_description_details,
          source,
        }));
      if (finalRows.length > 0) {
        const { error: finalError } = await supabase.from("final_defect").insert(finalRows);
        if (finalError) console.error("final_defect insert error:", finalError);
      }

      toast({ title: "Upload successful", description: `${preview.length} defects uploaded for ${source}.` });
      setPreview([]);
      setShowPreview(false);
      setConfirmUpload(false);
      onRefresh();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm(`Delete all ${source} defect data?`)) return;
    const { error: e1 } = await supabase.from("defect_data").delete().eq("source", source);
    const { error: e2 } = await supabase.from("final_defect").delete().eq("source", source);
    if (e1 || e2) {
      toast({ title: "Error", description: (e1 || e2)?.message, variant: "destructive" });
    } else {
      toast({ title: "Cleared", description: `All ${source} data deleted.` });
      onRefresh();
    }
  };

  const sourceColors: Record<Source, string> = {
    DVX: "border-sky-400/60",
    SCA: "border-emerald-400/60",
    YARD: "border-amber-400/60",
  };

  return (
    <div className={`border-l-4 ${sourceColors[source]} rounded-lg p-4 bg-card border border-border`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold">{source} Defects <span className="text-muted-foreground font-normal">({data.length} records)</span></h3>
          {lastUploadDate && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              Last updated: {new Date(lastUploadDate).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" />
            Upload CSV/Excel
          </Button>
          {data.length > 0 && (
            <>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowReview(true)}>
                <Eye className="w-3.5 h-3.5" />
                Review
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5 text-destructive" onClick={handleClear}>
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />

      {data.length === 0 && !showPreview && (
        <p className="text-xs text-muted-foreground italic">No data uploaded yet. Upload a CSV or Excel file.</p>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={(v) => { if (!v) { setShowPreview(false); setPreview([]); setConfirmUpload(false); } }}>
        <DialogContent className="sm:max-w-[750px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview — {source} Upload ({preview.length} rows)</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border border-border rounded-md">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold w-8">#</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Defect Code</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Location Code</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Description Details</th>
                  <th className="px-2 py-1.5 text-center font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx} className="border-t border-border/30">
                    {editingIdx === idx ? (
                      <>
                        <td className="px-2 py-1 text-muted-foreground">{idx + 1}</td>
                        <td className="px-2 py-1">
                          <input className="w-full px-1 py-0.5 border border-input rounded text-xs bg-background" value={editRow.defect_code} onChange={e => setEditRow({ ...editRow, defect_code: e.target.value })} />
                        </td>
                        <td className="px-2 py-1">
                          <input className="w-full px-1 py-0.5 border border-input rounded text-xs bg-background" value={editRow.defect_location_code} onChange={e => setEditRow({ ...editRow, defect_location_code: e.target.value })} />
                        </td>
                        <td className="px-2 py-1">
                          <input className="w-full px-1 py-0.5 border border-input rounded text-xs bg-background" value={editRow.defect_description_details} onChange={e => setEditRow({ ...editRow, defect_description_details: e.target.value })} />
                        </td>
                        <td className="px-2 py-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={saveEdit} className="p-1 rounded hover:bg-primary/10 text-primary"><Check className="w-3 h-3" /></button>
                            <button onClick={() => setEditingIdx(null)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><X className="w-3 h-3" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-1 text-muted-foreground">{idx + 1}</td>
                        <td className="px-2 py-1 font-mono">{row.defect_code}</td>
                        <td className="px-2 py-1 font-mono">{row.defect_location_code}</td>
                        <td className="px-2 py-1 max-w-[300px] truncate">{row.defect_description_details}</td>
                        <td className="px-2 py-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => startEdit(idx)} className="p-1 rounded hover:bg-primary/10 text-muted-foreground"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => deletePreviewRow(idx)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">{preview.length} rows ready</span>
            <div className="flex gap-2">
              {hasEdits && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={handleConfirmEdits}>
                  <Save className="w-3.5 h-3.5" />
                  Confirm Edits
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => { setShowPreview(false); setPreview([]); }}>Cancel</Button>
              {!confirmUpload ? (
                <Button size="sm" onClick={() => setConfirmUpload(true)} disabled={hasEdits}>
                  Upload {preview.length} Rows
                </Button>
              ) : (
                <Button size="sm" variant="destructive" onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : `Confirm Upload to ${source}`}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review stored data dialog */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Review — {source} Data ({data.length} records)</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border border-border rounded-md">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold">Defect Code</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Location Code</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Description Details</th>
                  <th className="px-2 py-1.5 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id} className="border-t border-border/30">
                    <td className="px-2 py-1 font-mono">{d.defect_code}</td>
                    <td className="px-2 py-1 font-mono">{d.defect_location_code}</td>
                    <td className="px-2 py-1 max-w-[300px] truncate">{d.defect_description_details}</td>
                    <td className="px-2 py-1 text-muted-foreground">{new Date(d.uploaded_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DefectUpload = () => {
  const [defects, setDefects] = useState<StoredDefect[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDefects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("defect_data")
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (!error && data) {
      setDefects(data as StoredDefect[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDefects(); }, []);

  const getLastUploadDate = (source: Source): string | null => {
    const sourceData = defects.filter(d => d.source === source);
    if (sourceData.length === 0) return null;
    return sourceData[0].uploaded_at; // Already sorted desc
  };

  // Dashboard stats
  const totalDefects = defects.length;
  const dvxCount = defects.filter(d => d.source === "DVX").length;
  const scaCount = defects.filter(d => d.source === "SCA").length;
  const yardCount = defects.filter(d => d.source === "YARD").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Defect Data Upload</h1>
            <p className="text-[11px] text-muted-foreground">Upload defect data for DVX, SCA, and YARD teams</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
        {/* Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="dashboard-card flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">{totalDefects}</p>
              <p className="text-xs text-muted-foreground">Total Defects</p>
            </div>
          </div>
          {([
            { source: "DVX" as Source, count: dvxCount, color: "text-sky-500" },
            { source: "SCA" as Source, count: scaCount, color: "text-emerald-500" },
            { source: "YARD" as Source, count: yardCount, color: "text-amber-500" },
          ]).map(({ source, count, color }) => (
            <div key={source} className="dashboard-card flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-muted">
                <BarChart3 className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{count}</p>
                <p className="text-xs text-muted-foreground">{source} Defects</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          SOURCES.map(source => (
            <SourceSection
              key={source}
              source={source}
              data={defects.filter(d => d.source === source)}
              onRefresh={fetchDefects}
              lastUploadDate={getLastUploadDate(source)}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default DefectUpload;
