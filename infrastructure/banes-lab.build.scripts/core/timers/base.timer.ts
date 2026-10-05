export const wait = async function wait(ms: number): Promise<void> {
    return new Promise((settle) => {
        setTimeout(settle, ms);
    });
};
