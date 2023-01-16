#include "state.h"

#include <stdio.h>

State global_state;

static float relative_scale() {
  float w = global_state.width;
  float h = global_state.height;

  return (w < h ? w : h) / 3;
}

void StateInit(float width, float height) {
  global_state.width = width;
  global_state.height = height;
  global_state.scale = relative_scale();

  global_state.center_x = width / 6;
  global_state.center_y = 0;
}

void StateResize(float new_w, float new_h) {
  global_state.center_x /= global_state.scale;
  global_state.center_y /= global_state.scale;

  global_state.scale /= relative_scale();

  global_state.width = new_w;
  global_state.height = new_h;

  global_state.scale *= relative_scale();

  global_state.center_x *= global_state.scale;
  global_state.center_y *= global_state.scale;
}

void StateMove(float dx, float dy) {
  global_state.center_x += dx;
  global_state.center_y -= dy;
}

void StateZoom(float dz, float mx, float my) {
  if (dz == 0) return;

  float dx = mx - global_state.width / 2;
  float dy = my - global_state.height / 2;

  global_state.center_x -= dx;
  global_state.center_y += dy;

  global_state.center_x /= global_state.scale;
  global_state.center_y /= global_state.scale;

  if (dz > 0) global_state.scale *= 1.1;
  else
    global_state.scale /= 1.1;

  // printf("%f\n", global_state.scale);

  global_state.center_x *= global_state.scale;
  global_state.center_y *= global_state.scale;

  global_state.center_x += dx;
  global_state.center_y -= dy;
}
