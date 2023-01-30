#version 300 es

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_scale;

out vec2 out_uv;

void main() {
  int id = gl_VertexID;

  vec2 uv;
  uv.x = float(id % 2 != 0);
  uv.y = float((id + 4) % 6 < 3);

  gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  out_uv = ((uv - 0.5) * u_resolution - u_center) / u_scale;
}
