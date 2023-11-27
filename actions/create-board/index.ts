"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTRY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { title, image } = data;
    const [
        imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName
    ] = image.split("|")
    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing image fields. Faild to create board"
        }
    }
    let board;
    try {

        board = await db.board.create({
            data: {
                title, orgId, imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHTML
            }
        })
        try {
            await createAuditLog({
                entityId: board.id,
                entityTitle: board.title,
                entityType: ENTRY_TYPE.BOARD,
                action: ACTION.CREATE
            })

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        return {
            error: "failed to create board"
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)
