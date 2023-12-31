"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";



const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { id, boardId } = data;

    if (!id || !boardId) {
        return {
            error: "Missing image fields. Faild to delete board"
        }
    }
    let list;
    try {

        list = await db.list.delete({
            where: {
                id, boardId, board: {
                    orgId
                }
            }
        })
        try {
            await createAuditLog({
                entityId: list.id,
                entityTitle: list.title,
                entityType: ENTRY_TYPE.LIST,
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

    revalidatePath(`/board/${boardId}`);
    return { data: list }
}

export const deleteList = createSafeAction(DeleteList, handler)
