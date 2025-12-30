"use client";

import {
    type ColumnFiltersState,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type TableOptions,
    type TableState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

interface UseDataTableProps<TData>
    extends Omit<
        TableOptions<TData>,
        "state" | "getCoreRowModel" | "manualFiltering" | "manualPagination" | "manualSorting"
    > {
    initialState?: Partial<TableState>;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
    const { columns, initialState, ...tableProps } = props;

    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(initialState?.rowSelection ?? {});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
        initialState?.columnVisibility ?? {},
    );
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialState?.columnFilters ?? []);
    const [sorting, setSorting] = React.useState<SortingState>(initialState?.sorting ?? []);
    const [pagination, setPagination] = React.useState<PaginationState>(
        initialState?.pagination ?? {
            pageIndex: 0,
            pageSize: 10,
        },
    );

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        ...tableProps,
        columns,
        state: {
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });

    return { table };
}
