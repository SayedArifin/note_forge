"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";



const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { title, id, boardId } = data;

    if (!title || !id || !boardId) {
        return {
            error: "Missing  fields. Faild to update list"
        }
    }
    let list;
    try {

        list = await db.list.update({
            where: {
                id, boardId, board: {
                    orgId
                }
            }, data: {
                title
            }
        })
        try {
            await createAuditLog({
                entityId: list.id,
                entityTitle: list.title,
                entityType: ENTRY_TYPE.LIST,
                action: ACTION.UPDATE
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        return {
            error: "failed to update list"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list }
}

export const updateList = createSafeAction(UpdateList, handler)
