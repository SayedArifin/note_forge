import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import FormPopOver from "@/components/form/FormPopOver";

interface NavbarProps {
}

const Navbar: React.FC<NavbarProps> = () => {
    return <nav className="fixed z-50 top-0 w-full h-14 border-b shadow-b shadow-sm bg-white flex items-center px-4">
        <MobileSidebar />
        <div className="flex items-center gap-x-4">
            <div className="hidden md:flex">
                <Logo />

            </div>
            <FormPopOver align="start" side="bottom" sideOffset={18}>

                <Button variant={"primary"} size={"sm"} className="rounded-sm hidden md:block h-auto py-1.5 px-2">Create</Button>


            </FormPopOver>
            <FormPopOver>
                <Button variant={"primary"} size={"sm"} className="rounded-sm block md:hidden"><Plus /></Button>
            </FormPopOver>
        </div>
        <div className="ml-auto flex items-center gap-x-2 ">
            <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl={"/organization/:id"} afterLeaveOrganizationUrl="/select-org" afterSelectOrganizationUrl={"/organization/:id"}
                appearance={{
                    elements: {
                        rootBox: {
                            display: "flex", justifyContent: "center", alignItems: "center"
                        }
                    }
                }}
            />
            <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                    avatarBox: {
                        height: 30, width: 30
                    }
                }
            }} />
        </div>
    </nav>;
};

export default Navbar;