const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl2')

async function compile_shader(url, type) {
  const code = await (await fetch(url)).text()
  const shader = gl.createShader(type)

  gl.shaderSource(shader, code)
  gl.compileShader(shader)

  return shader
}

async function create_program(vert_url, frag_url) {
  const program = gl.createProgram()
  const [vertext_shader, fragment_shader] = await Promise.all([
    compile_shader(vert_url, gl.VERTEX_SHADER),
    compile_shader(frag_url, gl.FRAGMENT_SHADER)
  ])

  gl.attachShader(program, vertext_shader)
  gl.attachShader(program, fragment_shader)

  gl.linkProgram(program)
  gl.validateProgram(program)

  gl.deleteShader(vertext_shader)
  gl.deleteShader(fragment_shader)

  return program
}

const program = await create_program(
  './shaders/mandelbrot.vert',
  './shaders/mandelbrot.frag'
)

gl.useProgram(program)

const u_resolution = gl.getUniformLocation(program, 'u_resolution')
const u_center = gl.getUniformLocation(program, 'u_center')
const u_scale = gl.getUniformLocation(program, 'u_scale')
const u_maxiter = gl.getUniformLocation(program, 'u_maxiter')

gl.uniform1f(u_maxiter, 256)

const avo = gl.createVertexArray()
gl.bindVertexArray(avo)

let center_x = canvas.width / 6
let center_y = 0
let scale = relative_scale()
let zoom_level = 1
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.uniform2f(u_resolution, canvas.width, canvas.height)
  gl.uniform2f(u_center, center_x, center_y)
  gl.uniform1f(u_scale, scale)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function relative_scale() {
  return Math.min(canvas.width, canvas.height) / 3
}

function resize() {
  center_x /= scale
  center_y /= scale

  scale /= relative_scale()

  canvas.width = innerWidth
  canvas.height = innerHeight

  scale *= relative_scale()

  gl.viewport(0, 0, canvas.width, canvas.height)

  center_x *= scale
  center_y *= scale

  render()
}

let is_dragging = false
let last_x, last_y
function start_drag(e) {
  last_x = e.clientX
  last_y = e.clientY

  is_dragging = true
}

function move(e) {
  if (is_dragging) {
    center_x += e.clientX - last_x
    center_y -= e.clientY - last_y

    last_x = e.clientX
    last_y = e.clientY
  }

  render()
}

function zoom(e) {
  const dx = e.clientX - canvas.width / 2
  const dy = e.clientY - canvas.height / 2

  center_x -= dx
  center_y += dy

  center_x /= scale
  center_y /= scale

  zoom_level -= e.deltaY / 100
  scale = relative_scale() * Math.pow(1.1, zoom_level)

  center_x *= scale
  center_y *= scale

  center_x += dx
  center_y -= dy

  render()
}

addEventListener('resize', resize)
addEventListener('mousemove', move)
addEventListener('mousedown', start_drag)
addEventListener('mouseup', () => is_dragging = false)
addEventListener('wheel', zoom)

// TODO: Implement touch control

resize()
