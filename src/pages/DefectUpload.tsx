import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Upload, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

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

const SourceSection = ({ source, data, onRefresh }: { source: Source; data: StoredDefect[]; onRefresh: () => void }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const rows = await parseFile(file);
      if (rows.length === 0) {
        toast({ title: "No data found", description: "The file has no valid rows.", variant: "destructive" });
        return;
      }
      // Insert into defect_data
      const insertRows = rows.map(r => ({ ...r, source }));
      const { error } = await supabase.from("defect_data").insert(insertRows);
      if (error) throw error;

      // Also insert into final_defect (filtered: only defect_code, defect_location_code, defect_description_details)
      const finalRows = rows
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

      toast({ title: "Upload successful", description: `${rows.length} defects uploaded for ${source}.` });
      onRefresh();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClear = async () => {
    if (!confirm(`Delete all ${source} defect data?`)) return;
    const { error } = await supabase.from("defect_data").delete().eq("source", source);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cleared", description: `All ${source} data deleted.` });
      onRefresh();
    }
  };

  const sourceColors: Record<Source, string> = {
    DVX: "border-sky-400/60 bg-sky-50",
    SCA: "border-emerald-400/60 bg-emerald-50",
    YARD: "border-amber-400/60 bg-amber-50",
  };

  return (
    <div className={`border-l-4 ${sourceColors[source]} rounded-lg p-4 bg-card border border-border`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">{source} Defects <span className="text-muted-foreground font-normal">({data.length} records)</span></h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload CSV/Excel"}
          </Button>
          {data.length > 0 && (
            <Button size="sm" variant="ghost" className="gap-1.5 text-destructive" onClick={handleClear}>
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} className="hidden" />
      {data.length > 0 ? (
        <div className="overflow-auto max-h-[300px] border border-border rounded-md">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="px-2 py-1.5 text-left font-semibold">Defect Code</th>
                <th className="px-2 py-1.5 text-left font-semibold">Location Code</th>
                <th className="px-2 py-1.5 text-left font-semibold">Description Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="border-t border-border/30">
                  <td className="px-2 py-1 font-mono">{d.defect_code}</td>
                  <td className="px-2 py-1 font-mono">{d.defect_location_code}</td>
                  <td className="px-2 py-1 max-w-[300px] truncate">{d.defect_description_details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No data uploaded yet. Upload a CSV or Excel file with columns: Defect Code, Location Code, Description Details.</p>
      )}
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
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          SOURCES.map(source => (
            <SourceSection
              key={source}
              source={source}
              data={defects.filter(d => d.source === source)}
              onRefresh={fetchDefects}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default DefectUpload;
