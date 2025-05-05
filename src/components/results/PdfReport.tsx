
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
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
      
      // Get the tabs container and tab buttons - using more specific selectors
      const tabsList = document.querySelector('[class*="TabsList"]');
      const tabButtons = document.querySelectorAll('[role="tab"]');
      
      console.log("TabsList found:", tabsList !== null);
      console.log("Number of tab buttons found:", tabButtons.length);
      
      if (!tabsList || tabButtons.length === 0) {
        // Fallback to trying to get just the active tab content if we can't get all tabs
        console.log("Trying fallback for tab content");
        const currentActivePanel = document.querySelector('[role="tabpanel"][data-state="active"]');
        
        if (!currentActivePanel) {
          throw new Error("No tab content could be found to generate PDF");
        }
        
        // Just capture the currently visible tab content
        let currentY = 35;
        pdf.setFontSize(16);
        pdf.text("Contrast Analysis", 14, currentY);
        currentY += 10;
        
        try {
          // Cast the Element to HTMLElement
          const canvas = await html2canvas(currentActivePanel as HTMLElement, {
            scale: 1.5,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff"
          });
          
          console.log("Canvas captured for active tab");
          
          // Calculate image dimensions
          const imgWidth = width - 20;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, currentY, imgWidth, imgHeight);
        } catch (error) {
          console.error("Error capturing active tab:", error);
          pdf.setTextColor(255, 0, 0);
          pdf.text("Error capturing content. Please try again.", 14, currentY);
          pdf.setTextColor(0, 0, 0);
        }
        
        // Save what we were able to capture
        pdf.save('contrast-accessibility-report.pdf');
        toast({
          title: "PDF Generated",
          description: "Only the current tab was captured due to technical limitations.",
        });
        return;
      }
      
      // Store the original active tab to restore later
      const originalActiveTab = document.querySelector('[role="tab"][data-state="active"]');
      if (!originalActiveTab) {
        console.warn("No active tab found, using first tab");
      }
      
      // Process both tabs
      let currentY = 35;
      const tabIds = ["by-color", "by-accessibility"];
      
      for (const tabId of tabIds) {
        console.log(`Processing tab: ${tabId}`);
        
        // Find and click the tab button to make its content visible
        const tabButton = Array.from(tabButtons).find(
          tab => tab.getAttribute('value') === tabId || tab.textContent?.toLowerCase().includes(tabId.replace('-', ' '))
        ) as HTMLElement;
        
        if (!tabButton) {
          console.warn(`Tab button for ${tabId} not found, skipping`);
          continue;
        }
        
        // Activate this tab
        tabButton.click();
        console.log(`Clicked tab: ${tabId}`);
        
        // Wait longer for tab transition to complete
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the now visible tab panel with more robust selector
        const tabPanel = document.querySelector(
          `[role="tabpanel"][data-state="active"], [data-radix-tabs-panel][data-state="active"]`
        );
        
        if (!tabPanel) {
          console.warn(`Tab panel for ${tabId} not found after click, skipping`);
          continue;
        }
        
        console.log(`Found tab panel for ${tabId}, preparing to capture`);
        
        // Add the tab name as a section heading
        pdf.setFontSize(16);
        const tabName = tabButton.textContent || (tabId === "by-color" ? "By Color" : "By Accessibility");
        pdf.text(tabName, 14, currentY);
        currentY += 10;
        
        try {
          // Get all child elements that are cards or content sections
          const contentSections = tabPanel.querySelectorAll('.card, [class*="grid"] > div');
          
          if (contentSections.length > 0) {
            console.log(`Found ${contentSections.length} content sections to capture individually`);
            
            // Capture each section separately for better results
            for (let i = 0; i < contentSections.length; i++) {
              const section = contentSections[i] as HTMLElement;
              
              // Skip empty or tiny sections
              if (section.offsetHeight < 20 || section.offsetWidth < 20) {
                continue;
              }
              
              // Temporarily adjust the section for better capture
              const originalStyle = section.style.cssText;
              section.style.maxHeight = "none";
              section.style.overflow = "visible";
              
              // Capture this section
              const canvas = await html2canvas(section, {
                scale: 1.5,
                logging: false,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff"
              });
              
              // Calculate image dimensions
              const imgWidth = width - 20;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              // Add a new page if this section won't fit
              if (currentY + imgHeight > height - 10) {
                pdf.addPage();
                currentY = 20;
              }
              
              // Add the image to the PDF
              pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, currentY, imgWidth, imgHeight);
              
              // Restore the section's original style
              section.style.cssText = originalStyle;
              
              // Update Y position for next section
              currentY += imgHeight + 10;
            }
          } else {
            // Fallback to capturing the entire panel if no sections found
            const canvas = await html2canvas(tabPanel as HTMLElement, {
              scale: 1.5,
              logging: false,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff"
            });
            
            // Calculate image dimensions
            const imgWidth = width - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add a new page if needed
            if (currentY + imgHeight > height - 10) {
              pdf.addPage();
              currentY = 20;
            }
            
            // Add the image to the PDF
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, currentY, imgWidth, imgHeight);
            
            // Update Y position
            currentY += imgHeight + 15;
          }
          
          // Add a new page for the next tab if needed
          if (tabId !== tabIds[tabIds.length - 1] && currentY > height - 30) {
            pdf.addPage();
            currentY = 20;
          }
        } catch (captureError) {
          console.error(`Error capturing ${tabId} tab:`, captureError);
          pdf.setTextColor(255, 0, 0);
          pdf.text(`Error capturing ${tabName} tab content`, 14, currentY);
          pdf.setTextColor(0, 0, 0);
          currentY += 10;
        }
      }
      
      // Restore the originally active tab if found
      if (originalActiveTab) {
        (originalActiveTab as HTMLElement).click();
        console.log("Restored original active tab");
      }
      
      // Save the PDF
      pdf.save('contrast-accessibility-report.pdf');
      console.log("PDF saved successfully");
      
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

  const printPage = () => {
    try {
      // Add a class to the body to apply print-specific styles
      document.body.classList.add('is-printing');
      
      // Use the browser's built-in print functionality
      window.print();
      
      // Remove the class after printing dialog is closed
      setTimeout(() => {
        document.body.classList.remove('is-printing');
      }, 1000);
      
      toast({
        title: "Print Dialog Opened",
        description: "Use your browser's print dialog to print the current page.",
      });
    } catch (error) {
      console.error("Error opening print dialog:", error);
      toast({
        title: "Error Opening Print Dialog",
        description: "There was a problem opening the print dialog. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={downloadPdfReport}
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Download PDF Report
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={printPage}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Print Page
      </Button>
    </div>
  );
};

export default PdfReport;
