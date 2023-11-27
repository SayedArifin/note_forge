"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { title, id } = data;

    if (!title || !id) {
        return {
            error: "Missing image fields. Faild to update board"
        }
    }
    let board;
    try {

        board = await db.board.update({
            where: {
                id, orgId,
            }, data: {
                title
            }
        })
        try {
            await createAuditLog({
                entityId: board.id,
                entityTitle: board.title,
                entityType: ENTRY_TYPE.BOARD,
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

    revalidatePath(`/board/${board.id}`);
    return { data: board }
}

export const updateBoard = createSafeAction(UpdateBoard, handler)
