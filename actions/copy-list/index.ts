"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { CopyList } from "./schema";
import { InputType, ReturnType } from "./type";
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
    let list: { Cards: { id: string; title: string; order: number; description: string | null; listId: string; createdAt: Date; updatedAt: Date; }[]; } & { id: string; title: string; order: number; boardId: string; createdAt: Date; updatedAt: Date; };

    try {
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            include: {
                Cards: true,
            },
        });

        if (!listToCopy) {
            return { error: "List not found" };
        }

        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        // Create the list
        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
            },
            include: {
                Cards: true,
            },
        });

        // Check if there are cards to copy
        if (listToCopy.Cards.length > 0) {
            // Create the cards associated with the list
            await db.card.createMany({
                data: listToCopy.Cards.map((card) => ({
                    title: card.title,
                    description: card.description,
                    order: card.order,
                    listId: list.id, // Associate the card with the newly created list
                })),
            });
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
    } catch (e: any) {
        return {
            error: e.message,
        };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);

