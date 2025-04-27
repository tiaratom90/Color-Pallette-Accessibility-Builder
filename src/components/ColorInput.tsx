
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  index: number;
}

const ColorInput = ({ value, onChange, index }: ColorInputProps) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (val && !val.startsWith('#')) {
      val = '#' + val;
    }
    if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
      onChange(val);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase());
  };

  return (
    <div className="flex items-center gap-4">
      <Label htmlFor={`color-${index}`} className="w-20">
        Color {index + 1}
      </Label>
      <div className="flex-1 flex items-center gap-2">
        <Input
          id={`color-${index}`}
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#FFFFFF"
          className="font-mono"
          maxLength={7}
        />
        <Input
          type="color"
          value={value || "#ffffff"}
          onChange={handleColorChange}
          className="w-12 h-10 p-1 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ColorInput;
