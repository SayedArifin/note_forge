"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";



const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();
    const isPro = await checkSubscription();
    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { id } = data;

    if (!id) {
        return {
            error: "Missing image fields. Faild to delete board"
        }
    }
    let board;
    try {

        board = await db.board.delete({
            where: {
                id, orgId,
            }
        })
        if (!isPro) {
            await decreaseAvailableCount();
        }
        try {
            await createAuditLog({
                entityId: board.id,
                entityTitle: board.title,
                entityType: ENTRY_TYPE.BOARD,
                action: ACTION.DELETE
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        return {
            error: "failed to delete board"
        }
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)
