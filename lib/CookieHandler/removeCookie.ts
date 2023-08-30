const removeCookie = async () => {
    let response = await fetch('/api/remove-cookie');
    if (response.status == 200) {
        console.log('Removed Successful');
    }
}

export default removeCookie;