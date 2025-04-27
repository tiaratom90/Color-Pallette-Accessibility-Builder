
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(results).map(([color1, combinations]) => (
        <Card key={color1} className="overflow-hidden bg-white shadow-sm">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border shadow-sm"
                style={{ backgroundColor: color1 }}
              />
              <span className="font-mono text-xs uppercase">{color1}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-3">
            {Object.entries(combinations).map(([color2, { ratio, level }]) => (
              <div key={color2} className="relative group">
                <div className="aspect-[0.7] rounded-lg overflow-hidden shadow-md border border-gray-100">
                  <div className="h-3/4" style={{ backgroundColor: color1 }}>
                    <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: color2 }}>
                      Aa
                    </div>
                  </div>
                  <div className="h-1/4 bg-white p-1.5 space-y-0.5">
                    <div className="text-[10px] font-mono text-center text-gray-600">{ratio}:1</div>
                    <div className="flex flex-col gap-0.5">
                      <div className={cn(
                        "text-center py-0.5 rounded text-[8px]",
                        level.aaa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        AAA {level.aaa ? "✓" : "✗"}
                      </div>
                      <div className={cn(
                        "text-center py-0.5 rounded text-[8px]",
                        level.aa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        AA {level.aa ? "✓" : "✗"}
                      </div>
                      <div className={cn(
                        "text-center py-0.5 rounded text-[8px]",
                        level.aaLarge ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        AA Large {level.aaLarge ? "✓" : "✗"}
                      </div>
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
