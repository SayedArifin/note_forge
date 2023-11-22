"use client"

import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import FormError from "./FormError";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[]> | undefined;
}

const FormPicker: React.FC<FormPickerProps> = ({ id, errors }) => {
    const { pending } = useFormStatus();
    const [images, setImages] = useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState(null);
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"], count: 9,
                })
                if (result && result.response) {
                    const newImages = (result.response as Array<Record<string, any>>);
                    setImages(newImages);
                } else {
                    console.log("faild to get images from unsplash")
                }
            } catch (error) {
                console.log(error)
                setImages([defaultImages])
            } finally {
                setIsLoading(false)
            }
        }
        fetchImage()
    }, [])

    if (isLoading) {
        return (
            <div className="p-6 items-center justify-center">
                <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
            </div>
        )
    }
    return <div className="relative ">
        <div className="grid grid-cols-3 gap-2 mb-2">
            {images.map((image) => (
                <div onClick={() => {
                    if (pending) return;
                    setSelectedImageId(image.id);
                }} key={image.id} className={cn("cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted", pending && "opacity-40 hover:opacity-40 cursor-auto")}>
                    <input type="radio" name={id} id={id} className="hidden" checked={selectedImageId === image.id} disabled={pending} value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`} />

                    <Image fill alt="image" src={image.urls.thumb} className="object-cover rounded-sm" />
                    {selectedImageId === image.id && (
                        <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                        </div>
                    )}
                    <Link href={image.links.html} target="_blank" className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50">{image.user.name}</Link>
                </div>
            ))}
        </div>
        <FormError id="image" errors={errors} />
    </div>;
};

export default FormPicker;