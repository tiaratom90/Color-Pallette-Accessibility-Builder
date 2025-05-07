
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Palette } from "lucide-react";
import { AccessibilityGroups, ColorResult } from "@/utils/contrastUtils";
import ByColorTab from "./results/ByColorTab";
import ByAccessibilityTab from "./results/ByAccessibilityTab";
import ExportOptions from "./results/ExportOptions";

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
  
  return <div>
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-medium dark:text-white">
        </h2>
        <ExportOptions results={results} colorNames={colorNames} />
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
