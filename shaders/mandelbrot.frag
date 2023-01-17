#version 330 core

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;

vec3 color_offset = vec3(0.55, 0.35, 0.15);

#define HUE_SCALE 50.0
#define BAILOUT (1 << 20)
#define PI2 6.283185307179586
#define MAX_ITER 1024

vec3 palette(float iter) {
  return 0.5 + 0.5 * sin(PI2 * (color_offset + iter / HUE_SCALE));
}

void main() {
  vec2 c = (gl_FragCoord.xy - u_resolution / 2 - u_center) / u_scale;

  float xx = 0;
  float yy = 0;
  float w = 0;
  float len = 0;

  int iter = 0;
  while (len < BAILOUT && iter < MAX_ITER) {
    float x = xx - yy + c.x;
    float y = w - xx - yy + c.y;
    float xy = x + y;

    xx = x * x;
    yy = y * y;
    len = xx + yy;
    w = xy * xy;
    ++iter;
  }
  
  if (iter < MAX_ITER) {
    float nu = log2(log2(len) / 2);
    float fnu = floor(1 - nu);

    float iter1 = (iter + fnu);
    float iter2 = (iter + 1 + fnu);

    float interp = 1 - nu - fnu;

    gl_FragColor = vec4(mix(palette(iter1), palette(iter2), interp), 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
};
