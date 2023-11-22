import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/BoardNavbar";

interface layoutProps {
    children: React.ReactNode;
    params: { boardId: string }
}
export const generateMetadata = async ({ params }: { params: { boardId: string } }) => {
    const { orgId } = auth();
    if (!orgId) {
        return {
            title: "Board"
        }
    }
    const board = await db.board.findUnique({
        where: {
            id: params.boardId, orgId
        }, select: {
            title: true,
        },
    })

    return {
        title: (board?.title)?.toUpperCase() || "Board"
    }

}
const layout: React.FC<layoutProps> = async ({ children, params }) => {
    const { orgId } = auth();
    if (!orgId) {
        redirect("/select-org")
    }
    const board = await db.board.findUnique({
        where: {
            id: params.boardId, orgId
        },
    })
    if (!board) {
        notFound();
    }
    return <div className="h-full relative bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${board.imageFullUrl})` }}>
        <BoardNavbar board={board} />
        <div className="absolute inset-0 bg-black/10" />
        <main className="relative pt-28 h-full">
            {children}
        </main>
    </div>;
};

export default layout;