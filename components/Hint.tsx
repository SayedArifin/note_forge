import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface HintProps {
    children: React.ReactNode;
    description: string;
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;

}

const Hint: React.FC<HintProps> = ({ children, description, side = "bottom", sideOffset = 0 }) => {
    return <TooltipProvider>
        <Tooltip delayDuration={1}>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent sideOffset={sideOffset} side={side} className="text-xs max-w-[220px] break-words">{description}</TooltipContent>
        </Tooltip>
    </TooltipProvider>;
};

export default Hint;