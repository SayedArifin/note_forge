"use client"

import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormTextarea } from "../form/FromTextarena";
import FormButton from "../form/FormButton";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface DescriptionProps {
    data: CardWithList
}

const Description: React.FC<DescriptionProps> = ({ data }) => {
    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            })
            queryClient.invalidateQueries({ queryKey: ["card-log", data.id] });
            toast.success(`Card ${data.title} updated`)
            disableEditing()
        },
        onError(error) {
            toast.error(error)
        },
    })
    const queryClient = useQueryClient();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        })
    }
    const disableEditing = () => {
        setIsEditing(false);
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    }

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);
    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;
        execute({ description, boardId, id: data.id })
    }
    return <div className="flex  items-start gap-x-3 w-full"><AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
        <div className="w-full">
            <p className="font-bold text-neutral-700 mb-2">Description</p>
            {isEditing ? <form action={onSubmit}>
                <FormTextarea ref={textareaRef} id="description" className="w-full mt-2" placeholder="Add a more detailed description" defaultValue={data.description || undefined} errors={fieldErrors} />
                <div className="flex items-center gap-x-2 my-2">
                    <FormButton>Save</FormButton>
                    <Button onClick={disableEditing} variant={"ghost"} size={"sm"}>Cancel</Button>
                </div>
            </form> : <div onClick={enableEditing} className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md " role="button">{data.description || "Add a more detailed description"}</div>}
        </div></div>;
};

export default Description;