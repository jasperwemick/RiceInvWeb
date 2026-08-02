export default function GetUrl() {
    let url : string;
    if (import.meta.env.NODE_ENV === 'development') {
        url = `http://127.0.0.1:4000`
    }
    else if (import.meta.env.NODE_ENV === 'production') {
        url = `http://18.206.108.149:4000`
    }

    return url;
}