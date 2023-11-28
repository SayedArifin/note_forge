import { Separator } from "@/components/ui/separator";
import Info from "./_components/Info";
import BoardList from "../../_components/BoardList";
import { Suspense } from "react";
import BoardListSK from "@/Skeleton/BoardList";
import { Skeleton } from "@/components/ui/skeleton";
import { checkSubscription } from "@/lib/subscription";

interface pageProps {
}

const page: React.FC<pageProps> = async () => {
    const isPro = await checkSubscription();
    return <div className="w-full mb-20">
        <Info isPro={isPro} />
        <Separator className="my-4" />
        <div className="px-2 md:px-4">
            <Suspense fallback={<div className="w-full">
                <div className="flex justify-center items-center mt-16">
                    <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
                </div>
            </div>}>
                <BoardList />
            </Suspense>
        </div>
    </div>;
};

export default page;