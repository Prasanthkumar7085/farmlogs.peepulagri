const serUserTypeCookie = async (userType: any) => {
    let options = {
        method: "POST",
        body: JSON.stringify({
            cookie_name: 'userType',
            cookie_value: userType
        })
    }
    let response = await fetch('/api/set-cookie', options);
    let responseData = await response.json();
    return { data: responseData, message: 'Successfully set User Type Cookie', success: true, status: 200 };
}

export default serUserTypeCookie;