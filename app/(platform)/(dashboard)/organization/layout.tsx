import Sidebar from "../_components/Sidebar";

interface layoutProps {
    children: React.ReactNode
}

const layout: React.FC<layoutProps> = ({ children }) => {
    return <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
        <div className="flex gap-x-7">
            <div className="w-64 shrink-0 hidden md:block">
                <Sidebar storageKey="" />
            </div>
            {children}
        </div>
    </main>;
};

export default layout;