
use wasm_bindgen::prelude::wasm_bindgen;



#[wasm_bindgen]
pub fn times_two(a: i32) -> i32 {
    let z = a*2;
    z
}
