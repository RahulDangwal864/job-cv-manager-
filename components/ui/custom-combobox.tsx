"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type Option = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  widthClass?: string;
  fieldLabel?: string;
}

export function Combobox({
  options,
  placeholder = "Select an option...",
  value,
  onChange,
  className = "",
  widthClass = "w-48",
  fieldLabel,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="flex flex-col gap-2">
      {fieldLabel && <Label className="text-base">{fieldLabel}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`${widthClass} justify-between ${className}`}
          >
            {selected}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${widthClass} p-0`}>
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(val) => {
                      onChange(val);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
