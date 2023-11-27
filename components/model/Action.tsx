"use client"

import { CardWithList } from "@/types";
import { Button } from "../ui/button";
import { Copy, Trash } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { useParams } from "next/navigation";
import { useCardModal } from "@/hooks/use-card-model";
import { toast } from "sonner";

interface ActionProps {
    data: CardWithList
}


const Action: React.FC<ActionProps> = ({ data }) => {
    const params = useParams();
    const cardModel = useCardModal();
    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
        onSuccess(data) {
            toast.success(`Card "${data.title}" was successfully copied`)
            cardModel.onClose();
        }, onError(error) {
            toast.error(error)
        },
    })
    const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuccess(data) {
            toast.success(`Card "${data.title}" was successfully deleted`)
            cardModel.onClose();
        }, onError(error) {
            toast.error(error)
        },
    })
    const onCopy = () => {
        const boardId = params.boardId as string;
        executeCopyCard({ id: data.id, boardId })
    }
    const onDelete = () => {
        const boardId = params.boardId as string;
        executeDeleteCard({ id: data.id, boardId })
    }

    return <div className="space-y-2 mt-2">
        <p className="text-xs font-semibold">
            Actions
        </p>
        <Button disabled={isLoadingCopy} onClick={onCopy} variant={"gray"} size={"inline"} className="w-full justify-start"><Copy className="h-4 w-4 mr-2" />Copy</Button>
        <Button disabled={isLoadingDelete} onClick={onDelete} variant={"gray"} size={"inline"} className="w-full justify-start"><Trash className="h-4 w-4 mr-2" />Delete</Button>
    </div>;
};

export default Action;