import ModalProvider from "@/components/providers/ModalProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";

interface layoutProps {
    children: React.ReactNode
}

const layout: React.FC<layoutProps> = ({ children }) => {
    return (
        <ClerkProvider>
            <QueryProvider>
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    );
};

export default layout;