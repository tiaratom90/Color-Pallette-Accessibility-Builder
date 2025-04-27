
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(results).map(([color1, combinations]) => (
        <Card key={color1} className="overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color1 }}
              />
              <span className="font-mono text-sm">{color1}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
            {Object.entries(combinations).map(([color2, { ratio, level }]) => (
              <div key={color2} className="space-y-2">
                <div className="h-20 rounded-lg overflow-hidden flex flex-col">
                  <div 
                    className="flex-1 flex items-center justify-center text-lg font-serif"
                    style={{ backgroundColor: color1, color: color2 }}
                  >
                    Aa
                  </div>
                  <div 
                    className="flex-1 flex items-center justify-center text-lg font-serif"
                    style={{ backgroundColor: color2, color: color1 }}
                  >
                    Aa
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-mono text-center">{ratio}:1</div>
                  <div className="space-y-0.5">
                    <div className={cn(
                      "text-center py-0.5 rounded text-xs",
                      level.aaa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      AAA {level.aaa ? "✓" : "✗"}
                    </div>
                    <div className={cn(
                      "text-center py-0.5 rounded text-xs",
                      level.aa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      AA {level.aa ? "✓" : "✗"}
                    </div>
                    <div className={cn(
                      "text-center py-0.5 rounded text-xs",
                      level.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      AA Large {level.aaLarge ? "✓" : "✗"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Results;
