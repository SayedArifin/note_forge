"use client"

import { ListWithCards } from "@/types";
import ListForm from "./ListForm";


interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}


const ListContainer: React.FC<ListContainerProps> = ({ data, boardId }) => {
    return <ol className="">
        <ListForm />
        <div className="flex-shrink-0 w-1"></div>
    </ol>;
};

export default ListContainer;