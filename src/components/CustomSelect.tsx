import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CustomSelect({
  onChange,
  options,
  placeholder,
  defaultOption,
}: {
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  defaultOption?: string;
}) {
  return (
    <Select
      onValueChange={onChange}
      defaultValue={defaultOption ? defaultOption : ''}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
