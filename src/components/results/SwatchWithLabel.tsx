
import { cn } from "@/lib/utils";
import { ColorResult } from "@/utils/contrastUtils";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwatchWithLabelProps {
  color1: string;
  color2: string;
  result: ColorResult;
  color1Name?: string;
  color2Name?: string;
}

const SwatchWithLabel = ({ color1, color2, result, color1Name, color2Name }: SwatchWithLabelProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied.`,
    });
  };

  return (
    <div className="relative group">
      <div className="text-xs font-mono mb-2">
        <div className="flex items-center gap-1 mb-0.5">
          <div 
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: color1 }}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 px-1 text-xs" 
            onClick={() => copyToClipboard(color1, "Color code")}
          >
            <span className="truncate max-w-[100px]">{color1}</span>
            <Copy className="ml-1 h-3 w-3 opacity-70" />
          </Button>
        </div>
        {color1Name && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate pl-4">
            ({color1Name})
          </div>
        )}
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded-full border"
            style={{ backgroundColor: color2 }}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 px-1 text-xs" 
            onClick={() => copyToClipboard(color2, "Color code")}
          >
            <span className="truncate max-w-[100px]">{color2}</span>
            <Copy className="ml-1 h-3 w-3 opacity-70" />
          </Button>
        </div>
        {color2Name && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate pl-4">
            ({color2Name})
          </div>
        )}
      </div>
      <div className="w-full rounded-md overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-all group-hover:shadow-md">
        {/* The text display area */}
        <div className="h-16" style={{ backgroundColor: color1 }}>
          <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: color2 }}>
            Aa
          </div>
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
          {/* Accessibility indicators */}
          <div className="flex justify-between gap-0.5">
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aaa ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}>
              AAA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aa ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}>
              AA
            </div>
            <div className={cn(
              "flex-1 text-center rounded text-[0.65rem] leading-tight font-semibold py-0.5",
              result.level.aaLarge ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}>
              AA Large
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwatchWithLabel;
