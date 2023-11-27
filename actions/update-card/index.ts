"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { id, boardId, ...values } = data;


    let card;
    try {

        card = await db.card.update({
            where: {
                id, list: {
                    board: {
                        orgId,
                    }
                }
            },
            data: {
                ...values
            }
        }
        )
        try {
            await createAuditLog({
                entityId: card.id,
                entityTitle: card.title,
                entityType: ENTRY_TYPE.CARD,
                action: ACTION.UPDATE
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        return {
            error: "failed to update board"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card }
}

export const updateCard = createSafeAction(UpdateCard, handler)
