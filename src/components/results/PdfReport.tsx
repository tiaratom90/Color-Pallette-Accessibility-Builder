
import { Button } from "@/components/ui/button";
import { Screenshot } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PdfReport = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadScreenshot = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Screenshot",
        description: "Please wait while we prepare your image...",
      });

      // Find the active tab panel with results
      const resultsContainer = document.querySelector('[role="tabpanel"][data-state="active"]');
      if (!resultsContainer) {
        throw new Error("No content found to capture");
      }

      // Take screenshot with html2canvas
      const canvas = await html2canvas(resultsContainer, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });
      
      // Convert canvas to blob
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
        
        toast({
          title: "Screenshot Downloaded",
          description: "Your contrast results have been saved as an image.",
        });
      }, "image/png", 0.9);
      
    } catch (error) {
      console.error("Error generating screenshot:", error);
      toast({
        title: "Error generating screenshot",
        description: "There was a problem creating the image. Please try again.",
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
      <Screenshot className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download Screenshot"}
    </Button>
  );
};

export default PdfReport;
