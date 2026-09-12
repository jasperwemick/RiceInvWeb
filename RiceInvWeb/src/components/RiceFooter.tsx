import type { CSSProperties } from "react"

const footerStyle : CSSProperties = {
    width : '100%',
    height : '20vh',
    background : 'linear-gradient(rgb(15, 34, 54), #203a55)',
    borderTop : '2rem solid rgb(15, 34, 54)'
}

const footerListStyle : CSSProperties = {
    display : 'flex',
    width : '100%',
}

export default function RiceFooter({}) {
    return (
        <div style={footerStyle}>
            <div style={footerListStyle}></div>
        </div>
    )
}