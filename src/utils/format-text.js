
// ----------------------------------------------------------------------

export function fText(string) {
    return string ?
        string?.toLowerCase()?.split(' ')?.map(word => word.charAt(0).toUpperCase() + word.slice(1))?.join(' ') : 'N/A'
}


export function fMobileNumber(Number) {
    const countryCode = '+91';
    const formattedNumber = `${countryCode} ${Number?.slice(0, 5)}  ${Number?.slice(5)}`;
    return formattedNumber;
}