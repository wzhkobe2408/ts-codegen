export function delay(time: number) {
    return new Promise(r => setTimeout(r, time));
}
