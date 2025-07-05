"use client"
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import { X } from 'lucide-react' // For the close icon


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
    const fileType = value?.split('.').pop()

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
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log('onUploadError ', error)
            }}
        />
    )
}

export default FileUpload
