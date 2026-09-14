import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { generateTemplate } from "@/admin/lib/import/parseExcel";

interface ImportUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ImportUploader({ onFileSelect, isLoading, error }: ImportUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Basic validation
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-sm">Import Failed</h4>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-colors text-center flex flex-col items-center justify-center min-h-[300px] ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:bg-accent/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                Change File
              </Button>
              <Button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? "Processing..." : "Process File"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="font-medium text-foreground">
                Drag and drop your Excel file here
              </p>
              <p className="text-sm text-muted-foreground">
                Supports .xlsx and .xls formats
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              className="mt-4"
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button variant="link" onClick={generateTemplate} className="text-muted-foreground hover:text-primary">
          Download sample template
        </Button>
      </div>
    </div>
  );
}
