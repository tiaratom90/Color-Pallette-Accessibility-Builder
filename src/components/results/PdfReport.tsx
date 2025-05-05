
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

const PdfReport = () => {
  const { toast } = useToast();

  const downloadPdfReport = async () => {
    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      
      // Title and date
      pdf.setFontSize(20);
      pdf.text("Color Contrast Accessibility Report", 14, 20);
      pdf.setFontSize(10);
      pdf.text("Generated on: " + new Date().toLocaleString(), 14, 28);
      
      // Get both tabbed views as screenshots
      const tabViews = document.querySelectorAll('[role="tabpanel"]:not([hidden])');
      
      if (tabViews.length > 0) {
        // Only capture the visible tab panel
        const visibleTabPanel = tabViews[0] as HTMLElement;
        const visibleCanvas = await html2canvas(visibleTabPanel, {
          scale: 1.5,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null
        });
        
        // Add the visible tab section
        const tabName = document.querySelector('[role="tab"][data-state="active"]')?.textContent || "Results";
        pdf.setFontSize(16);
        pdf.text(tabName, 14, 40);
        
        const visibleImg = visibleCanvas.toDataURL('image/png');
        const imgHeight = (visibleCanvas.height * width) / visibleCanvas.width;
        pdf.addImage(visibleImg, 'PNG', 10, 45, width - 20, Math.min(imgHeight * 0.5, height - 55));
        
        // Save the PDF
        pdf.save('contrast-accessibility-report.pdf');
      } else {
        throw new Error("Active tab view not found");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={downloadPdfReport}
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      Download PDF Report
    </Button>
  );
};

export default PdfReport;
