const GetUrl = () => {
    console.log(process.env.NODE_ENV)
    
    let url;
    if (process.env.NODE_ENV === 'development') {
        url = `http://18.206.108.149:4000`
    }
    else if (process.env.NODE_ENV === 'production') {
        url = `http://18.206.108.149:4000`
    }

    return url;
}

export default GetUrl()
