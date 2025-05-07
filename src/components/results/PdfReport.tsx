
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; 
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { jsPDF } from "jspdf";

const PdfReport = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadScreenshot = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Report",
        description: "Please wait while we prepare your report...",
      });

      // Find the active tab panel with results
      const resultsContainer = document.querySelector('[role="tabpanel"][data-state="active"]');
      if (!resultsContainer) {
        throw new Error("No content found to capture");
      }

      // Create a deep clone of the results container to modify
      const clone = resultsContainer.cloneNode(true) as HTMLElement;
      
      // Hide all copy buttons in the clone
      const copyButtons = clone.querySelectorAll('button:has(.lucide-copy)');
      copyButtons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });
      
      // Apply styling to ensure proper rendering
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.width = `${resultsContainer.clientWidth}px`;
      clone.style.backgroundColor = 'white';
      clone.style.padding = '20px';
      clone.style.borderRadius = '0';
      clone.style.boxShadow = 'none';
      clone.style.color = '#000';
      
      // Set a higher z-index to ensure it's on top
      clone.style.zIndex = '-9999';
      document.body.appendChild(clone);
      
      // Ensure all color swatches render properly
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
      
      // Calculate PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const aspectRatio = pdfWidth / clone.offsetWidth;
      
      // Set fonts to handle special characters
      pdf.setFont("helvetica", "normal");
      
      // Take screenshot with html2canvas
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: false, // Important to prevent flickering
        onclone: (clonedDoc) => {
          // Additional styling for the cloned document if needed
          const clonedElement = clonedDoc.body.querySelector('[role="tabpanel"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = `${resultsContainer.clientWidth}px`;
          }
        }
      });
      
      // Option 1: Download as PNG image
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Failed to create image");
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `contrast-results-${new Date().toISOString().slice(0,10)}.png`;
        link.href = url;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(clone);
        
        toast({
          title: "Report Downloaded",
          description: "Your contrast results have been saved as an image.",
        });
      }, "image/png", 1.0);
      
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error generating report",
        description: "There was a problem creating the document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={downloadScreenshot}
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download Report"}
    </Button>
  );
};

export default PdfReport;
