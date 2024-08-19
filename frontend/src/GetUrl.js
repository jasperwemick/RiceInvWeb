const GetUrl = () => {
    console.log(process.env.NODE_ENV)

    let url;
    if (process.env.NODE_ENV === 'development') {
        url = `https://riceinvitational.org:4000`
    }
    else if (process.env.NODE_ENV === 'production') {
        url = `https://riceinvitational.org:4000`
    }

    return url;
}

export default GetUrl()
