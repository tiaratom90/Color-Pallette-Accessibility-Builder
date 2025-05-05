
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Palette, FileDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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

  const downloadReport = () => {
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

  const renderSwatch = (color1: string, color2: string, result: ColorResult) => (
    <div className="relative">
      <div className="aspect-square h-24 rounded-md overflow-hidden shadow-sm border border-gray-100">
        <div className="h-3/4" style={{ backgroundColor: color1 }}>
          <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: color2 }}>
            Aa
          </div>
        </div>
        <div className="h-1/4 bg-white p-1">
          <div className="text-[8px] font-mono text-center text-gray-600">{result.ratio}:1</div>
          <div className="flex justify-between gap-0.5 px-0.5">
            <div className={cn(
              "flex-1 text-center rounded text-[6px] leading-tight",
              result.level.aaa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[6px] leading-tight",
              result.level.aa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[6px] leading-tight",
              result.level.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              AAL
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const accessibilityLegend = (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">WCAG 2.1 Contrast Requirements</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={downloadReport}
          >
            <FileDown className="h-3.5 w-3.5 mr-1" />
            Download Report
          </Button>
          <a 
            href="https://www.w3.org/TR/WCAG21/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-blue-600 hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            WCAG 2.1 Guidelines
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">AAA</Badge>
          <span>7:1+ (normal text), 4.5:1+ (large text)</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100">AA</Badge>
          <span>4.5:1+ (normal text), 3:1+ (large text)</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">AA Large</Badge>
          <span>3:1+ (18pt+ or 14pt+ bold text)</span>
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
            <Eye className="h-4 w-4" />
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
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2">
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
        {accessibilityLegend}
        
        <div className="space-y-6">
          {accessibilityGroups.aaa.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-700 border-b pb-1">
                Passing AAA Level ({accessibilityGroups.aaa.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {accessibilityGroups.aaa.map(({ color1, color2, result }, index) => (
                  <TooltipProvider key={`aaa-${index}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          {renderSwatch(color1, color2, result)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-mono">
                        <div>{color1} + {color2}</div>
                        <div>Ratio: {result.ratio}:1</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}

          {accessibilityGroups.aa.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-700 border-b pb-1">
                Passing AA Level ({accessibilityGroups.aa.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {accessibilityGroups.aa.map(({ color1, color2, result }, index) => (
                  <TooltipProvider key={`aa-${index}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          {renderSwatch(color1, color2, result)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-mono">
                        <div>{color1} + {color2}</div>
                        <div>Ratio: {result.ratio}:1</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}

          {accessibilityGroups.aaLarge.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-yellow-700 border-b pb-1">
                Passing AA Large Only ({accessibilityGroups.aaLarge.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {accessibilityGroups.aaLarge.map(({ color1, color2, result }, index) => (
                  <TooltipProvider key={`aaLarge-${index}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          {renderSwatch(color1, color2, result)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-mono">
                        <div>{color1} + {color2}</div>
                        <div>Ratio: {result.ratio}:1</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}

          {accessibilityGroups.failed.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-700 border-b pb-1">
                Failed All Levels ({accessibilityGroups.failed.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {accessibilityGroups.failed.map(({ color1, color2, result }, index) => (
                  <TooltipProvider key={`failed-${index}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          {renderSwatch(color1, color2, result)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-mono">
                        <div>{color1} + {color2}</div>
                        <div>Ratio: {result.ratio}:1</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
