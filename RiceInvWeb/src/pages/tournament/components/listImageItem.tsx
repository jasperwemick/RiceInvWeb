import type { CSSProperties } from "react";

interface ImageListItemProps<T> {
    item : T;
    topRef : React.RefObject<HTMLDivElement>
    imgWidth ? : number;
    imgHeight ? : number;
    clickAction ? : () => void;
    getImgSrc ? : (x : T) => string;
    getLabel : (x : T) => string;
}

export default function ListImageItem<T>({item, topRef, imgWidth=200, imgHeight=200, clickAction=(() => {}), getImgSrc, getLabel} : ImageListItemProps<T>) {
    return (
        <div onClick={clickAction} ref={topRef}>
            <img src={getImgSrc(item)} width={imgWidth} height={imgHeight} alt="Placeholder" draggable={`false`}></img>
            <p>{getLabel(item)}</p>
        </div>
    )
};