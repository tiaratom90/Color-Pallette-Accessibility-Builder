import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Palette, FileDown } from "lucide-react";
import { AccessibilityGroups, ColorResult } from "@/utils/contrastUtils";
import ByColorTab from "./results/ByColorTab";
import ByAccessibilityTab from "./results/ByAccessibilityTab";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
interface ResultsProps {
  results: Record<string, Record<string, ColorResult>>;
  colorNames: string[];
}
const Results = ({
  results,
  colorNames
}: ResultsProps) => {
  if (Object.keys(results).length === 0) {
    return <Card className="p-6 dark:bg-gray-800">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="mb-4">
            <Palette className="mx-auto h-12 w-12 opacity-30" />
          </div>
          <p>Enter colors and click "Check Contrast" to see results</p>
          <p className="text-sm mt-2">Try using the "Suggest Palette" button to get started with a pre-defined color scheme</p>
        </div>
      </Card>;
  }

  // Transform results for accessibility view
  const accessibilityGroups = {
    aaa: [] as Array<{
      color1: string;
      color2: string;
      result: ColorResult;
    }>,
    aa: [] as Array<{
      color1: string;
      color2: string;
      result: ColorResult;
    }>,
    aaLarge: [] as Array<{
      color1: string;
      color2: string;
      result: ColorResult;
    }>,
    failed: [] as Array<{
      color1: string;
      color2: string;
      result: ColorResult;
    }>
  };
  Object.entries(results).forEach(([color1, combinations]) => {
    Object.entries(combinations).forEach(([color2, result]) => {
      if (result.level.aaa) {
        accessibilityGroups.aaa.push({
          color1,
          color2,
          result
        });
      } else if (result.level.aa) {
        accessibilityGroups.aa.push({
          color1,
          color2,
          result
        });
      } else if (result.level.aaLarge) {
        accessibilityGroups.aaLarge.push({
          color1,
          color2,
          result
        });
      } else {
        accessibilityGroups.failed.push({
          color1,
          color2,
          result
        });
      }
    });
  });
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
        const imgHeight = byColorCanvas.height * width / byColorCanvas.width;
        pdf.addImage(byColorImg, 'PNG', 10, 45, width - 20, imgHeight * 0.5);

        // Add By Accessibility section on a new page if needed
        if (45 + imgHeight * 0.5 + 60 > height) {
          pdf.addPage();
          pdf.setFontSize(16);
          pdf.text("By Accessibility View", 14, 20);
          const byAccessImg = byAccessibilityCanvas.toDataURL('image/png');
          const accessImgHeight = byAccessibilityCanvas.height * width / byAccessibilityCanvas.width;
          pdf.addImage(byAccessImg, 'PNG', 10, 25, width - 20, accessImgHeight * 0.5);
        } else {
          const yPosition = 45 + imgHeight * 0.5 + 20;
          pdf.setFontSize(16);
          pdf.text("By Accessibility View", 14, yPosition);
          const byAccessImg = byAccessibilityCanvas.toDataURL('image/png');
          const accessImgHeight = byAccessibilityCanvas.height * width / byAccessibilityCanvas.width;
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
  return <div>
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-medium dark:text-white">
      </h2>
        <Button variant="secondary" onClick={downloadPdfReport} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>
    
      <Tabs defaultValue="by-color" className="w-full">
        <div className="flex justify-center mb-4">
          <TabsList className="bg-white dark:bg-gray-800">
            <TabsTrigger value="by-color" className="flex items-center gap-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
              <Palette className="h-4 w-4" />
              <span>By Color</span>
            </TabsTrigger>
            <TabsTrigger value="by-accessibility" className="flex items-center gap-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
              <Eye className="h-4 w-4" />
              <span>By Accessibility</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="by-color">
          <ByColorTab results={results} colorNames={colorNames} />
        </TabsContent>

        <TabsContent value="by-accessibility">
          <ByAccessibilityTab accessibilityGroups={accessibilityGroups} colorNames={colorNames} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default Results;