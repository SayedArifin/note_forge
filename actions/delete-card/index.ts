"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";


import { InputType, ReturnType } from "./type";
import { DeleteCard } from "./schema";
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
        card = await db.card.delete({ where: { id, list: { board: { orgId } } } })

        try {
            await createAuditLog({
                entityId: card.id,
                entityTitle: card.title,
                entityType: ENTRY_TYPE.CARD,
                action: ACTION.DELETE
            })

        } catch (error) {
            console.log(error);
        }
    } catch (e: any) {
        return {
            error: e.message,
        };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);

