"use client"

import { useCardModal } from "@/hooks/use-card-model";
import { Dialog, DialogContent } from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fatcher";
import Header from "./Header";
import { Skeleton } from "../ui/skeleton";

interface CardModelProps {
}

const CardModel: React.FC<CardModelProps> = () => {

    const id = useCardModal((state) => state.id);
    const isOpen = useCardModal((state) => state.isOpen);
    const onClose = useCardModal((state) => state.onClose);
    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
    })
    return <Dialog open={isOpen} onOpenChange={onClose}>

        <DialogContent>{!cardData ? (<div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
            <div className="">
                <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
                <Skeleton className="w-12 h-4 bg-neutral-200" />
            </div>
        </div>) : <Header data={cardData} />}</DialogContent>
    </Dialog>;
};

export default CardModel;