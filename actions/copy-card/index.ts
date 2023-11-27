"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";


import { InputType, ReturnType } from "./type";
import { CopyCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;
    let card;

    try {
        const CardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                }
            },
        });

        if (!CardToCopy) {
            return { error: "Card not found" };
        }

        const lastCard = await db.card.findFirst({
            where: { listId: CardToCopy.listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        // Create the list
        card = await db.card.create({
            data: {
                listId: CardToCopy.listId,
                title: `${CardToCopy.title} - Copy`,
                description: CardToCopy.description,
                order: newOrder,
            },

        });

        try {
            await createAuditLog({
                entityId: card.id,
                entityTitle: card.title,
                entityType: ENTRY_TYPE.CARD,
                action: ACTION.CREATE
            })

        } catch (error) {
            console.log(error);
        }

    } catch (e: any) {

        console.log(e.message)

    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);

