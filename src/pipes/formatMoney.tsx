const formatMoney = (amount: any, currencySymbol = '$') => {
    let rupee = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'USD',
    });
    if (amount) {
        return rupee.format(+amount)
    } else {
        return rupee.format(0)
    }


};
export default formatMoney