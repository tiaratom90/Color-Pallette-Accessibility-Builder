
import React from "react";
import { Button } from "@/components/ui/button";
import { SummaryType, ColorResult } from "@/utils/contrastUtils";
import { FileText, Download } from "lucide-react";

interface TextReportProps {
  results: Record<string, Record<string, ColorResult>>;
  colorNames: string[];
  summary: SummaryType | null;
}

const TextReport = ({ results, colorNames, summary }: TextReportProps) => {
  // Find color name by hex color
  const getColorName = (hexColor: string): string => {
    // Special handling for black and white
    if (hexColor === '#FFFFFF') return 'White';
    if (hexColor === '#000000') return 'Black';
    
    const index = Object.values(results).findIndex((_, i) => 
      Object.keys(results)[i] === hexColor
    );
    
    return index !== -1 && colorNames[index] ? colorNames[index] : `Color ${index + 1}`;
  };

  const generateTextReport = () => {
    const reportLines: string[] = [];
    
    // Add title and date
    reportLines.push("COLOR CONTRAST ACCESSIBILITY REPORT");
    reportLines.push(`Generated on: ${new Date().toLocaleDateString()}`);
    reportLines.push("");
    
    // Add summary information
    if (summary) {
      reportLines.push("SUMMARY");
      reportLines.push(`Total combinations tested: ${summary.total}`);
      reportLines.push(`AAA compliant combinations: ${summary.aaa} (${Math.round((summary.aaa / summary.total) * 100)}%)`);
      reportLines.push(`AA compliant combinations: ${summary.aa} (${Math.round((summary.aa / summary.total) * 100)}%)`);
      reportLines.push(`AA Large Text compliant combinations: ${summary.aaLarge} (${Math.round((summary.aaLarge / summary.total) * 100)}%)`);
      reportLines.push("");
    }
    
    // Add color palette information
    reportLines.push("COLOR PALETTE");
    Object.keys(results).forEach(color => {
      reportLines.push(`${getColorName(color)}: ${color}`);
    });
    
    if (results['#FFFFFF'] === undefined && results['#000000'] === undefined) {
      reportLines.push("White: #FFFFFF (included in tests)");
      reportLines.push("Black: #000000 (included in tests)");
    }
    
    reportLines.push("");
    
    // Add detailed contrast information
    reportLines.push("CONTRAST RATIO DETAILS");
    
    Object.entries(results).forEach(([color1, combinations]) => {
      reportLines.push(`\n${getColorName(color1)} (${color1})`);
      
      // Sort combinations by contrast ratio (highest first)
      const sortedCombinations = Object.entries(combinations)
        .sort((a, b) => parseFloat(b[1].ratio) - parseFloat(a[1].ratio));
      
      sortedCombinations.forEach(([color2, result]) => {
        const accessibility = [];
        if (result.level.aaa) accessibility.push("AAA");
        else if (result.level.aa) accessibility.push("AA");
        else if (result.level.aaLarge) accessibility.push("AA Large");
        else accessibility.push("Fails");
        
        reportLines.push(`  with ${getColorName(color2)} (${color2}): ${result.ratio}:1 - ${accessibility.join(", ")}`);
      });
    });
    
    return reportLines.join("\n");
  };
  
  const downloadTextReport = () => {
    const report = generateTextReport();
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "contrast-report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex justify-end">
      <Button 
        variant="outline"
        size="sm"
        onClick={downloadTextReport}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        <span>Download Text Report</span>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TextReport;
