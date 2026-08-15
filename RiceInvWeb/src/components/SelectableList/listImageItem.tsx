import type { ListItemProps } from "./listItem";

interface ImageListItemProps<T> extends ListItemProps<T> {
    imgWidth ? : number;
    imgHeight ? : number;
    getImgSrc ? : (x : T) => string;
}

export default function ListImageItem<T>({item, topRef, imgWidth=200, imgHeight=200, clickAction=(() => {}), getImgSrc, getLabel} : ImageListItemProps<T>) {
    return (
        <div onClick={clickAction} ref={topRef} className={'list-image-item'}>
            <img src={getImgSrc(item)} width={imgWidth} height={imgHeight} alt="Placeholder" draggable={`false`}></img>
            <p>{getLabel(item)}</p>
        </div>
    )
};