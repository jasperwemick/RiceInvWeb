import { useEffect, useRef, useState } from "react";
import useGetRef from "../../hooks/useGetRef";
import ListItem from "./listItem";


type SelectedItemProps<T> = {
    selected : T | null;
    setSelected : React.Dispatch<React.SetStateAction<T | null>>;
    multiple : false
} | {
    selected : T[];
    setSelected : React.Dispatch<React.SetStateAction<T[]>>;
    multiple : true
}

interface SelectableItemsListProps<T, P extends object = {}> {
    list : T[];
    selection : SelectedItemProps<T>;
    limit ? : number;
    removalPredicate : (a : T, b : T) => boolean;
    getLabel : (x : T) => string;
    ComponentItem ? : (
        { item, topRef, clickAction, getLabel } : { 
            item : T, topRef : React.RefObject<HTMLDivElement>, clickAction ? : () => void, getLabel : (x : T) => string 
        } & P) => React.JSX.Element;
    ExtraProps ? : P;
}


export default function SelectableItemsList<T, P extends object = {}>({ 
    list, 
    selection,
    limit,
    removalPredicate, 
    getLabel, 
    ComponentItem = ListItem as unknown as (
        props: { 
            item : T, topRef : React.RefObject<HTMLDivElement>, clickAction ? : () => void, getLabel : (x : T) => string 
        } & P) => React.JSX.Element,
    ExtraProps = {} as P
} : SelectableItemsListProps<T, P>) {
    
    const getRef = useGetRef<HTMLDivElement>();
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    // If the parent modifies the length of the list, unselect all
    useEffect(() => {
        list.forEach((value, i) => {
            getRef(i).current.classList.remove('selected');
        })
        if (selection.multiple === true) selection.setSelected([]);
        else selection.setSelected(null);
    }, [list.length]);

    // If parent sets single selected item to null, remove css class
    useEffect(() => {
        const dom = getRef(selectedIndex).current;
        if (dom && selection.multiple === false && !selection.selected) {
            getRef(selectedIndex).current.classList.remove('selected');
        }
    }, [selection.selected])

    const toggleParticipant = (item : T, index : number) => {
        const dom = getRef(index).current;
        if (dom.classList.contains('selected')) {
            dom.classList.remove('selected');
            
            if (selection.multiple === true) selection.setSelected(selection.selected.filter((x) => removalPredicate(x, item)))
            else selection.setSelected(null);
            return;
        }

        if (limit && selection.multiple && selection.selected.length === limit) return;

        if (!selection.multiple && selectedIndex >= 0) getRef(selectedIndex).current.classList.remove('selected');
        setSelectedIndex(index);

        dom.classList.add('selected');
        console.log('selected : ', item);
        if (selection.multiple === true) selection.setSelected([...selection.selected, item]);
        else selection.setSelected(item);
    }

    return list.map((item, i) => {
        return (
            <ComponentItem item={item} topRef={getRef(i)} clickAction={() => toggleParticipant(item, i)} getLabel={getLabel} {...ExtraProps} key={i}/>
        )
    })
}