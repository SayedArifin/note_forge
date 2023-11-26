"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";




const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated "
        }
    }

    const { items, boardId } = data;

    if (!items || !boardId) {
        return {
            error: "Missing fields. Faild to create list"
        }
    }
    let lists;


    try {
        const transaction = items.map((list) =>
            db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId
                    }
                },
                data: {
                    order: list.order
                }
            })
        )
        lists = await db.$transaction(transaction);
    } catch (error) {
        return {
            error: "failed to craete list"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: lists };
}

export const updateListOrder = createSafeAction(UpdateListOrder, handler)