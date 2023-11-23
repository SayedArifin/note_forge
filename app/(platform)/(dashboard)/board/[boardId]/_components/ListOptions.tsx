"use client"

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { List } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";

interface ListOptionsProps {
    data: List;
    onAddCard: () => void;
}

const ListOptions: React.FC<ListOptionsProps> = ({ data, onAddCard }) => {
    return <Popover>
        <PopoverTrigger asChild>
            <Button className="h-auto w-auto p-2" variant={"ghost"}><MoreHorizontal className="h-4 w-4" /></Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                List Actions
            </div>
        </PopoverContent>
    </Popover>;
};

export default ListOptions;