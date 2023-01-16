#ifndef CALLBACK_H
#define CALLBACK_H
#include <GLFW/glfw3.h>

void resize_callback(GLFWwindow *, int, int);

void key_callback(GLFWwindow *, int, int, int, int);

void cursor_callback(GLFWwindow *, double, double);

void scroll_callback(GLFWwindow *, double, double);
#endif
