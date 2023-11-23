"use client"

import { Plus, X } from "lucide-react";
import ListWrapper from "./ListWrapper";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/FormInput";
import { useParams } from "next/navigation";
import FormButton from "@/components/form/FormButton";
import { Button } from "@/components/ui/button";

interface ListFormProps {
}

const ListForm: React.FC<ListFormProps> = () => {
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const params = useParams();
    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        })
    }

    const disableEditing = () => {
        setIsEditing(false);
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    }
    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);
    if (isEditing) {
        return (
            <ListWrapper>

                <form action="" ref={formRef} className="w-full p-3 rounded-md bg-white space-y-4 shadow-md">

                    <FormInput placeholder="Enter list title.." ref={inputRef} id="title" className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition" />
                    <input hidden value={params.boardId} name="boardId" />
                    <div className="flex items-center gap-x-1">
                        <FormButton>Add List</FormButton>
                        <Button onClick={disableEditing} size={"sm"} variant={"ghost"}><X /></Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }
    return <ListWrapper>
        <button onClick={enableEditing} className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"><Plus className="h-4 w-4 mr-2" /> Add a List</button>
    </ListWrapper>;
};

export default ListForm;