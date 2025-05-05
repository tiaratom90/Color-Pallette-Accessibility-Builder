import { SummaryType } from "@/utils/contrastUtils";
import WcagGuide from "../results/WcagGuide";
interface ContrastSummaryProps {
  summary: SummaryType;
}
const ContrastSummary = ({
  summary
}: ContrastSummaryProps) => {
  return <div className="mt-6 space-y-4">
      <div className="p-4 rounded-lg border bg-gray-900">
        <h3 className="font-medium mb-2">Summary</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p className="text-slate-50">{summary.aaa} of {summary.total} pass AAA</p>
          <p className="text-slate-50">{summary.aa} of {summary.total} pass AA</p>
          <p className="text-slate-50">{summary.aaLarge} of {summary.total} pass AA Large</p>
        </div>
      </div>
      
      <WcagGuide />
    </div>;
};
export default ContrastSummary;