import { useAiScanReceiptMutation } from "@/features/transaction/transactionApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AIScanReceiptData } from "@/features/transaction/transactionType";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { ScanText } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ReceiptScannerProps {
  loadingChange: boolean;
  onScanComplete: (data: AIScanReceiptData) => void;
  onLoadingChange: (isLoading: boolean) => void;
}
function ReceiptScanner({
  loadingChange,
  onScanComplete,
  onLoadingChange,
}: ReceiptScannerProps) {
  const [receipt, setReceipt] = useState<string | null>(null);

  const {
    progress,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const [aiScanReceipt] = useAiScanReceiptMutation();

  const handleReceiptUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", file);

    startProgress(10);
    onLoadingChange(true);

    // simulate file upload and processing for ui
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setReceipt(result);

      // simulate scanning progress
      let currentProgress = 10;
      const interval = setInterval(() => {
        const increment = currentProgress < 90 ? 10 : 1;
        currentProgress = Math.min(currentProgress + increment, 90);
        updateProgress(currentProgress);
      }, 250);

      try {
        const data = await aiScanReceipt(formData).unwrap();
        updateProgress(100);
        console.log("Ai Scan data::", data);
        onScanComplete(data);
        toast.success("Receipt scanned successfully");
      } catch (error) {
        const errorMessage = error instanceof Object && 'data' in error && typeof error.data === 'object' && error.data !== null && 'error' in error.data ? (error.data as { error: string }).error : "Failed to scan receipt";
        toast.error(errorMessage);
      }finally{
        clearInterval(interval);
        doneProgress();
        resetProgress();
        setReceipt(null);
        onLoadingChange(false);
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">AI Scan Receipt</Label>

      <div className="flex items-start gap-3 border-b pb-4">
        {/* Receipt preview */}
        <div
          className={`h-12 w-12 rounded-md border bg-cover bg-center ${!receipt ? "bg-muted" : ""}`}
          style={receipt ? { backgroundImage: `url(${receipt})` } : {}}
        >
          {!receipt && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ScanText color="currentColor" className="h-5 w-5 !stroke-1.5" />
            </div>
          )}
        </div>

        {/* upload input and progress */}
        <div className="flex-1">
          {!loadingChange ? (
            <>
              <Input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="max-w-[250px] px-1 h-9 cursor-pointer text-sm file:mr-2 
            file:rounded file:border-0 file:bg-primary file:px-3 file:py-px
            hover:file:bg-primary/90
            "
                disabled={loadingChange}
              />
              <p className="mt-2 text-xs px-2 text-muted-foreground">
                JPG, PNG up to 5MB
              </p>
            </>
          ) : (
            <div className="space-y-2 pt-3">
              <Progress value={progress} className="h-2 w-[250px]" />
              <p className="text-xs text-muted-foreground">
                Scanning receipt... {progress}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceiptScanner;
