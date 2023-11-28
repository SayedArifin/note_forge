"use client"

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormInput } from "./FormInput";
import FormButton from "./FormButton";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import FormPicker from "./FormPicker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-model";

interface FormPopOverProps {
    children: React.ReactNode;
    align?: "start" | "center" | "end";
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;
}

const FormPopOver: React.FC<FormPopOverProps> = ({ children, align, sideOffset = 0, side = "bottom" }) => {
    const proModel = useProModal();
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null)
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success(`Board Successfully Created With the Name "${data.title}"`)
            closeRef.current?.click();
            router.push(`/board/${data.id}`)
        },
        onError: (error) => {

            toast.error(error)
            proModel.onOpen();
        },
    })
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;
        execute({ title, image })

    }
    return <Popover>
        <PopoverTrigger asChild>
            {children}
        </PopoverTrigger>
        <PopoverContent align={align} className="w-80 pt-3" side={side} sideOffset={sideOffset}>
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">Create Board</div>
            <PopoverClose ref={closeRef} asChild>
                <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant={"ghost"}>
                    <X className="h-4 w-4" />
                </Button>
            </PopoverClose>
            <form action={onSubmit} className="space-y-4">
                <FormPicker id="image" errors={fieldErrors} />
                <div className="space-y-4">
                    <FormInput id="title" label="Board Title" type="text" errors={fieldErrors} />
                </div>
                <FormButton className="w-full">Create</FormButton>
            </form>
        </PopoverContent>
    </Popover>;
};

export default FormPopOver;