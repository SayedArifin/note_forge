"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";



const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { title, boardId } = data;

    if (!title || !boardId) {
        return {
            error: "Missing fields. Faild to create list"
        }
    }
    let list;


    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId, orgId
            }
        })
        if (!board) {
            return {
                error: "No board found"
            }
        }
        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true }
        })

        const newOrder = lastList ? lastList.order : 1
        list = await db.list.create({
            data: {
                title, boardId, order: newOrder
            }
        })

    } catch (error) {
        return {
            error: "failed to craete list"
        }
    }
    try {
        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTRY_TYPE.LIST,
            action: ACTION.CREATE
        })

    } catch (error) {
        console.log(error);
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
}

export const createList = createSafeAction(CreateList, handler)
