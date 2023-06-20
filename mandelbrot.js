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
let zoom_level = 0
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
function mouse_down(e) {
  last_x = e.clientX
  last_y = e.clientY

  is_dragging = true
}

function mouse_move(e) {
  if (!is_dragging) return
  center_x += e.movementX
  center_y -= e.movementY

  last_x = e.clientX
  last_y = e.clientY

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

function get_touch_pos(touches) {
  let touch_x = 0
  let touch_y = 0

  for (const touch of touches) {
    touch_x += touch.clientX / touches.length
    touch_y += touch.clientY / touches.length
  }

  return [touch_x, touch_y]
}

function get_pinch_dist(touches) {
  let dist = 0

  for (let i = 0; i < touches.length - 1; ++i) {
    for (let j = 0; j < touches.length; ++j) {
      const dx = touches[i].clientX - touches[j].clientX
      const dy = touches[i].clientY - touches[j].clientY

      dist = Math.max(dist, Math.hypot(dx, dy))
    }
  }

  return dist
}

let is_touching = false
let last_touch_pos
let last_dist = 0

function touch_start(e) {
  last_touch_pos = get_touch_pos(e.touches)
  last_dist = get_pinch_dist(e.touches)
  is_touching = true
  e.preventDefault()
}

function touch_end(e) {
  last_touch_pos = get_touch_pos(e.touches)
  last_dist = 0

  if (e.touches.length == 0) is_touching = false
  e.preventDefault()
}

function touch_move(e) {
  const new_touch_pos = get_touch_pos(e.touches)
  const new_dist = get_pinch_dist(e.touches)

  const dx = new_touch_pos[0] - last_touch_pos[0]
  const dy = new_touch_pos[1] - last_touch_pos[1]

  center_x += dx
  center_y -= dy

  if (last_dist != 0) {
    const dx = new_touch_pos[0] - canvas.width / 2
    const dy = new_touch_pos[1] - canvas.height / 2

    center_x -= dx
    center_y += dy

    center_x /= scale
    center_y /= scale

    scale *= new_dist / last_dist

    center_x *= scale
    center_y *= scale

    center_x += dx
    center_y -= dy
  }
  
  render()

  last_touch_pos = new_touch_pos
  last_dist = new_dist
  e.preventDefault()
}

canvas.addEventListener('mousemove', mouse_move)
canvas.addEventListener('mousedown', mouse_down)
canvas.addEventListener('mouseup', () => is_dragging = false)
canvas.addEventListener('wheel', zoom)

canvas.addEventListener('touchmove', touch_move)
canvas.addEventListener('touchstart', touch_start)
canvas.addEventListener('touchend', touch_end)

addEventListener('resize', resize)
resize()
