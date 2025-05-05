
import { SummaryType } from "@/utils/contrastUtils";
import WcagGuide from "../results/WcagGuide";

interface ContrastSummaryProps {
  summary: SummaryType;
}

const ContrastSummary = ({ summary }: ContrastSummaryProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="font-medium mb-2">Summary</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{summary.aaa} of {summary.total} pass AAA</p>
          <p>{summary.aa} of {summary.total} pass AA</p>
          <p>{summary.aaLarge} of {summary.total} pass AA Large</p>
        </div>
      </div>
      
      <WcagGuide />
    </div>
  );
};

export default ContrastSummary;
