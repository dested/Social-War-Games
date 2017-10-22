export class DebounceUtils {

    private static debounceCallbacks: { [key: string]: { timeout: number, callback: () => void } } = {};
    static debounce(key: string, ms: number, callback: () => void): any {
        if (DebounceUtils.debounceCallbacks[key]) {
            //                console.log(key + ' debounce stopped');
            clearTimeout(DebounceUtils.debounceCallbacks[key].timeout);
        }

        DebounceUtils.debounceCallbacks[key] = {
            callback: callback,
            timeout: setTimeout(() => {
                //                console.log(key + ' debounce called');
                callback();
                delete DebounceUtils.debounceCallbacks[key];
            }, ms)
        };
    }

}