#include "render.h"

#include <GL/glew.h>
#include <stdio.h>
#include <stdlib.h>

#include "../shaders/mandelbrot.h"
#include "state.h"

static GLuint main_program;

static GLint u_center;
static GLint u_scale;
static GLint u_resolution;

static const char *shader_type_str(GLuint type) {
  switch (type) {
    case GL_VERTEX_SHADER: return "vertex shader";
    case GL_FRAGMENT_SHADER: return "fragment shader";
    default: return "uknown shader";
  }
}

static GLuint compile_shader(const char *src, GLuint type) {
  GLuint shader = glCreateShader(type);
  glShaderSource(shader, 1, &src, NULL);
  glCompileShader(shader);

  int res;
  glGetShaderiv(shader, GL_COMPILE_STATUS, &res);

  if (!res) {
    int length;
    glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &length);
    char *msg = malloc(length * sizeof(char));
    glGetShaderInfoLog(shader, length, &length, msg);
    fprintf(stderr, "Failed to compile %s: %s\n", shader_type_str(type), msg);
    free(msg);
    glDeleteShader(shader);
    return 0;
  }

  return shader;
}

static GLuint create_program(const char *vertex_src, const char *fragment_src) {
  GLuint program = glCreateProgram();
  GLuint vertex_shader = compile_shader(vertex_src, GL_VERTEX_SHADER);
  GLuint fragment_shader = compile_shader(fragment_src, GL_FRAGMENT_SHADER);

  glAttachShader(program, vertex_shader);
  glAttachShader(program, fragment_shader);
  glLinkProgram(program);
  glValidateProgram(program);

  glDeleteShader(vertex_shader);
  glDeleteShader(fragment_shader);

  return program;
}

void render_init() {
  main_program = create_program(mandelbrot_vert, mandelbrot_frag);
  glUseProgram(main_program);

  u_center = glGetUniformLocation(main_program, "u_center");
  u_scale = glGetUniformLocation(main_program, "u_scale");
  u_resolution = glGetUniformLocation(main_program, "u_resolution");

  GLint u_maxiter = glGetUniformLocation(main_program, "u_maxiter");
  glUniform1f(u_maxiter, 1024.0);

  GLuint avo;
  glCreateVertexArrays(1, &avo);
  glBindVertexArray(avo);
};

void render_update() {
  glClear(GL_COLOR_BUFFER_BIT);

  glUniform2f(u_center, global_state.center_x, global_state.center_y);
  glUniform1f(u_scale, global_state.scale);
  glUniform2f(u_resolution, global_state.width, global_state.height);

  glDrawArrays(GL_TRIANGLES, 0, 6);
}
