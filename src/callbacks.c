#include "callbacks.h"

#include <stdbool.h>
#include <stdio.h>

#include "state.h"

void resize_callback(GLFWwindow *window, int width, int height) {
  (void)window;
  glViewport(0, 0, width, height);
  StateResize(width, height);
}

void key_callback(
  GLFWwindow *window, int key, int scancode, int action, int mods
) {
  (void)window;
  (void)scancode;
  (void)mods;
  if (key == GLFW_KEY_E && action == GLFW_PRESS) { printf("e key pressed!\n"); }
}

static double last_x, last_y;

void cursor_callback(GLFWwindow *window, double xpos, double ypos) {
  (void)window;
  if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_LEFT) == GLFW_RELEASE) {
    last_x = xpos;
    last_y = ypos;

    return;
  }

  float dx = xpos - last_x;
  float dy = ypos - last_y;
  StateMove(dx, dy);

  last_x = xpos;
  last_y = ypos;
}

void scroll_callback(GLFWwindow *window, double dx, double dy) {
  (void)window;
  (void)dx;

  StateZoom(dy, last_x, last_y);
}
