import { Check } from "lucide-react";

export function ImportStepIndicator({ currentStep }: { currentStep: "UPLOAD" | "REVIEW" | "IMPORTING" | "RESULT" }) {
  const isPastUpload = currentStep !== "UPLOAD";
  const isResult = currentStep === "RESULT";

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${isPastUpload ? "bg-primary text-primary-foreground border-primary" : "border-primary text-primary"}`}>
        {isPastUpload ? <Check className="w-3.5 h-3.5" /> : "1"}
      </div>
      <span className={currentStep === "UPLOAD" ? "text-foreground" : "text-muted-foreground"}>Upload</span>
      
      <div className="w-8 h-px bg-border mx-1"></div>
      
      <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${isPastUpload ? isResult ? "bg-primary text-primary-foreground border-primary" : "border-primary text-primary" : "border-muted text-muted-foreground"}`}>
        {isResult ? <Check className="w-3.5 h-3.5" /> : "2"}
      </div>
      <span className={isPastUpload && !isResult ? "text-foreground" : "text-muted-foreground"}>Review</span>

      <div className="w-8 h-px bg-border mx-1"></div>
      
      <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${isResult ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground"}`}>
        3
      </div>
      <span className={isResult ? "text-foreground" : "text-muted-foreground"}>Result</span>
    </div>
  );
}
