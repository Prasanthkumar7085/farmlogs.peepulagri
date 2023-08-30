const setCookie = async () => {
    let options = {
        method: "POST",
        body: JSON.stringify({
            cookie_name: 'log_in',
            cookie_value: true
        })
    }
    let response = await fetch('/api/set-cookie', options);
    let responseData = await response.json();
}

export default setCookie;