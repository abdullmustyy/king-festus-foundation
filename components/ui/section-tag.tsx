import { cn } from "@/lib/utils";

interface ISectionTagProps extends React.ComponentProps<"div"> {
    tag: string;
}

const SectionTag = ({ className, tag }: ISectionTagProps) => {
    return <div className={cn("w-fit bg-primary/10 px-2.5 py-1.5 text-sm", className)}>{tag}</div>;
};

export default SectionTag;
