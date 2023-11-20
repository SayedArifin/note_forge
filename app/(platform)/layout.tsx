import { ClerkProvider } from "@clerk/nextjs";

interface layoutProps {
    children: React.ReactNode
}

const layout: React.FC<layoutProps> = ({ children }) => {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    );
};

export default layout;