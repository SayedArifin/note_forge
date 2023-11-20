import Navbar from "./_components/Navbar";

interface layoutProps {
    children: React.ReactNode
}

const layout: React.FC<layoutProps> = ({ children }) => {
    return <div className="h-full">
        <Navbar />
        {children}</div>;
};

export default layout;