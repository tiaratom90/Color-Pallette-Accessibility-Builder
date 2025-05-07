
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportAsJSON, exportAsPNG, exportAsSVG } from "@/utils/exportUtils";
import { ColorResult } from "@/utils/contrastUtils";
import { Save, FileText, FileImage, FileCode } from "lucide-react";

interface ExportOptionsProps {
  results: Record<string, Record<string, ColorResult>>;
  colorNames: string[];
}

const ExportOptions = ({ results, colorNames }: ExportOptionsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "json" | "png" | "svg") => {
    try {
      setIsExporting(true);
      
      toast({
        title: `Preparing ${format.toUpperCase()} Export`,
        description: "Please wait while we prepare your file...",
      });

      let success = false;
      
      if (format === "json") {
        success = exportAsJSON(results, colorNames);
      } else if (format === "png") {
        // Find the active tab panel with results
        const resultsContainer = document.querySelector('[role="tabpanel"][data-state="active"]');
        if (!resultsContainer) {
          throw new Error("No content found to capture");
        }
        success = await exportAsPNG(resultsContainer);
      } else if (format === "svg") {
        success = exportAsSVG(results, colorNames);
      }

      if (success) {
        toast({
          title: "Export Complete",
          description: `Your contrast results have been saved as ${format.toUpperCase()}.`,
        });
      }
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast({
        title: `Error Exporting ${format.toUpperCase()}`,
        description: "There was a problem creating the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isExporting}>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export Results"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("png")}>
          <FileImage className="h-4 w-4 mr-2" />
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("svg")}>
          <FileCode className="h-4 w-4 mr-2" />
          Export as SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
