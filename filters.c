#include <stdlib.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE int hello() {
    return 42;
}

EMSCRIPTEN_KEEPALIVE void* createBuff(int w, int h) {
    return malloc(w * h * 4 * sizeof(int));
}

EMSCRIPTEN_KEEPALIVE void destroyBuff(void *ref) {
    free(ref);
}

EMSCRIPTEN_KEEPALIVE void grayscale(int *img, int sz) {

    for (size_t i = 0; i < sz; i+=4){

        int r = img[i];
        int g = img[i+1];
        int b = img[i+2];
        //int a = img[i+3];
        int gray = (r+g+b) / 3;

        img[i] = gray; 
        img[i+1] = gray; 
        img[i+2] = gray; 
    }
}



EMSCRIPTEN_KEEPALIVE void sepia(int *img, int sz) {

    for (size_t i = 0; i < sz; i+=4){


        int r = (img[i] * .393) + (img[i+1] *.769) + (img[i+2] * .189);
        int g = (img[i] * .349) + (img[i+1] *.686) + (img[i+2] * .168);
        int b = (img[i] * .272) + (img[i+1] *.534) + (img[i+2] * .131);

        img[i] = r; 
        img[i+1] = g; 
        img[i+2] = b; 
    }
}


EMSCRIPTEN_KEEPALIVE void brightness(int *img, int sz, double brightness) {

    for (size_t i = 0; i < sz; i+=4){

        img[i] *= brightness; 
        img[i+1] *= brightness; 
        img[i+2] *= brightness; 
    }
}
