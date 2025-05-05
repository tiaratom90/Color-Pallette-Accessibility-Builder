
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorInputProps {
  value: string;
  name: string;
  onChange: (value: string) => void;
  onNameChange: (value: string) => void;
  index: number;
}

const ColorInput = ({ value, name, onChange, onNameChange, index }: ColorInputProps) => {
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Input
          value={name || `Color ${index + 1}`}
          onChange={handleNameChange}
          className="w-20 text-sm"
        />
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
          <div className="relative">
            <Input
              type="color"
              value={value || "#ffffff"}
              onChange={handleColorChange}
              className="h-10 w-10 cursor-pointer rounded-full border-2 border-gray-200 p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorInput;
