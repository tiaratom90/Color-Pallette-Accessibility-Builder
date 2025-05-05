
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";

interface BlackWhiteToggleProps {
  includeBW: boolean;
  onChange: (include: boolean) => void;
}

const BlackWhiteToggle = ({ includeBW, onChange }: BlackWhiteToggleProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Include Black & White</h3>
      <RadioGroup
        defaultValue={includeBW ? "include" : "exclude"}
        onValueChange={(value) => onChange(value === "include")}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="include" id="include" />
          <Label htmlFor="include">Include</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="exclude" id="exclude" />
          <Label htmlFor="exclude">Exclude</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default BlackWhiteToggle;
