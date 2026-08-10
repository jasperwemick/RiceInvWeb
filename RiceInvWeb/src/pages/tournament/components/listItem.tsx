import type { CSSProperties } from "react";

interface ListItemProps<T> {
    item : T;
    topRef : React.RefObject<HTMLDivElement>
    clickAction ? : () => void;
    getLabel : (x : T) => string;
}

export default function ListItem<T>({item, topRef, clickAction=(() => {}), getLabel} : ListItemProps<T>) {
    return (
        <div className={'list-item'} onClick={clickAction} ref={topRef}>{getLabel(item)}</div>
    )
};