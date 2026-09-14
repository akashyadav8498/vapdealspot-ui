import { useState } from "react";
import { ImportStepIndicator } from "../../components/admin/import/ImportStepIndicator";
import { ImportUploader } from "../../components/admin/import/ImportUploader";
import { ImportSummary } from "../../components/admin/import/ImportSummary";
import { ImportPreviewTable } from "../../components/admin/import/ImportPreviewTable";
import { ImportResultView } from "../../components/admin/import/ImportResultView";
import { parseExcelFile } from "@/admin/lib/import/parseExcel";
import { mapImportRowsToProducts } from "@/admin/lib/import/mapProducts";
import type { ImportResult } from "@/admin/lib/import/types";
import { Button } from "@/admin/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProducts } from "@/admin/lib/ProductContext";

type ImportStep = "UPLOAD" | "REVIEW" | "IMPORTING" | "RESULT";

export function AdminImportsPage() {
  const [step, setStep] = useState<ImportStep>("UPLOAD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  
  // Track result metrics
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);

  const { addProducts } = useProducts();

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await parseExcelFile(file);
      setImportResult(result);
      setStep("REVIEW");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while parsing the file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep("UPLOAD");
    setImportResult(null);
    setError(null);
    setImportedCount(0);
    setSkippedCount(0);
    setWarningCount(0);
  };

  const handleConfirmImport = async () => {
    if (!importResult) return;
    
    setStep("IMPORTING");

    // Process logic
    // Minimum UI delay to prevent jank
    await new Promise(resolve => setTimeout(resolve, 400));

    // A row is import-ready if it contains ZERO validation errors
    const importReadyRows = importResult.rows.filter(row => 
      !row.issues.some(issue => issue.severity === "error")
    );
    
    const errorRowsCount = importResult.rows.length - importReadyRows.length;
    
    const warningOnlyRowsCount = importReadyRows.filter(row => 
      row.issues.some(issue => issue.severity === "warning")
    ).length;

    if (importReadyRows.length > 0) {
      const productsToImport = mapImportRowsToProducts(importReadyRows.map(r => r.data));
      addProducts(productsToImport);
    }

    setImportedCount(importReadyRows.length);
    setSkippedCount(errorRowsCount);
    setWarningCount(warningOnlyRowsCount);
    
    setStep("RESULT");
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Import Products
          </h2>
          <p className="text-sm text-secondary-foreground mt-1">
            Add multiple products to the catalog using an Excel file.
          </p>
        </div>
        
        <ImportStepIndicator currentStep={step} />
      </div>

      {step === "UPLOAD" && (
        <div className="mt-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ImportUploader 
            onFileSelect={handleFileSelect} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      )}

      {step === "REVIEW" && importResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Review Import Data</h3>
            <Button variant="outline" size="sm" onClick={handleStartOver}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel & Start Over
            </Button>
          </div>
          
          <ImportSummary result={importResult} />
          <ImportPreviewTable result={importResult} />
          
          <div className="flex justify-end pt-4 border-t border-border mt-8">
            <Button onClick={handleConfirmImport} className="w-full sm:w-auto">
              Confirm Import
            </Button>
          </div>
        </div>
      )}

      {step === "IMPORTING" && (
        <div className="mt-16 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <h3 className="text-lg font-medium">Processing Import...</h3>
          <p className="text-sm text-muted-foreground">Please do not close this window.</p>
        </div>
      )}

      {step === "RESULT" && (
        <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
          <ImportResultView
            importedCount={importedCount}
            skippedCount={skippedCount}
            warningCount={warningCount}
            onStartAnother={handleStartOver}
          />
        </div>
      )}
    </div>
  );
}
