const setCookie = async () => {
    let options = {
      method: "POST",
      body: JSON.stringify({
        cookie_name: "loggedIn_v2",
        cookie_value: true,
      }),
    };
    let response = await fetch('/api/set-cookie', options);
    let responseData = await response.json();
}

export default setCookie;