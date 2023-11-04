const wasmPath = "./filters.wasm";
const imgPath = "./oseias.jpeg";
const canvas = document.querySelector("#screen");
const canvasResult = document.querySelector("#screenResult");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");

/**
 * @type {CanvasRenderingContext2D}
 */
const ctxResult = canvasResult.getContext("2d");
let $wasm = null;



const img = new Image();
img.src = imgPath;


img.onload = () => {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
}


WebAssembly.instantiateStreaming(fetch(wasmPath), {}).then(resource => {
    document.dispatchEvent(new Event("wasmload"));
    $wasm = resource;
});

document.addEventListener("wasmload", () => {
    document.querySelectorAll(".filter").forEach(el => el.removeAttribute("disabled"));
});


function applyFilter(filterName) {
    const filterMap = {
        "grayscale" : grayscale,
        "sepia" : sepia,
        "brightness" : brightness
    }

    if(!filterMap[filterName]) {
        throw new Error(`invalid filter name: ${filterName}`);
    }

    filterMap[filterName].call(this);
}

function grayscale() {
    
    const {createBuff, destroyBuff, grayscale, memory} = $wasm.instance.exports;
    const HEAP32 = new Int32Array(memory.buffer);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const ptr = createBuff(canvas.width, canvas.height);

    const start = ptr >> 2;

    HEAP32.set(imgData.data,start);

    grayscale(ptr, imgData.data.length);

    const newPixelValues = HEAP32.slice(start, start + imgData.data.length);

    destroyBuff(ptr);

    const grayscaleImageData = new ImageData(
        new Uint8ClampedArray(newPixelValues),
        canvas.width,
        canvas.height
    );

    ctxResult.putImageData(grayscaleImageData, 0, 0);
}


function sepia() {
    
    const {createBuff, destroyBuff, sepia, memory} = $wasm.instance.exports;
    const HEAP32 = new Int32Array(memory.buffer);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const ptr = createBuff(canvas.width, canvas.height);

    const start = ptr >> 2;

    HEAP32.set(imgData.data,start);

    sepia(ptr, imgData.data.length);

    const newPixelValues = HEAP32.slice(start, start + imgData.data.length);

    destroyBuff(ptr);

    const sepiaImageData = new ImageData(
        new Uint8ClampedArray(newPixelValues),
        canvas.width,
        canvas.height
    );

    ctxResult.putImageData(sepiaImageData, 0, 0);
}


function brightness() {
    
    const {createBuff, destroyBuff, brightness, memory} = $wasm.instance.exports;
    const HEAP32 = new Int32Array(memory.buffer);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const ptr = createBuff(canvas.width, canvas.height);

    const start = ptr >> 2;

    HEAP32.set(imgData.data,start);

    brightness(ptr, imgData.data.length, 1.5);

    const newPixelValues = HEAP32.slice(start, start + imgData.data.length);

    destroyBuff(ptr);

    const brightnessImageData = new ImageData(
        new Uint8ClampedArray(newPixelValues),
        canvas.width,
        canvas.height
    );

    ctx.putImageData(brightnessImageData, 0, 0);
}