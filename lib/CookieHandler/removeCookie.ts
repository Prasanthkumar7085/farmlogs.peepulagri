const removeCookie = async () => {
    let response = await fetch('/api/remove-cookie');
    if (response.status == 200) {

    }
}

export default removeCookie;