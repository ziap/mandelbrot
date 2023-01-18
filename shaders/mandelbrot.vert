#version 300 es

#ifdef GL_ES
precision highp float;
#endif

void main() {
  vec4 uv;
  int id = gl_VertexID;

  uv.x = (id % 2 != 0) ? 1.0 : -1.0;
  uv.y = ((id + 4) % 6 < 3) ? 1.0 : -1.0;
  uv.z = 0.0;
  uv.w = 1.0;
  gl_Position = uv;
}
