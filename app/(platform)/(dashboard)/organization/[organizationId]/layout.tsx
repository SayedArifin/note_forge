import OrgContral from "./_components/orgContral";

interface layoutProps {
    children: React.ReactNode
}

const layout: React.FC<layoutProps> = ({ children }) => {
    return <div>
        <OrgContral />
        {children}
    </div>;
};

export default layout;