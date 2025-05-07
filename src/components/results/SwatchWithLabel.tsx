
import { cn } from "@/lib/utils";
import { ColorResult } from "@/utils/contrastUtils";
import { useToast } from "@/hooks/use-toast";
import { Copy, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ColorSuggestion from "./ColorSuggestion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface SwatchWithLabelProps {
  color1: string;
  color2: string;
  result: ColorResult;
  color1Name?: string;
  color2Name?: string;
  onColorUpdate?: (originalColor: string, newColor: string) => void;
}

const SwatchWithLabel = ({ 
  color1, 
  color2, 
  result, 
  color1Name, 
  color2Name, 
  onColorUpdate 
}: SwatchWithLabelProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied.`,
    });
  };

  // Format the color display as "Color Name (HEX)"
  const formatColorDisplay = (name: string, hex: string) => {
    return `${name} (${hex})`;
  };

  const handleApplySuggestion = (newColor1: string, newColor2: string) => {
    if (onColorUpdate) {
      // If background color changed
      if (newColor1 !== color1) {
        onColorUpdate(color1, newColor1);
      }
      
      // If text color changed
      if (newColor2 !== color2) {
        onColorUpdate(color2, newColor2);
      }
    }
  };
  
  // Don't show adjustment option if already AAA compliant
  const canBeImproved = !result.level.aaa && onColorUpdate;

  return (
    <div className="relative group">
      <div className="text-xs mb-2">
        <div className="flex items-center gap-1 mb-0.5">
          <div 
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: color1 }}
          />
          <span className="font-medium truncate max-w-[200px]">
            {formatColorDisplay(color1Name || "", color1)}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 px-1 text-xs ml-1" 
              onClick={() => copyToClipboard(color1, "Color code")}
            >
              <Copy className="h-3 w-3 opacity-70" />
            </Button>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: color2 }}
          />
          <span className="font-medium truncate max-w-[200px]">
            {formatColorDisplay(color2Name || "", color2)}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 px-1 text-xs ml-1" 
              onClick={() => copyToClipboard(color2, "Color code")}
            >
              <Copy className="h-3 w-3 opacity-70" />
            </Button>
          </span>
        </div>
      </div>
      <div className="w-full rounded-md overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-all group-hover:shadow-md">
        {/* The text display area */}
        <div className="h-16 relative" style={{ backgroundColor: color1 }}>
          <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: color2 }}>
            Aa
          </div>
          
          {/* Accessibility improvement button (only if not AAA and can be updated) */}
          {canBeImproved && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute bottom-1 right-1 h-6 w-6 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full" 
                >
                  <Settings2 className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3">
                <ColorSuggestion 
                  color1={color1} 
                  color2={color2} 
                  result={result} 
                  onApplySuggestion={handleApplySuggestion} 
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
        {/* Contrast ratio and indicators */}
        <div className="bg-white dark:bg-gray-800 p-2">
          <div className="text-xs font-mono text-center text-gray-600 dark:text-gray-300 mb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-1 text-xs" 
              onClick={() => copyToClipboard(`${result.ratio}:1`, "Contrast ratio")}
            >
              {result.ratio}:1 <Copy className="ml-1 h-3 w-3 opacity-70" />
            </Button>
          </div>
          
          {/* Accessibility indicators with popovers */}
          <div className="flex justify-between gap-0.5">
            <Popover>
              <PopoverTrigger asChild>
                <div className={cn(
                  "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5 cursor-pointer",
                  result.level.aaa ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}>
                  AAA
                </div>
              </PopoverTrigger>
              {!result.level.aaa && canBeImproved && (
                <PopoverContent className="w-72 p-3">
                  <ColorSuggestion 
                    color1={color1} 
                    color2={color2} 
                    result={result} 
                    onApplySuggestion={handleApplySuggestion} 
                    targetLevel="AAA"
                  />
                </PopoverContent>
              )}
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <div className={cn(
                  "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5 cursor-pointer",
                  result.level.aa ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}>
                  AA
                </div>
              </PopoverTrigger>
              {!result.level.aa && canBeImproved && (
                <PopoverContent className="w-72 p-3">
                  <ColorSuggestion 
                    color1={color1} 
                    color2={color2} 
                    result={result} 
                    onApplySuggestion={handleApplySuggestion} 
                    targetLevel="AA"
                  />
                </PopoverContent>
              )}
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <div className={cn(
                  "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5 cursor-pointer",
                  result.level.aaLarge ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}>
                  AA Large
                </div>
              </PopoverTrigger>
              {!result.level.aaLarge && canBeImproved && (
                <PopoverContent className="w-72 p-3">
                  <ColorSuggestion 
                    color1={color1} 
                    color2={color2} 
                    result={result} 
                    onApplySuggestion={handleApplySuggestion} 
                    targetLevel="AA Large"
                  />
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwatchWithLabel;
