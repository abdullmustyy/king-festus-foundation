"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Status from "@/components/ui/icons/status";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

interface DataTableViewOptionsProps<TData> extends React.ComponentProps<typeof PopoverContent> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table, ...props }: DataTableViewOptionsProps<TData>) {
    const columns = React.useMemo(
        () => table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()),
        [table],
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    aria-label="Toggle columns"
                    role="combobox"
                    variant="outline"
                    size="sm"
                    className="group ml-auto hidden h-8 lg:flex rounded-full"
                >
                    <Status className="text-black/70 size-5" />
                    All status
                    <ChevronDown className="text-black/50 size-5 group-data-[state=open]:-rotate-180 transition-transform duration-300" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-0" {...props}>
                <Command>
                    <CommandInput placeholder="Search columns..." />
                    <CommandList>
                        <CommandEmpty>No columns found.</CommandEmpty>
                        <CommandGroup>
                            {columns.map((column) => (
                                <CommandItem
                                    key={column.id}
                                    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                                >
                                    <span className="truncate">{column.columnDef.meta?.label ?? column.id}</span>
                                    <Check
                                        className={cn(
                                            "ml-auto size-4 shrink-0",
                                            column.getIsVisible() ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
