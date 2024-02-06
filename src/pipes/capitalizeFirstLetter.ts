const capitalizeFirstLetter = (string: any) => {
    let temp = string.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
};

export default capitalizeFirstLetter;