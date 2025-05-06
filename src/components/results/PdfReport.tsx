
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const PdfReport = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPdfReport = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your report...",
      });

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
      
      // Create a temporary clone of the results for PDF generation
      const resultsContainer = document.querySelector('[role="tabpanel"][data-state="active"]');
      if (!resultsContainer) {
        throw new Error("No tab content found to generate PDF");
      }
      
      // Clone the results container to modify it for PDF output
      const clone = resultsContainer.cloneNode(true) as HTMLElement;
      
      // Apply styling to the clone to make it suitable for PDF
      clone.style.position = "absolute";
      clone.style.top = "-9999px";
      clone.style.left = "-9999px";
      clone.style.width = "900px"; // Fixed width for better scaling
      clone.style.backgroundColor = "#ffffff";
      clone.style.padding = "20px";
      clone.style.boxSizing = "border-box";
      
      // Remove interactive elements from the clone
      const buttonsToRemove = clone.querySelectorAll('button');
      buttonsToRemove.forEach(button => button.remove());
      
      // Remove any tooltip or popup elements
      const tooltipsToRemove = clone.querySelectorAll('[role="tooltip"], [data-radix-popper-content-wrapper]');
      tooltipsToRemove.forEach(tooltip => tooltip.remove());
      
      // Add the clone to the document body temporarily
      document.body.appendChild(clone);

      // Ensure all content (including colors and styles) is properly rendered in the clone
      const elements = clone.querySelectorAll('[style*="background-color"], [style*="color"]');
      elements.forEach(el => {
        const element = el as HTMLElement;
        if (element.style.backgroundColor) {
          element.setAttribute('data-bg-color', element.style.backgroundColor);
        }
        if (element.style.color) {
          element.setAttribute('data-text-color', element.style.color);
        }
      });

      try {
        // Capture the content in sections to avoid size limitations
        let currentY = 35;
        const sections = clone.querySelectorAll('.card, [class*="grid"] > div');
        
        if (sections.length === 0) {
          // If no sections found, capture the entire content
          const canvas = await html2canvas(clone, {
            scale: 1.25,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
            onclone: (clonedDoc, element) => {
              // Re-apply colors and styles in the clone
              const colorElements = element.querySelectorAll('[data-bg-color], [data-text-color]');
              colorElements.forEach(el => {
                const colorEl = el as HTMLElement;
                if (colorEl.hasAttribute('data-bg-color')) {
                  colorEl.style.backgroundColor = colorEl.getAttribute('data-bg-color') || '';
                }
                if (colorEl.hasAttribute('data-text-color')) {
                  colorEl.style.color = colorEl.getAttribute('data-text-color') || '';
                }
              });
            }
          });
          
          const imgWidth = width - 30;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (currentY + imgHeight > height - 10) {
            pdf.addPage();
            currentY = 20;
          }
          
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
        } else {
          // Process each section separately
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i] as HTMLElement;
            
            if (section.offsetHeight < 20 || section.offsetWidth < 20) continue;
            
            // Ensure headers are visible and properly styled
            const headers = section.querySelectorAll('h3');
            headers.forEach(header => {
              header.style.margin = '10px 0';
              header.style.fontSize = '16px';
              header.style.fontWeight = 'bold';
              header.style.color = '#000000';
            });
            
            // Canvas capture with improved settings
            const canvas = await html2canvas(section, {
              scale: 1.5,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
              logging: false,
              onclone: (clonedDoc, element) => {
                // Re-apply colors and styles in the clone
                const colorElements = element.querySelectorAll('[data-bg-color], [data-text-color]');
                colorElements.forEach(el => {
                  const colorEl = el as HTMLElement;
                  if (colorEl.hasAttribute('data-bg-color')) {
                    colorEl.style.backgroundColor = colorEl.getAttribute('data-bg-color') || '';
                  }
                  if (colorEl.hasAttribute('data-text-color')) {
                    colorEl.style.color = colorEl.getAttribute('data-text-color') || '';
                  }
                });
              }
            });
            
            const imgWidth = width - 30;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add a new page if needed
            if (currentY + imgHeight > height - 10) {
              pdf.addPage();
              currentY = 20;
            }
            
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 15;
          }
        }
      } catch (error) {
        console.error("Error capturing content:", error);
        throw error;
      } finally {
        // Clean up - remove the clone from the document
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      }
      
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
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={downloadPdfReport}
      disabled={isGenerating}
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF Report"}
    </Button>
  );
};

export default PdfReport;
