"use client"

import { CardWithList } from "@/types";
import { Layout } from "lucide-react";
import { FormInput } from "../form/FormInput";
import { ElementRef, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface HeaderProps {
    data: CardWithList
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    const queryClient = useQueryClient();
    const params = useParams();
    const inputRef = useRef<ElementRef<"input">>(null);
    const onBlur = () => {
        inputRef.current?.form?.requestSubmit();

    }
    const [title, setTitle] = useState(data.title)
    const { execute } = useAction(updateCard, {
        onSuccess(data) {
            queryClient.invalidateQueries({ queryKey: ["card", data.id] });
            queryClient.invalidateQueries({ queryKey: ["card-log", data.id] });
            toast.success(`Renamed to ${data.title}`)
            setTitle(data.title);
        }, onError(error) {
            toast.error(error);
        },
    })
    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const boardId = params.boardId as string
        if (title === data.title) {
            return;
        }
        execute({ title, boardId, id: data.id })

    }
    return <div className="flex flex-col  items-start gap-x-3 mb-6 w-full">
        <div className="flex">
            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <form action={onSubmit}>
                <FormInput ref={inputRef} onBlur={onBlur} id="title" defaultValue={title} className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate" />
            </form>
        </div>
        <p className="text-sm text-muted-foreground">
            in list <span className="underline">{data.list?.title}</span>
        </p>
    </div>;
};

export default Header;