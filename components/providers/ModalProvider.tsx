"use client"

import { useEffect, useState } from "react";
import CardModel from "../model/CardModel";
import ProModel from "../model/ProModel";

interface ModalProviderProps {
}

const ModalProvider: React.FC<ModalProviderProps> = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(isMounted);
    }, [isMounted]);
    if (isMounted) {
        return null;
    }
    return <div>
        <CardModel />
        <ProModel />
    </div>;
};

export default ModalProvider;