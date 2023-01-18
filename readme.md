# Mandelbrot explorer

Experimental mandelbrot explorer in C and OpenGL.

## Features

- [x] Histogram coloring
- [x] Sine color palette
- [x] Normalized iteration count
- [ ] Shading (Need more research)
- [ ] Supersampling anti-aliasing
- [x] Compute on OpenGL (or maybe even Vulkan) fragment shader
- [x] WebGL port
- [x] Dynamic width and height
- [x] Zoom and pan
- [ ] Screenshot tool

## Result

![](logo.png)

## Requirements

- A C99 compiler
- GNU make
- GLFW
- GLEW

## Usage

Use `make` or `make build` for release build and `make debug` for debug build.

Run `build/mandelbrot`.

## License

This project is licensed under the [MIT License](LICENSE).
