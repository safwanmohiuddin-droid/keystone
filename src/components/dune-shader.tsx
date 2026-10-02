"use client";

import { useEffect, useRef } from "react";

const vert = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const frag = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(3.1, 1.5) + u_pointer * 0.05;
  float ridge = fbm(p + vec2(u_time * 0.035, u_time * 0.012));
  float crest = smoothstep(0.42, 0.68, ridge);
  vec3 night = vec3(0.05, 0.04, 0.03);
  vec3 sand = vec3(0.55, 0.40, 0.22);
  vec3 sky = vec3(0.12, 0.22, 0.32);
  vec3 col = mix(sky, night, smoothstep(0.0, 0.38, uv.y));
  col = mix(col, sand, smoothstep(0.22, 0.95, uv.y) * (0.25 + ridge * 0.9));
  col += vec3(0.86, 0.70, 0.34) * crest * 0.35 * uv.y;
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function DuneShader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl || reduce) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const res = gl.getUniformLocation(program, "u_res");
    const time = gl.getUniformLocation(program, "u_time");
    const pointer = gl.getUniformLocation(program, "u_pointer");
    const aim = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      current.x += (aim.x - current.x) * 0.04;
      current.y += (aim.y - current.y) * 0.04;
      gl.uniform2f(res, canvas.width, canvas.height);
      gl.uniform1f(time, now / 1000);
      gl.uniform2f(pointer, current.x, current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const onMove = (event: PointerEvent) => {
      aim.x = event.clientX / window.innerWidth - 0.5;
      aim.y = event.clientY / window.innerHeight - 0.5;
    };
    const onHide = () => {
      if (document.hidden) cancelAnimationFrame(frame);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("visibilitychange", onHide);
    frame = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onHide);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={ref} className="dune-shader" aria-hidden="true" />;
}
