"use client"

import { ListWithCards } from "@/types";
import ListForm from "./ListForm";
import { useEffect, useState } from "react";
import ListItem from "./ListItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed);
    return result;
}

const ListContainer: React.FC<ListContainerProps> = ({ data, boardId }) => {
    const [orderedData, setorderedData] = useState(data);
    useEffect(() => {
        setorderedData(data);
    }, [data]);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("list reordered successfully")
        }, onError(error) {
            toast.error(error);
        },
    })
    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered successfully")
        }, onError(error) {
            toast.error(error);
        },
    })



    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // if dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // User moves a list
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index }));

            setorderedData(items);
            executeUpdateListOrder({ items, boardId });
        }

        // User moves a card
        if (type === "card") {
            let newOrderedData = [...orderedData];

            // Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);

            if (!sourceList || !destList) {
                return;
            }

            // Check if cards exists on the sourceList
            if (!sourceList.Cards) {
                sourceList.Cards = [];
            }

            // Check if cards exists on the destList
            if (!destList.Cards) {
                destList.Cards = [];
            }

            // Moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.Cards,
                    source.index,
                    destination.index,
                );

                reorderedCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.Cards = reorderedCards;

                setorderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: reorderedCards,
                });
                // User moves the card to another list
            } else {
                // Remove card from the source list
                const [movedCard] = sourceList.Cards.splice(source.index, 1);

                // Assign the new listId to the moved card
                movedCard.listId = destination.droppableId;

                // Add card to the destination list
                destList.Cards.splice(destination.index, 0, movedCard);

                sourceList.Cards.forEach((card, idx) => {
                    card.order = idx;
                });

                // Update the order for each card in the destination list
                destList.Cards.forEach((card, idx) => {
                    card.order = idx;
                });

                setorderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId,
                    items: destList.Cards,
                });
            }
        }
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list" type="list" direction="horizontal">
                {(provided) => (
                    <ol {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full">
                        {orderedData.map((list, index) => (
                            <ListItem key={list.id} index={index} data={list} />
                        ))}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1"></div>
                    </ol>
                )}

            </Droppable>

        </DragDropContext>
    )
};

export default ListContainer;