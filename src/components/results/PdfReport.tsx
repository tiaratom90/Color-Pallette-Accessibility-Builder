
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
      const currentDate = new Date().toLocaleString();
      pdf.text("Generated on: " + currentDate, 14, 28);
      
      // Get the tabs container and tab buttons
      const tabsContainer = document.querySelector('[role="tabslist"]')?.parentElement;
      const tabButtons = document.querySelectorAll('[role="tab"]');
      
      if (!tabsContainer || tabButtons.length === 0) {
        throw new Error("Tabs not found");
      }
      
      // Store the original active tab to restore later
      const originalActiveTab = document.querySelector('[role="tab"][data-state="active"]') as HTMLElement;
      if (!originalActiveTab) {
        throw new Error("No active tab found");
      }
      
      // Process both tabs
      let currentY = 35;
      const tabIds = ["by-color", "by-accessibility"];
      
      for (const tabId of tabIds) {
        // Find and click the tab button to make its content visible
        const tabButton = Array.from(tabButtons).find(
          tab => tab.getAttribute('value') === tabId
        ) as HTMLElement;
        
        if (!tabButton) continue;
        
        // Activate this tab
        tabButton.click();
        
        // Wait a moment for tab transition
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Find the now visible tab panel
        const tabPanel = document.querySelector(
          `[role="tabpanel"][data-state="active"][data-orientation="horizontal"]`
        ) as HTMLElement;
        
        if (!tabPanel) continue;
        
        // Add the tab name as a section heading
        pdf.setFontSize(16);
        const tabName = tabButton.textContent || (tabId === "by-color" ? "By Color" : "By Accessibility");
        pdf.text(tabName, 14, currentY);
        currentY += 10;
        
        // Temporarily adjust the panel for better capture
        const originalStyle = tabPanel.style.cssText;
        tabPanel.style.maxHeight = "none";
        tabPanel.style.overflow = "visible";
        
        // Capture the tab content
        const canvas = await html2canvas(tabPanel, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowWidth: 1200, // Force consistent rendering width
        });
        
        // Calculate image dimensions
        const imgWidth = width - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/png');
        
        if (currentY + imgHeight > height) {
          pdf.addPage();
          currentY = 20;
        }
        
        pdf.addImage(imgData, 'PNG', 10, currentY, imgWidth, imgHeight);
        
        // Restore the panel's original style
        tabPanel.style.cssText = originalStyle;
        
        // Update Y position for next section
        currentY += imgHeight + 15;
        
        // Add a new page for the next tab if needed
        if (tabId !== tabIds[tabIds.length - 1] && currentY > height - 30) {
          pdf.addPage();
          currentY = 20;
        }
      }
      
      // Restore the originally active tab
      originalActiveTab.click();
      
      // Save the PDF
      pdf.save('contrast-accessibility-report.pdf');
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your accessibility report has been downloaded.",
      });
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
