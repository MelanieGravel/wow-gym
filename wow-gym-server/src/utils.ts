export const isDebug: boolean = true;

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const wowLog = (msg) => {
    if( isDebug ) {
        console.log(msg)
    }
}