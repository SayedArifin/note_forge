import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ListContainer from "./_components/ListContainer";

interface pageProps {
    params: {
        boardId: string;
    }
}

const page: React.FC<pageProps> = async ({ params }) => {
    const { orgId } = auth();
    if (!orgId) {
        redirect("/select-org")
    }
    const lists = await db.list.findMany({
        where: {
            boardId: params.boardId,
            board: {
                orgId
            }
        }, include: {
            Cards: {
                orderBy: {
                    order: "asc"
                },
            },
        }, orderBy: {
            order: "asc"
        },
    })
    return <div className="p-4 h-full overflow-x-auto">
        <ListContainer boardId={params.boardId} data={lists} />
    </div>;
};

export default page;