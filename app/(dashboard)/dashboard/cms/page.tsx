import { CMSTable } from "@/components/features/tables/cms";

export default function CMSPage() {
    return (
        <>
            <div className="px-4 pt-5 lg:px-5">
                <h1 className="font-medium">Content management system</h1>
            </div>
            <CMSTable />
        </>
    );
}
