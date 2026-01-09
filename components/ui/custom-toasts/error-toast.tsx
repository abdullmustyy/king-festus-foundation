import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../button";

interface ErrorToastProps {
    heading: string;
    description: string;
}

const ErrorToast = ({ heading, description }: ErrorToastProps) => {
    return (
        <div className="flex items-start gap-3">
            <div className="shrink-0">
                <X className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
                <p className="font-semibold">{heading}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => toast.dismiss()} className="ml-auto shrink-0">
                <X className="size-4" />
            </Button>
        </div>
    );
};

export default ErrorToast;
