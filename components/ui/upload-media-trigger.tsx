"use client";

import ErrorToast from "@/components/ui/custom-toasts/error-toast";
import { cn } from "@/lib/utils";
import { HTMLAttributes, useCallback, useEffect, useState } from "react";
import Dropzone, { DropzoneProps, FileRejection } from "react-dropzone";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { toast } from "sonner";

type IUploadMediaTriggerProps<T extends FieldValues, K extends Path<T>> = Omit<
    HTMLAttributes<HTMLElement>,
    "children"
> & {
    accept?: DropzoneProps["accept"];
    maxSize?: DropzoneProps["maxSize"];
    disabled?: DropzoneProps["disabled"];
    multiple?: boolean;
    name: K;
    children: (props: { isDragging: boolean; file: File | null; preview: string | null }) => React.ReactNode;
};

const UploadMediaTrigger = <T extends FieldValues, K extends Path<T>>({
    accept = {
        "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxSize = 500 * 1024, // 500KB
    className,
    children,
    name,
    disabled,
}: IUploadMediaTriggerProps<T, K>) => {
    const { register, setValue, watch } = useFormContext<T>();
    const file: File = watch(name);

    const [preview, setPreview] = useState<string | null>(null);

    const handleDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (rejectedFiles.length > 0) {
                const [{ errors }] = rejectedFiles;
                const error = errors[0];

                let heading = "An error occurred";
                let description = "Please try again.";

                if (error.code === "file-invalid-type") {
                    heading = "Invalid file type";
                    description = "Please upload a valid image file (.jpg, .jpeg, .png).";
                } else if (error.code === "too-many-files") {
                    heading = "Too many files";
                    description = "Please upload only one file.";
                } else if (error.code === "file-too-large") {
                    heading = "File too large";
                    description = `File size should not be more than ${maxSize / 1024}KB.`;
                }

                toast(<ErrorToast {...{ heading, description }} />);
                return;
            }

            const acceptedFile = acceptedFiles[0];
            setValue(name, acceptedFile as T[K], { shouldValidate: true });

            // The useEffect below will handle setting the preview URL,
            // so we don't need to do it here directly.
            // Old: if (preview) { URL.revokeObjectURL(preview); } setPreview(URL.createObjectURL(file));
        },
        [maxSize, name, setValue],
    );

    useEffect(() => {
        register(name);
    }, [register, name]);

    // Effect to sync internal preview state with the form's watched file value
    const isFileInstance = file instanceof File;

    useEffect(() => {
        if (isFileInstance) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [file, isFileInstance]);

    return (
        <Dropzone accept={accept} maxFiles={1} maxSize={maxSize} onDrop={handleDrop} disabled={disabled}>
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} className={cn(className)}>
                    <input {...getInputProps()} />
                    {children({ isDragging: isDragActive, file: isFileInstance ? file : null, preview })}
                </div>
            )}
        </Dropzone>
    );
};

export default UploadMediaTrigger;
