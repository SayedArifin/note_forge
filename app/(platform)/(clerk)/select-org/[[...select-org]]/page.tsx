import { OrganizationList } from "@clerk/nextjs";

interface pageProps {
}

const page: React.FC<pageProps> = () => {
    return <div>
        <OrganizationList hidePersonal afterCreateOrganizationUrl={"/organization/:id"} afterSelectOrganizationUrl={"/organization/:id"} />
    </div>;
};

export default page;