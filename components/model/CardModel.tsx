"use client"

import { useCardModal } from "@/hooks/use-card-model";
import { Dialog, DialogContent } from "../ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fatcher";
import Header from "./Header";
import { Skeleton } from "../ui/skeleton";
import Description from "./Description";
import Action from "./Action";
import { AuditLog } from "@prisma/client";
import { Activity } from "./Activity";

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
    const { data: auditLogData } = useQuery<AuditLog[]>({
        queryKey: ["card-log", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`),
    })

    return <Dialog open={isOpen} onOpenChange={onClose}>

        <DialogContent>{!cardData ? (<div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
            <div className="">
                <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
                <Skeleton className="w-12 h-4 bg-neutral-200" />
            </div>
        </div>) : <Header data={cardData} />}
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                <div className="col-span-3">
                    <div className="w-full space-y-6">
                        {!cardData ? (
                            <div className="flex items-start gap-x-3 w-full">
                                <Skeleton className="h-6 w-6 bg-neutral-200" />
                                <div className="w-full">
                                    <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                                    <Skeleton className="w-full h-[78px] bg-neutral-200" />
                                </div>
                            </div>
                        ) : <Description data={cardData} />
                        }
                    </div>
                </div>
                {!cardData ? (<div className="space-y-2 mt-2">
                    <Skeleton className="w-20 h-4 bg-neutral-200" />
                    <Skeleton className="w-full h-8 bg-neutral-200" />
                    <Skeleton className="w-full h-8 bg-neutral-200" />
                </div>) : <Action data={cardData} />}

            </div>
            {!auditLogData ? <Activity.Skeleton /> : <Activity items={auditLogData} />}
        </DialogContent>
    </Dialog>;
};

export default CardModel;