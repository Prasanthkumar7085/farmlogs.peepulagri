export const acceptOnlyNumber = (number: string) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    if (number) {
        if (regex.test(number)) {
            return number;
        }
    } return ''
}