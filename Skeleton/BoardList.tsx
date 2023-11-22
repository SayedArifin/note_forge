import { Skeleton } from "@/components/ui/skeleton";

interface BoardListProps {
    cardNumber: number;
}

const BoardListSK: React.FC<BoardListProps> = ({ cardNumber }) => {
    const skeletons = Array.from({ length: cardNumber }, (_, index) => (
        <Skeleton key={index} className="aspect-video h-full w-full p-2" />
    ));

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skeletons}
        </div>
    );
};

export default BoardListSK;
