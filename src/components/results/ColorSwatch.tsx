
import { cn } from "@/lib/utils";
import { ColorResult } from "@/utils/contrastUtils";

interface ColorSwatchProps {
  color1: string;
  color2: string;
  result: ColorResult;
}

const ColorSwatch = ({ color1, color2, result }: ColorSwatchProps) => {
  return (
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
};

export default ColorSwatch;
