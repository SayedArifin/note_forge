"use client"

import { CardWithList } from "@/types";
import { Layout } from "lucide-react";
import { FormInput } from "../form/FormInput";
import { ElementRef, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface HeaderProps {
    data: CardWithList
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    const queryClient = useQueryClient();
    const params = useParams();
    const inputRef = useRef<ElementRef<"input">>(null);
    const [title, setTitle] = useState(data.title)
    return <div className="flex tiems-start gap-x-3 mb-6 w-full">
        <Layout className="h-5 w-5 mt-1 text-neutral-700" />
        <form action="">
            <FormInput id="title" defaultValue={title} className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate" />
        </form>

    </div>;
};

export default Header;