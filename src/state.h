#ifndef STATE_H
#define STATE_H

typedef struct {
  float center_x;
  float center_y;

  float width;
  float height;

  float scale;
} State;

extern State global_state;

void StateInit(float, float);
void StateResize(float, float);
void StateMove(float, float);
void StateZoom(float, float, float);

#endif
