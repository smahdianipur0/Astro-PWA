let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

/**
* @param {number} a
* @returns {number}
*/
export function times_two(a) {
    const ret = wasm.times_two(a);
    return ret;
}

