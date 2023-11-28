import { checkSubscription } from "@/lib/subscription";
import Info from "../_components/Info";
import { Separator } from "@/components/ui/separator";
import SubscriptionButton from "./_components/SubscriptionButton";

interface pageProps {
}

const page: React.FC<pageProps> = async () => {
    const isPro = await checkSubscription();
    return <div className="w-full">
        <Info isPro={isPro} />
        <Separator className="my-2" />
        <SubscriptionButton isPro={isPro} />
    </div>;
};

export default page;