#version 330 core

void main() {
  // uv  | % 3 | + id / 3 | % 2 | * 2 - 1 |
  // ----+-----+----------+-----+---------+
  // 0 2 | 0 2 | 0 2      | 0 0 | -1 -1   | bottom left
  // 1 3 | 1 0 | 1 0      | 1 0 | +1 -1   | bottom right
  // 2 4 | 2 1 | 2 1      | 0 1 | -1 +1   | top    left
  // 3 5 | 0 2 | 1 3      | 1 1 | +1 +1   | top    right
  // 4 6 | 1 0 | 2 1      | 0 1 | -1 +1   | top    left
  // 5 7 | 2 1 | 3 2      | 1 0 | +1 -1   | bottom right

  vec2 uv = vec2(gl_VertexID, gl_VertexID + 2);
  uv = mod(uv, 3);
  uv = uv + gl_VertexID / 3;
  uv = mod(uv, 2);
  gl_Position = vec4(uv * 2 - 1, 0.0, 1.0);
};
