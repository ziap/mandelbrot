#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <stdio.h>

#include "callbacks.h"
#include "render.h"
#include "state.h"

#define WIDTH 960
#define HEIGHT 720

int main(void) {
  if (!glfwInit()) return -1;

  GLFWwindow *window =
    glfwCreateWindow(WIDTH, HEIGHT, "Mandelbrot", NULL, NULL);
  if (!window) {
    glfwTerminate();
    return -1;
  }

  StateInit(WIDTH, HEIGHT);

  glfwMakeContextCurrent(window);
  if (glewInit() != GLEW_OK) {
    glfwTerminate();
    return -1;
  }

  glfwSwapInterval(0);

  printf("Created window with OpenGL version: %s\n", glGetString(GL_VERSION));

  glfwSetFramebufferSizeCallback(window, resize_callback);
  glfwSetKeyCallback(window, key_callback);
  glfwSetCursorPosCallback(window, cursor_callback);
  glfwSetScrollCallback(window, scroll_callback);

  double last = glfwGetTime();
  double last_display = last;

  unsigned frames = 0;

  render_init();
  while (!glfwWindowShouldClose(window)) {
    render_update();
    glfwSwapBuffers(window);
    glfwPollEvents();
    frames += 1;
    double now = glfwGetTime();
    if (now - last_display >= 1) {
      char title[64];
      sprintf(title, "Mandelbrot - FPS: %d", frames);
      glfwSetWindowTitle(window, title);
      frames = 0;
      last_display = now;
    }
    last = now;
  }

  glfwTerminate();
  return 0;
}
