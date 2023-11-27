import { Separator } from "@/components/ui/separator";
import Info from "../_components/Info";
import { ActivityList } from "./_components/Activity";
import { Suspense } from "react";

interface pageProps {
}

const page: React.FC<pageProps> = () => {
    return <div className="w-full">
        <Info />
        <Separator className="my-2" />
        <Suspense fallback={<ActivityList.Skeleton />}>
            <ActivityList />
        </Suspense>
    </div>;
};

export default page;