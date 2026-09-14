import { CheckCircle2, AlertTriangle, XCircle, FileText } from "lucide-react";
import type { ImportResult } from "@/admin/lib/import/types";

export function ImportSummary({ result }: { result: ImportResult }) {
  return (
    <div className="space-y-4">
      {result.fileWarnings.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">
                File Warnings
              </h4>
              <ul className="mt-1 text-sm text-amber-700 dark:text-amber-500 list-disc list-inside">
                {result.fileWarnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <FileText className="w-6 h-6 text-muted-foreground mb-2" />
          <div className="text-2xl font-semibold">{result.total}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">Total Rows</div>
        </div>
        
        <div className="bg-card border border-green-200 dark:border-green-900/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500 mb-2" />
          <div className="text-2xl font-semibold text-green-700 dark:text-green-400">{result.valid}</div>
          <div className="text-xs text-green-600/80 dark:text-green-500/80 uppercase tracking-wider font-medium mt-1">Valid</div>
        </div>
        
        <div className="bg-card border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-500 mb-2" />
          <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{result.warnings}</div>
          <div className="text-xs text-amber-600/80 dark:text-amber-500/80 uppercase tracking-wider font-medium mt-1">Warnings</div>
        </div>

        <div className="bg-card border border-destructive/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
          <XCircle className="w-6 h-6 text-destructive mb-2" />
          <div className="text-2xl font-semibold text-destructive">{result.errors}</div>
          <div className="text-xs text-destructive/80 uppercase tracking-wider font-medium mt-1">Errors</div>
        </div>
      </div>
    </div>
  );
}
