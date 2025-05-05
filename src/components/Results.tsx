
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Palette } from "lucide-react";
import { AccessibilityGroups, ColorResult } from "@/utils/contrastUtils";
import ByColorTab from "./results/ByColorTab";
import ByAccessibilityTab from "./results/ByAccessibilityTab";
import PdfReport from "./results/PdfReport";

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

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-medium">Results</h2>
        <PdfReport />
      </div>
    
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
          <ByColorTab results={results} />
        </TabsContent>

        <TabsContent value="by-accessibility">
          <ByAccessibilityTab accessibilityGroups={accessibilityGroups} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
