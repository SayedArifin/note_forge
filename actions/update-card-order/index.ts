"use server"

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./type"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";





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
    let updatedCard;


    try {
        const transaction = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            orgId
                        }
                    }
                },
                data: {
                    order: card.order,
                    listId: card.listId
                }
            })
        )
        updatedCard = await db.$transaction(transaction);
    } catch (error) {
        return {
            error: "failed to craete list"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: updatedCard };
}

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler)
