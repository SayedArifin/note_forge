"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";



const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { title, boardId, listId } = data;

    if (!title || !boardId || !listId) {
        return {
            error: "Missing fields. Faild to create list"
        }
    }
    let card;


    try {
        const list = await db.list.findUnique({
            where: {
                id: listId, board: {
                    orgId
                }
            }
        })
        if (!list) {
            return {
                error: "List not found"
            }
        }

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc" },
            select: { order: true },
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title, listId, order: newOrder
            }
        })
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

    } catch (error) {
        return {
            error: "failed to add a card"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
}

export const createCard = createSafeAction(CreateCard, handler)
