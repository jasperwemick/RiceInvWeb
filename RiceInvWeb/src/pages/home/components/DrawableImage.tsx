import { useEffect, useRef, useState } from "react";

export default function DrawableImage({src} : {src : string | undefined}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState<boolean>(false);
    const [reset, setReset] = useState<boolean>(false);
    const [drawSize, setDrawSize] = useState<number>(4);
    const [strokeMade, setStrokeMade] = useState<boolean>(false);

    const mouseCoords = useRef<{x : number, y : number} | null>({
        x: 0,
        y: 0
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !src) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.reset();
        setReset(false);

        const img = new Image();
        img.src = src;
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0); // draw the image as the base layer
        };
    }, [src, reset]);

    const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvasRef.current!.width / rect.width),
            y: (e.clientY - rect.top) * (canvasRef.current!.height / rect.height),
        };
    };

    const handMouseDown = (e : React.MouseEvent<HTMLCanvasElement>) => {
        setDrawing(true);
        setStrokeMade(true);
        mouseCoords.current = getPos(e);
    }

    const handleMouseMove = (e : React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        e.preventDefault();

        const ctx = canvasRef.current!.getContext('2d')!;
        const pos = getPos(e);

        ctx.beginPath();
        ctx.moveTo(mouseCoords.current!.x, mouseCoords.current!.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = '#000000ff';
        ctx.lineWidth = drawSize;
        ctx.lineCap = 'round';
        ctx.stroke();

        mouseCoords.current = pos;
    }
    
    const handleMouseUpLeave = (e : React.MouseEvent<HTMLCanvasElement>) => {
        e.stopPropagation();
        setDrawing(false);
        mouseCoords.current = null;
    }

    return (
        <div className={'me-img-container'}>
            {strokeMade && <div style={{
                position : 'absolute',
                display : 'flex',
                flexDirection : 'column',
                gap : '2rem'
                
            }}>
                <button style={{
                    margin : '1rem',
                    border : 'none',
                    borderRadius : '0.5rem',
                    padding : '0.5rem'
                }} onClick={() => setReset(true)}>{`Clear`}</button>
                <input type={'range'} min={4} max={16} value={drawSize} onChange={(e) => setDrawSize(Number(e.target.value))} style={{
                    rotate : '-90deg',
                    width : '6rem'
                }}/>
            </div>}
            <canvas 
            ref={canvasRef}
            onMouseDown={handMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpLeave}
            onMouseLeave={handleMouseUpLeave}
            style={{ touchAction : 'none', cursor : 'crosshair' }}/>
        </div>
        )
}