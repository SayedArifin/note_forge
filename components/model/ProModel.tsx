"use client"

import { useProModal } from "@/hooks/use-pro-model";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

interface ProModelProps {
}

const ProModel: React.FC<ProModelProps> = () => {
    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess(data) {
            window.location.href = data;
        }, onError(error) {
            toast.error(error);
        },
    })
    const proModel = useProModal();
    return (
        <Dialog open={proModel.isOpen} onOpenChange={proModel.onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center">
                    <Image src={"/hero.svg"} alt="hero" className="object-cover" fill />

                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className="font-semibold text-xl">Upgrade to Taskify Pro Today!</h2>
                    <p className="text-xs font-semibold text-neutral-600">Explore the best of Taskify</p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                            <li className="">Unlimited boards</li>
                            <li className="">Advanced checklist</li>
                            <li className="">Admin and security Features</li>
                            <li className="">And more!</li>

                        </ul>
                    </div>
                    <Button disabled={isLoading} onClick={() => execute({})} className="w-full" variant={"primary"}>Upgrade</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProModel;