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

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

out vec4 out_color;

void main() {
  vec2 c = out_uv;
  vec2 z = out_uv;
  vec2 dz = vec2(1.0, 0.0);

  float iter = 0.0;
  float len = dot(z, z);
  while (len < BAILOUT && iter < u_maxiter) {
    dz = 2.0 * cmul(z, dz);
    z = cmul(z, z) + c;
    len = dot(z, z);
    iter += 1.0;
  }
  
  if (iter < u_maxiter) {
    float nu = log2(log2(len) / 2.0);
    float fnu = floor(1.0 - nu);

    float iter1 = (iter + fnu);
    float iter2 = (iter + 1.0 + fnu);

    float interp = 1.0 - nu - fnu;

    vec2 grad = normalize(cmul(z, vec2(dz.x, -dz.y)));
    vec3 col = mix(palette(iter1), palette(iter2), interp) * (0.8 + 0.2 * (grad.x + grad.y));

    out_color = vec4(col, 1.0);
  } else {
    out_color = vec4(0.0, 0.0, 0.0, 1.0);
  }
}
