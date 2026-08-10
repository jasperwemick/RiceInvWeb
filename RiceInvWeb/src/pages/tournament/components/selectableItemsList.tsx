import { useEffect } from "react";
import useGetRef from "../../../hooks/useGetRef";
import ListItem from "./listItem";


interface SelectableItemsListProps<T, P extends object = {}> {
    list : T[];
    selected : T[];
    setSelected : React.Dispatch<React.SetStateAction<T[]>>;
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
    selected, 
    setSelected, 
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

    useEffect(() => {
        list.forEach((value, i) => {
            console.log(getRef(i));
            getRef(i).current.classList.remove('selected');
        })
    }, [list.length]);

    //x._id != item._id
    const toggleParticipant = (item : T, index : number) => {
        const dom = getRef(index).current;
        if (dom.classList.contains('selected')) {
            dom.classList.remove('selected');
            setSelected(selected.filter((x) => removalPredicate(x, item)))
            return;
        }

        if (selected.length === limit) return;

        dom.classList.add('selected');
        setSelected([...selected, item]);
    }

    return list.map((item, i) => {
        return (
            (
                <ComponentItem item={item} topRef={getRef(i)} clickAction={() => toggleParticipant(item, i)} getLabel={getLabel} {...ExtraProps} key={i}/>
                // <div key={i} ref={getRef(i)} onClick={() => toggleParticipant(item, i)}>{getLabel(item)}</div>
            )
        )
    })
}