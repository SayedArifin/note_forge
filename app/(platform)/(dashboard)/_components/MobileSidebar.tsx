"use client"

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileSidebarProps {
}

const MobileSidebar: React.FC<MobileSidebarProps> = () => {
    const pathname = usePathname();
    const [isMounted, SetIsMounted] = useState(false)
    const onOpen = useMobileSidebar((state) => state.onOpen)
    const onClose = useMobileSidebar((state) => state.onClose)
    const isOpen = useMobileSidebar((state) => state.isOpen)
    useEffect(() => {
        SetIsMounted(true)
    }, [])

    if (isMounted) {
        return null;
    }
    return <div>MobileSidebar</div>;
};

export default MobileSidebar;