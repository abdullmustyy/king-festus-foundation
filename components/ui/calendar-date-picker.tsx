"use client";

import { format, isValid, parseISO } from "date-fns";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface CalendarDatePickerProps extends React.ComponentPropsWithoutRef<"div"> {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    label?: string;
    placeholder?: string;
    dateFormat?: string; // Custom date format, e.g., "PPP"
    disabled?: boolean;
    id?: string;
}

export function CalendarDatePicker({
    date,
    setDate,
    label,
    placeholder = "Pick a date",
    dateFormat = "PPP", // Default to "MMM dd, yyyy"
    disabled,
    id,
    className,
    ...props
}: CalendarDatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(date ? format(date, dateFormat) : "");

    React.useEffect(() => {
        // Update input value when date prop changes externally
        setInputValue(date ? format(date, dateFormat) : "");
    }, [date, dateFormat]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Attempt to parse the date from the input value
        const parsedDate = parseISO(value); // Try parsing ISO format first
        if (isValid(parsedDate)) {
            setDate(parsedDate);
        } else {
            // Fallback for other formats, could be improved with a more robust date parser
            const manualParsedDate = new Date(value);
            if (isValid(manualParsedDate)) {
                setDate(manualParsedDate);
            } else {
                setDate(undefined); // Clear date if input is invalid
            }
        }
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setOpen(false);
        setInputValue(selectedDate ? format(selectedDate, dateFormat) : "");
    };

    return (
        <div id={id} className={cn("flex flex-col gap-3", className)} {...props}>
            {label && (
                <Label htmlFor={`date-input-${id || ""}`} className="px-1">
                    {label}
                </Label>
            )}
            <div className="relative flex gap-2">
                <Input
                    id={`date-input-${id || ""}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="bg-background pr-10"
                    disabled={disabled}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id={`date-picker-button-${id || ""}`}
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 -translate-y-1/2"
                            disabled={disabled}
                        >
                            <CalendarDays className="size-5 text-[#52586680]" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
