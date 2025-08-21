"use client"
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import { FileIcon, X } from 'lucide-react' // For the close icon
import { useState } from 'react'


type Props = {
    endpoint: "messageFile" | "serverImage",
    value: string,
    onChange: (url?: string) => void
}
const FileUpload = ({
    onChange,
    value,
    endpoint
}: Props) => {
    const [fileType, setFileType] = useState<string>("")
    console.log(fileType)
    if (value && fileType !== "pdf") {
        return (
            <div className="relative h-32 w-32 mx-auto">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                    onClick={() => onChange("")}
                    className="absolute top-0 right-0 bg-rose-500 text-white p-1 rounded-full shadow-sm"
                    aria-label="Remove image"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }
    if (value && fileType === "pdf") {
        return (
            <div className="relative max-w-xs w-full mx-auto rounded-md bg-background/10 p-3 flex flex-col items-center gap-3">
                <FileIcon className="h-10 w-10 flex-shrink-0 fill-slate-300 stroke-slate-600" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 dark:text-slate-300 hover:underline break-words max-w-[350px]"
                    title={value}
                >
                    {value}
                </a>

                {/* Remove Button */}
                <button
                    onClick={() => onChange("")}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-sm"
                    aria-label="Remove file"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                setFileType(res?.[0]?.name?.split('.')?.pop() || "")
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log('onUploadError ', error)
            }}
        />
    )
}

export default FileUpload
