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
#define STRIPES 5.0

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
  float orbits = 0.0;
  while (len < BAILOUT && iter < u_maxiter) {
    dz = 2.0 * cmul(z, dz);
    z = cmul(z, z) + c;
    len = dot(z, z);
    iter += 1.0;
    orbits += 0.5 + 0.5 * sin(STRIPES * atan(z.y, z.x));
  }
  
  if (iter < u_maxiter) {
    float nu = log2(log2(len) / 2.0);
    float fnu = floor(1.0 - nu);
    float iter1 = (iter + fnu);
    float iter2 = (iter + 1.0 + fnu);
    float interp = 1.0 - nu - fnu;
    vec3 albedo = mix(palette(iter1), palette(iter2), interp);

    vec2 grad = normalize(cmul(z, vec2(dz.x, -dz.y)));
    float normal = 0.8 + 0.2 * (grad.x + grad.y);

    float last_orbit = 0.5 + 0.5 * sin(STRIPES * atan(z.y, z.x));
    float last_delta = orbits - last_orbit;

    orbits /= iter;
    last_delta /= (iter - 1.0);
    float t = -1.0 + log2(2.0 * log(BAILOUT)) - log2(0.5 * log(len));
    float stripe_ac = 1.0 - mix(t * orbits + (1.0 - t) * last_delta, 0.0, 0.5);

    vec3 col = albedo * normal;
    out_color = vec4(col, 1.0);
  } else {
    out_color = vec4(0.0, 0.0, 0.0, 1.0);
  }
}
