
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload } from "lucide-react";
import { useState, useRef } from "react";

interface ActionButtonsProps {
  onCheckContrast: () => void;
  onReset: () => void;
  onImport?: (colors: string[], names: string[]) => void;
}

const ActionButtons = ({ onCheckContrast, onReset, onImport }: ActionButtonsProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImport) {
      setIsImporting(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          
          // Extract colors from the imported data
          const importedColors = jsonData.colors.map((color: { hex: string }) => color.hex);
          const importedNames = jsonData.colors.map((color: { name: string }) => color.name);
          
          // Pass the imported data to the parent component
          onImport(importedColors, importedNames);
        } catch (error) {
          console.error("Error importing data:", error);
        } finally {
          setIsImporting(false);
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="space-y-4 mt-6">
      <div className="flex gap-4">
        <Button onClick={onCheckContrast} className="flex-1">
          Check Contrast
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
      
      {onImport && (
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <Button 
            variant="secondary" 
            onClick={handleImportClick} 
            disabled={isImporting} 
            className="w-full text-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? "Importing..." : "Import Saved Results (JSON)"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
