export default function GetUrl() {
    if (import.meta.env.NODE_ENV === 'development') {
        return `http://127.0.0.1:4000`
    }
    else if (import.meta.env.NODE_ENV === 'production') {
        return `http://18.206.108.149:4000`
    }
}