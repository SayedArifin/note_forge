"use client"

import InfoSK from "@/Skeleton/Info";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";

interface InfoProps {
}

const Info: React.FC<InfoProps> = () => {
    const { organization, isLoaded } = useOrganization();
    if (!isLoaded) {
        return (
            <div className="">
                <InfoSK />
            </div>
        )
    }
    return <div className="flex items-center gap-x-4 w-full">
        <div className="w-[60px] h-[60px] relative">
            <Image fill src={organization?.imageUrl!} alt="organization" className="rounded-md object-center" />
        </div>
        <div className="space-y-1">
            <p className="font-semibold text-xl">{organization?.name}</p>
            <div className="flex items-center text-xs text-muted-foreground"><CreditCard className="h-3 w-3 mr1" />Free</div>
        </div>
    </div>;
};



export default Info;