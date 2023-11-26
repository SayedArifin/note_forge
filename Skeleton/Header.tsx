import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
}

const HeaderSK: React.FC<HeaderProps> = () => {
    return <div className="flex items-start gap-x-3 mb-6">
        <Skeleton className="h-6 w-6 mt-1 bg-neutral-700" />
        <div className="">
            <Skeleton className="w-24 h-6 mb-1 bg-neutral-700" />
            <Skeleton className="w-12 h-4 bg-neutral-700" />
        </div>
    </div>;
};

export default HeaderSK;