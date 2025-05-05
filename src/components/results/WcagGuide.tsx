
import { ExternalLink } from "lucide-react";

const WcagGuide = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="text-sm font-medium mb-2">WCAG 2.1 Contrast Requirements</div>
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <div className="min-w-[40px] text-green-700 font-semibold">AAA:</div>
          <span>7:1+ (normal text), 4.5:1+ (large text)</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="min-w-[40px] text-blue-700 font-semibold">AA:</div>
          <span>4.5:1+ (normal text), 3:1+ (large text)</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="min-w-[40px] text-yellow-700 font-semibold">AA Large:</div>
          <span>3:1+ (large text only: 18pt+ or 14pt+ bold)</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <a 
          href="https://www.w3.org/TR/WCAG21/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-blue-600 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          WCAG Guidelines
        </a>
      </div>
    </div>
  );
};

export default WcagGuide;
