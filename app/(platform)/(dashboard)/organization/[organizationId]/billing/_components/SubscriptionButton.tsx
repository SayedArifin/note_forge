"use client"

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-model";
import { toast } from "sonner";

interface SubscriptionButtonProps {
    isPro: boolean;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ isPro }) => {
    const proModel = useProModal()
    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess(data) {
            window.location.href = data;
        }, onError(error) {
            toast.error(error);
        },
    })
    const onclick = () => {
        if (isPro) {
            execute({});
        } else {
            proModel.onOpen();
        }
    }
    return (
        <Button onClick={onclick} disabled={isLoading}>{isPro ? "Manage Subscription" : "Udgrade to pro"}</Button>
    );
};

export default SubscriptionButton;