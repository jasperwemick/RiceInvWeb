import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ListItemProps } from "./listItem";

interface ListDropDownItemProps<T> extends ListItemProps<T> {
    subItems : (x : T) => string[];
}

export default function ListDropdownItem<T>({item, topRef, clickAction=(() => {}), getLabel, subItems} : ListDropDownItemProps<T>) {

    const [active, setActive] = useState<boolean>(false);

    const mapSubItems = () => {
        return subItems(item).map((subItem) => {
            return ( <li>{subItem}</li> )
        })
    }

    const onHover = () => setActive(true);
    const onLeave = () => setActive(false);

    return (
        <div className={'list-dropdown-item'} onClick={clickAction} ref={topRef} onMouseEnter={onHover} onMouseLeave={onLeave}>
            <p>{getLabel(item)}</p>
            <div className={`list-dropdown-list-wrapper ${active ? 'expanded' : ''}`}>
                <ul>{mapSubItems()}</ul>
            </div>
        </div>
    )
};