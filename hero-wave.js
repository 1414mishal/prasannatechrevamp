// Dynamic wave canvas background — GPU-accelerated WebGL shader.
// Blue tones in dark mode ("night"), white with blue strokes in light ("morning").
// Renders on all devices; throttled to 15 fps on mobile for battery.
(function () {
  var canvas = document.getElementById('hero-wave-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none'; return;
  }

  var gl = canvas.getContext('webgl');
  if (!gl) return;

  var isMobile =
    window.matchMedia('(max-width: 1023px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;
  var DPR = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
  var TARGET_FPS = isMobile ? 15 : 60;
  var FRAME_INTERVAL = 1000 / TARGET_FPS;

  var vsSource = '\
    attribute vec4 aVertexPosition;\
    void main() { gl_Position = aVertexPosition; }\
  ';

  var fsSource = '\
    precision highp float;\
    uniform vec2 iResolution;\
    uniform float iTime;\
    uniform float iDark;\
    \
    void main() {\
      vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;\
      \
      float a = 0.0;\
      float d = 0.0;\
      for (int i = 0; i < 4; i++) {\
        a += cos(float(i) - d + iTime * 0.5 - a * uv.x);\
        d += sin(float(i) * uv.y + a);\
      }\
      \
      float wave = (sin(a) + cos(d)) * 0.5;\
      float intensity = 0.3 + 0.4 * wave;\
      float baseVal = 0.1 + 0.15 * cos(uv.x + uv.y + iTime * 0.3);\
      float blueAccent = 0.2 * sin(a * 1.5 + iTime * 0.2);\
      float purpleAccent = 0.15 * cos(d * 2.0 + iTime * 0.1);\
      \
      vec3 darkCol;\
      darkCol.r = clamp(baseVal * 0.15 + purpleAccent * 0.1, 0.0, 1.0) * intensity;\
      darkCol.g = clamp(baseVal * 0.25 + blueAccent * 0.3, 0.0, 1.0) * intensity;\
      darkCol.b = clamp(baseVal * 0.6 + blueAccent * 1.4 + purpleAccent * 0.3 + 0.18, 0.0, 1.0) * intensity;\
      \
      float stroke = max(0.0, sin(a * 3.0 + d * 2.0) * 0.6 + 0.1);\
      stroke = stroke * stroke;\
      float softWave = 0.02 * wave;\
      vec3 lightCol;\
      lightCol.r = min(1.0, 0.95 + softWave - stroke * 0.22);\
      lightCol.g = min(1.0, 0.96 + softWave - stroke * 0.10);\
      lightCol.b = min(1.0, 0.98 + softWave + stroke * 0.02);\
      \
      vec3 col = mix(lightCol, darkCol, iDark);\
      gl_FragColor = vec4(col, 1.0);\
    }\
  ';

  function loadShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('hero-wave shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
  var fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('hero-wave link:', gl.getProgramInfoLog(program));
    return;
  }

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  var vertexPositionLoc = gl.getAttribLocation(program, 'aVertexPosition');
  var resolutionLoc = gl.getUniformLocation(program, 'iResolution');
  var timeLoc = gl.getUniformLocation(program, 'iTime');
  var darkLoc = gl.getUniformLocation(program, 'iDark');

  function resize() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  var visible = true;
  new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { visible = entry.isIntersecting; });
  }).observe(canvas);

  var startTime = Date.now();
  var lastFrame = 0;

  function render(now) {
    requestAnimationFrame(render);
    if (!visible) return;
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;

    var time = (Date.now() - startTime) / 1000;
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ? 1.0 : 0.0;
    gl.useProgram(program);
    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, time);
    gl.uniform1f(darkLoc, dark);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexPositionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionLoc);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  requestAnimationFrame(render);
})();
