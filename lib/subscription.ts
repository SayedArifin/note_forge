import { auth } from "@clerk/nextjs";
import { db } from "./db";

const DAY_IN_MS = 60 * 60 * 24;
export const checkSubscription = async () => {
    const { orgId } = auth();
    if (!orgId) {
        return false;
    }
    const orgSubscription = await db.orgSubscription.findUnique({
        where: { orgId }
    })

    if (!orgSubscription) {
        return false;
    }
    const isValid = orgSubscription.stripePriceId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isValid;
}