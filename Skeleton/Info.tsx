import { Skeleton } from "@/components/ui/skeleton";

interface InfoProps {
}

const InfoSK: React.FC<InfoProps> = () => {
    return <div className="flex items-center gap-x-4">
        <div className="w-[60px] h-[60px]">
            <Skeleton className="w-[60px] h-[60px] absolute" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" /><Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    </div>;
};

export default InfoSK;