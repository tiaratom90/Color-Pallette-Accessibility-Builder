
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PdfReport = () => {
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
      const tabViews = document.querySelectorAll('[role="tabpanel"]');
      
      if (tabViews.length >= 2) {
        // Get By Color tab (first tab)
        const byColorTab = tabViews[0] as HTMLElement;
        const byColorCanvas = await html2canvas(byColorTab, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        // Get By Accessibility tab (second tab)
        const byAccessibilityTab = tabViews[1] as HTMLElement;
        const byAccessibilityCanvas = await html2canvas(byAccessibilityTab, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true 
        });
        
        // Add By Color section
        pdf.setFontSize(16);
        pdf.text("By Color View", 14, 40);
        const byColorImg = byColorCanvas.toDataURL('image/png');
        const imgHeight = (byColorCanvas.height * width) / byColorCanvas.width;
        pdf.addImage(byColorImg, 'PNG', 10, 45, width - 20, imgHeight * 0.5);
        
        // Add By Accessibility section on a new page if needed
        if (45 + imgHeight * 0.5 + 60 > height) {
          pdf.addPage();
          pdf.setFontSize(16);
          pdf.text("By Accessibility View", 14, 20);
          const byAccessImg = byAccessibilityCanvas.toDataURL('image/png');
          const accessImgHeight = (byAccessibilityCanvas.height * width) / byAccessibilityCanvas.width;
          pdf.addImage(byAccessImg, 'PNG', 10, 25, width - 20, accessImgHeight * 0.5);
        } else {
          const yPosition = 45 + imgHeight * 0.5 + 20;
          pdf.setFontSize(16);
          pdf.text("By Accessibility View", 14, yPosition);
          const byAccessImg = byAccessibilityCanvas.toDataURL('image/png');
          const accessImgHeight = (byAccessibilityCanvas.height * width) / byAccessibilityCanvas.width;
          pdf.addImage(byAccessImg, 'PNG', 10, yPosition + 5, width - 20, accessImgHeight * 0.5);
        }
        
        // Save the PDF
        pdf.save('contrast-accessibility-report.pdf');
      } else {
        throw new Error("Tab views not found");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
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
