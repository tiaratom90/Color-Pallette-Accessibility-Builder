
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Palette, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Level {
  aaa: boolean;
  aa: boolean;
  aaLarge: boolean;
}

interface ColorResult {
  ratio: string;
  level: Level;
}

interface ResultsProps {
  results: Record<string, Record<string, ColorResult>>;
}

const Results = ({ results }: ResultsProps) => {
  if (Object.keys(results).length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Enter colors and click "Check Contrast" to see results
        </div>
      </Card>
    );
  }

  // Transform results for accessibility view
  const accessibilityGroups = {
    aaa: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
    aa: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
    aaLarge: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
    failed: [] as Array<{ color1: string; color2: string; result: ColorResult }>,
  };

  Object.entries(results).forEach(([color1, combinations]) => {
    Object.entries(combinations).forEach(([color2, result]) => {
      if (result.level.aaa) {
        accessibilityGroups.aaa.push({ color1, color2, result });
      } else if (result.level.aa) {
        accessibilityGroups.aa.push({ color1, color2, result });
      } else if (result.level.aaLarge) {
        accessibilityGroups.aaLarge.push({ color1, color2, result });
      } else {
        accessibilityGroups.failed.push({ color1, color2, result });
      }
    });
  });

  const downloadTextReport = () => {
    // Generate report content
    let content = "# Color Contrast Accessibility Report\n\n";
    content += "Generated on: " + new Date().toLocaleString() + "\n\n";
    
    // Add legends
    content += "## WCAG 2.1 Contrast Requirements\n";
    content += "- AAA: Contrast ratio of at least 7:1 for normal text and 4.5:1 for large text\n";
    content += "- AA: Contrast ratio of at least 4.5:1 for normal text and 3:1 for large text\n";
    content += "- AA Large: Contrast ratio of at least 3:1 for large text (18pt+ or 14pt+ bold)\n\n";
    
    // AAA section
    if (accessibilityGroups.aaa.length > 0) {
      content += "## Passing AAA Level (" + accessibilityGroups.aaa.length + ")\n";
      accessibilityGroups.aaa.forEach(({ color1, color2, result }) => {
        content += `- ${color1} + ${color2}: ${result.ratio}:1\n`;
      });
      content += "\n";
    }
    
    // AA section
    if (accessibilityGroups.aa.length > 0) {
      content += "## Passing AA Level (" + accessibilityGroups.aa.length + ")\n";
      accessibilityGroups.aa.forEach(({ color1, color2, result }) => {
        content += `- ${color1} + ${color2}: ${result.ratio}:1\n`;
      });
      content += "\n";
    }
    
    // AA Large section
    if (accessibilityGroups.aaLarge.length > 0) {
      content += "## Passing AA Large Only (" + accessibilityGroups.aaLarge.length + ")\n";
      accessibilityGroups.aaLarge.forEach(({ color1, color2, result }) => {
        content += `- ${color1} + ${color2}: ${result.ratio}:1\n`;
      });
      content += "\n";
    }
    
    // Failed section
    if (accessibilityGroups.failed.length > 0) {
      content += "## Failed All Levels (" + accessibilityGroups.failed.length + ")\n";
      accessibilityGroups.failed.forEach(({ color1, color2, result }) => {
        content += `- ${color1} + ${color2}: ${result.ratio}:1\n`;
      });
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contrast-accessibility-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      // Fallback to text report if PDF fails
      downloadTextReport();
    }
  };

  // Updated swatch rendering to show hex color info and make swatches more rectangular
  const renderSwatch = (color1: string, color2: string, result: ColorResult) => (
    <div className="relative">
      <div className="w-full rounded-md overflow-hidden shadow-sm border border-gray-100">
        {/* The text display area */}
        <div className="h-16" style={{ backgroundColor: color1 }}>
          <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: color2 }}>
            Aa
          </div>
        </div>
        {/* Contrast ratio display */}
        <div className="bg-white p-2">
          <div className="text-xs font-mono text-center text-gray-600 mb-1">{result.ratio}:1</div>
          {/* Second color indicator */}
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: color2 }}
            />
            <span className="font-mono text-xs truncate">{color2}</span>
          </div>
          {/* Accessibility indicators */}
          <div className="flex justify-between gap-0.5">
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aaa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAL
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // New function to render swatch with pairing label for accessibility tabs
  const renderSwatchWithLabel = (color1: string, color2: string, result: ColorResult) => (
    <div className="flex flex-col">
      <div className="text-xs font-mono mb-1 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <div 
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: color1 }}
          />
          <span className="truncate">{color1}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div 
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: color2 }}
          />
          <span className="truncate">{color2}</span>
        </div>
      </div>
      <div className="w-full rounded-md overflow-hidden shadow-sm border border-gray-100">
        {/* The text display area */}
        <div className="h-16" style={{ backgroundColor: color1 }}>
          <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: color2 }}>
            Aa
          </div>
        </div>
        {/* Contrast ratio and indicators */}
        <div className="bg-white p-2">
          <div className="text-xs font-mono text-center text-gray-600 mb-1">{result.ratio}:1</div>
          {/* Accessibility indicators */}
          <div className="flex justify-between gap-0.5">
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aaa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAL
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Tabs defaultValue="by-color" className="w-full">
        <div className="flex justify-center mb-4">
          <TabsList>
            <TabsTrigger value="by-color" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>By Color</span>
            </TabsTrigger>
            <TabsTrigger value="by-accessibility" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>By Accessibility</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="by-color">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(results).map(([color1, combinations]) => (
              <Card key={color1} className="overflow-hidden bg-white shadow-sm">
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: color1 }}
                    />
                    <span className="font-mono text-sm">{color1}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3">
                  {Object.entries(combinations).map(([color2, result]) => (
                    <div key={color2}>
                      {renderSwatch(color1, color2, result)}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-accessibility">
          <div className="space-y-6">
            {accessibilityGroups.aaa.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-green-700 border-b pb-1">
                  Passing AAA Level ({accessibilityGroups.aaa.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {accessibilityGroups.aaa.map(({ color1, color2, result }, index) => (
                    <div key={`aaa-${index}`} className="relative">
                      {renderSwatchWithLabel(color1, color2, result)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {accessibilityGroups.aa.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-700 border-b pb-1">
                  Passing AA Level ({accessibilityGroups.aa.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {accessibilityGroups.aa.map(({ color1, color2, result }, index) => (
                    <div key={`aa-${index}`} className="relative">
                      {renderSwatchWithLabel(color1, color2, result)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {accessibilityGroups.aaLarge.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-yellow-700 border-b pb-1">
                  Passing AA Large Only ({accessibilityGroups.aaLarge.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {accessibilityGroups.aaLarge.map(({ color1, color2, result }, index) => (
                    <div key={`aaLarge-${index}`} className="relative">
                      {renderSwatchWithLabel(color1, color2, result)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {accessibilityGroups.failed.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-red-700 border-b pb-1">
                  Failed All Levels ({accessibilityGroups.failed.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {accessibilityGroups.failed.map(({ color1, color2, result }, index) => (
                    <div key={`failed-${index}`} className="relative">
                      {renderSwatchWithLabel(color1, color2, result)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadPdfReport}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
};

export default Results;
