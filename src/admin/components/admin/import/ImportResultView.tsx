import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ImportResultViewProps {
  importedCount: number;
  skippedCount: number;
  warningCount: number;
  onStartAnother: () => void;
}

export function ImportResultView({ importedCount, skippedCount, warningCount, onStartAnother }: ImportResultViewProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border rounded-xl p-8 max-w-2xl mx-auto text-center space-y-6">
      <div className="flex justify-center">
        {importedCount > 0 ? (
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {importedCount > 0 ? "Import Complete" : "Import Failed"}
        </h3>
        
        {importedCount > 0 ? (
          <p className="text-lg text-secondary-foreground">
            <span className="font-medium text-foreground">{importedCount}</span> product{importedCount === 1 ? "" : "s"} imported successfully.
          </p>
        ) : (
          <p className="text-lg text-secondary-foreground">
            No products were imported because all rows contained errors.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 items-center justify-center pt-4">
        {skippedCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg border border-destructive/20 w-full max-w-md justify-center">
            <XCircle className="w-4 h-4" />
            <span>{skippedCount} row{skippedCount === 1 ? "" : "s"} skipped because {skippedCount === 1 ? "it" : "they"} contained validation errors.</span>
          </div>
        )}

        {warningCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800 w-full max-w-md justify-center">
            <AlertTriangle className="w-4 h-4" />
            <span>{warningCount} imported row{warningCount === 1 ? "" : "s"} contained warnings.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-border mt-8">
        <Button variant="outline" onClick={onStartAnother} className="w-full sm:w-auto">
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Another Import
        </Button>
        <Button onClick={() => navigate("/admin/products")} className="w-full sm:w-auto">
          View Products
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
