import { auth } from "@clerk/nextjs";
import OrgContral from "./_components/OrgContral";
import { startCase } from "lodash";


interface layoutProps {
    children: React.ReactNode
}
export async function generateMetadata() {
    const { orgSlug } = auth();
    return {
        title: startCase(orgSlug || "organization")
    }
}
const layout: React.FC<layoutProps> = ({ children }) => {
    return <div>
        <OrgContral />
        {children}
    </div>;
};

export default layout;