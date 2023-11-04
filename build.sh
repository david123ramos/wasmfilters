#!/bin/bash

emcc -o filters.wasm filters.c -s WASM=1 --no-entry