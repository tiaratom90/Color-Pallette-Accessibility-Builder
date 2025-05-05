
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accessibility, Palette } from "lucide-react";

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

  const renderSwatch = (color1: string, color2: string, result: ColorResult) => (
    <div className="relative">
      <div className="aspect-[0.7] rounded-lg overflow-hidden shadow-sm border border-gray-100">
        <div className="h-2/3" style={{ backgroundColor: color1 }}>
          <div className="h-full flex items-center justify-center font-serif text-2xl" style={{ color: color2 }}>
            Aa
          </div>
        </div>
        <div className="h-1/3 bg-white p-1.5">
          <div className="text-[10px] font-mono text-center text-gray-600 mb-1">{result.ratio}:1</div>
          <div className="grid gap-[2px]">
            <div className={cn(
              "text-center py-[1px] rounded text-[8px] leading-tight",
              result.level.aaa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAA {result.level.aaa ? "✓" : "✗"}
            </div>
            <div className={cn(
              "text-center py-[1px] rounded text-[8px] leading-tight",
              result.level.aa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AA {result.level.aa ? "✓" : "✗"}
            </div>
            <div className={cn(
              "text-center py-[1px] rounded text-[8px] leading-tight",
              result.level.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AA Large {result.level.aaLarge ? "✓" : "✗"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Tabs defaultValue="by-color" className="w-full">
      <div className="flex justify-center mb-4">
        <TabsList>
          <TabsTrigger value="by-color" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>By Color</span>
          </TabsTrigger>
          <TabsTrigger value="by-accessibility" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            <span>By Accessibility</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="by-color">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results).map(([color1, combinations]) => (
            <Card key={color1} className="overflow-hidden bg-white shadow-sm">
              <div className="p-2 border-b">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border shadow-sm"
                    style={{ backgroundColor: color1 }}
                  />
                  <span className="font-mono text-xs uppercase">{color1}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {accessibilityGroups.aaa.map(({ color1, color2, result }, index) => (
                  <div key={`aaa-${index}`} className="relative">
                    <div className="text-xs font-mono mb-1 truncate">
                      <span style={{ color: color1 }}>{color1}</span> + <span style={{ color: color2 }}>{color2}</span>
                    </div>
                    {renderSwatch(color1, color2, result)}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {accessibilityGroups.aa.map(({ color1, color2, result }, index) => (
                  <div key={`aa-${index}`} className="relative">
                    <div className="text-xs font-mono mb-1 truncate">
                      <span style={{ color: color1 }}>{color1}</span> + <span style={{ color: color2 }}>{color2}</span>
                    </div>
                    {renderSwatch(color1, color2, result)}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {accessibilityGroups.aaLarge.map(({ color1, color2, result }, index) => (
                  <div key={`aaLarge-${index}`} className="relative">
                    <div className="text-xs font-mono mb-1 truncate">
                      <span style={{ color: color1 }}>{color1}</span> + <span style={{ color: color2 }}>{color2}</span>
                    </div>
                    {renderSwatch(color1, color2, result)}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {accessibilityGroups.failed.map(({ color1, color2, result }, index) => (
                  <div key={`failed-${index}`} className="relative">
                    <div className="text-xs font-mono mb-1 truncate">
                      <span style={{ color: color1 }}>{color1}</span> + <span style={{ color: color2 }}>{color2}</span>
                    </div>
                    {renderSwatch(color1, color2, result)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Results;
