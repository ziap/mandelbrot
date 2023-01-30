#version 300 es

#ifdef GL_ES
precision highp float;
#endif

uniform float u_maxiter;

in vec2 out_uv;

vec3 color_offset = vec3(0.55, 0.35, 0.15);

#define HUE_SCALE 50.0
#define BAILOUT float(1 << 20)
#define PI2 6.283185307179586

vec3 palette(float iter) {
  return 0.5 + 0.5 * sin(PI2 * (color_offset + iter / HUE_SCALE));
}

out vec4 out_color;

void main() {
  vec2 c = out_uv;

  float xx = 0.0;
  float yy = 0.0;
  float w = 0.0;
  float len = 0.0;

  float iter = 0.0;
  while (len < BAILOUT && iter < u_maxiter) {
    float x = xx - yy + c.x;
    float y = w - xx - yy + c.y;
    float xy = x + y;

    xx = x * x;
    yy = y * y;
    len = xx + yy;
    w = xy * xy;
    iter += 1.0;
  }
  
  if (iter < u_maxiter) {
    float nu = log2(log2(len) / 2.0);
    float fnu = floor(1.0 - nu);

    float iter1 = (iter + fnu);
    float iter2 = (iter + 1.0 + fnu);

    float interp = 1.0 - nu - fnu;

    out_color = vec4(mix(palette(iter1), palette(iter2), interp), 1.0);
  } else {
    out_color = vec4(0.0, 0.0, 0.0, 1.0);
  }
}
