interface ListWrapperProps {
    children: React.ReactNode;
}

const ListWrapper: React.FC<ListWrapperProps> = ({ children }) => {
    return <li className="select-0 h-full w-[272px] select-none">{children}</li>;
};

export default ListWrapper;