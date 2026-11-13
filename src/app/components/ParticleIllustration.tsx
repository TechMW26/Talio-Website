import { useEffect, useRef } from 'react';
import { type MotionValue } from 'motion/react';
import { PARTICLE_OUTLINE_SHARE, particleTargets, type ParticleShape } from './particleShapes';
import '@/styles/particle-illustration.css';

export type { ParticleShape } from './particleShapes';

type ParticleIllustrationProps = {
  shapes: readonly ParticleShape[];
  label: string;
  progress?: MotionValue<number>;
  className?: string;
};

// WebGL points, spring assembly, curl flow and cursor force adapted from
// Lightswind UI's Animated Particles. See ATTRIBUTIONS.md for the source and license.
const vertexSource = `
attribute vec2 a_position;
attribute vec4 a_ink;
uniform vec2 u_resolution;
uniform float u_pointSize;
uniform float u_energy;
varying vec4 v_ink;
void main() {
  vec2 clip = a_position / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
  float glint = step(0.98, a_ink.a);
  gl_PointSize = u_pointSize * (0.76 + a_ink.a * 0.55 + glint * 0.72 + u_energy * 0.3);
  v_ink = a_ink;
}`;

const fragmentSource = `
precision mediump float;
varying vec4 v_ink;
void main() {
  vec2 offset = abs(gl_PointCoord - vec2(0.5));
  float distanceFromCenter = length(offset);
  if (distanceFromCenter > 0.5) discard;
  float core = 1.0 - smoothstep(0.0, 0.26, distanceFromCenter);
  float glow = 1.0 - smoothstep(0.23, 0.5, distanceFromCenter);
  float glint = step(0.98, v_ink.a) * (1.0 - smoothstep(0.02, 0.10, min(offset.x, offset.y)));
  gl_FragColor = vec4(mix(v_ink.rgb, vec3(1.0), core * 0.45), max(glow * 0.7 + core * 0.3, glint * glow) * v_ink.a);
}`;

const palette = [
  [0.73, 0.46, 1],
  [0.43, 0.70, 1],
  [0.86, 0.63, 1],
  [0.84, 0.89, 1],
  [1, 0.57, 0.83],
] as const;

const MAX_WEBGL_STAGES = 4;
let webglStages = 0;

function createRenderer(canvas: HTMLCanvasElement, positions: Float32Array, ink: Float32Array) {
  if (webglStages >= MAX_WEBGL_STAGES) return null;
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  function compile(kind: number, source: string) {
    if (!gl) return null;
    const shader = gl.createShader(kind);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  const positionBuffer = gl.createBuffer();
  const inkBuffer = gl.createBuffer();

  function dispose() {
    gl?.deleteShader(vertex);
    gl?.deleteShader(fragment);
    gl?.deleteProgram(program);
    gl?.deleteBuffer(positionBuffer);
    gl?.deleteBuffer(inkBuffer);
  }

  if (!vertex || !fragment || !program || !positionBuffer || !inkBuffer) {
    dispose();
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }

  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const resolution = gl.getUniformLocation(program, 'u_resolution');
  const size = gl.getUniformLocation(program, 'u_pointSize');
  const energy = gl.getUniformLocation(program, 'u_energy');
  const position = gl.getAttribLocation(program, 'a_position');
  const pointInk = gl.getAttribLocation(program, 'a_ink');
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, inkBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ink, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(pointInk);
  gl.vertexAttribPointer(pointInk, 4, gl.FLOAT, false, 0, 0);
  webglStages++;

  return {
    draw(width: number, height: number, pointSize: number, burst: number) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(size, pointSize);
      gl.uniform1f(energy, burst);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
      gl.drawArrays(gl.POINTS, 0, positions.length / 2);
    },
    dispose() {
      webglStages--;
      dispose();
    },
  };
}

export function ParticleIllustration({ shapes, label, progress, className }: ParticleIllustrationProps) {
  const field = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLCanvasElement>(null);
  const shapeKey = shapes.join(',');

  useEffect(() => {
    const host = field.current;
    const canvas = primary.current;
    const alternate = fallback.current;
    if (!host || !canvas || !alternate) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 680px)').matches;
    const count = compact ? 960 : 1860;
    const outlineCount = Math.floor(count * PARTICLE_OUTLINE_SHARE);
    const names = shapeKey ? shapeKey.split(',') as ParticleShape[] : ['orbit' as const];
    const targets: (Float32Array | undefined)[] = [];
    const positions = new Float32Array(count * 2);
    const velocity = new Float32Array(count * 2);
    const ink = new Float32Array(count * 4);
    const fallbackInks = Array.from({ length: count }, (_, i) => {
      const color = palette[(i * 17 + Math.floor(i / 13)) % palette.length];
      const alpha = i % 31 === 0 ? 1 : i >= outlineCount ? 0.27 + (i % 9) * 0.04 : 0.68 + (i % 9) * 0.034;
      ink.set([...color, alpha], i * 4);
      return `rgba(${color.map(channel => Math.round(channel * 255)).join(',')},${alpha})`;
    });

    let renderer: ReturnType<typeof createRenderer> = null;
    let context2d: CanvasRenderingContext2D | null = null;
    let initialized = false;
    let visible = false;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let dirty = true;
    let reset = true;
    let frame = 0;
    let lastTick = 0;
    let phaseAtLastFrame = Number.NaN;
    let burst = 0;
    let haloAngle = 0;
    let rippledAt = -1000;
    let pointerMovedAt = -1000;
    let pointer = { x: -1000, y: -1000, vx: 0, vy: 0, active: false };
    let settled = 0;

    function setFallback() {
      if (!canvas || !alternate || !host) return;
      alternate.hidden = !!renderer;
      canvas.hidden = !renderer;
      if (!renderer) context2d = alternate.getContext('2d');
      host.dataset.particleRenderer = renderer ? 'webgl' : 'canvas';
    }

    function initialize() {
      if (initialized || !canvas) return;
      initialized = true;
      renderer = createRenderer(canvas, positions, ink);
      setFallback();
      resize();
    }

    function drawFallback(pointSize: number) {
      if (!context2d || !alternate) return;
      context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      context2d.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        context2d.fillStyle = fallbackInks[i];
        context2d.beginPath();
        const alpha = ink[i * 4 + 3];
        const radius = pointSize * (alpha >= 0.98 ? 0.72 : 0.22 + alpha * 0.24);
        context2d.arc(positions[i * 2], positions[i * 2 + 1], radius, 0, Math.PI * 2);
        context2d.fill();
      }
    }

    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      const calm = reducedMotion.matches;
      if (lastTick && now - lastTick < (compact ? 29 : 15) && !reset) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(1.9, lastTick ? (now - lastTick) / 16.7 : 1);
      lastTick = now;

      const raw = Math.min(1, Math.max(0, progress?.get() ?? 0));
      const lastShape = names.length - 1;
      const scrollPhase = raw * lastShape;
      const phase = calm ? Math.round(scrollPhase) : scrollPhase;
      const index = Math.floor(phase);
      // Leave each silhouette intact long enough to read it, then morph on scroll.
      const fraction = Math.min(1, Math.max(0, (phase - index - 0.28) / 0.44));
      const blend = fraction * fraction * (3 - 2 * fraction);
      const start = fraction === 1 ? Math.min(index + 1, lastShape) : index;
      const end = fraction === 0 ? start : Math.min(index + 1, lastShape);
      const targetA = targets[start] ??= particleTargets(names[start], count);
      const targetB = targets[end] ??= particleTargets(names[end], count);
      const arc = Math.sin(Math.PI * blend);
      const radius = Math.min(width, height) * 0.455;
      const pointerRadius = Math.min(width, height) * 0.3;
      const time = now * 0.00072;
      let motionLeft = 0;
      const hovering = pointer.active && !calm;
      const stirring = hovering && now - pointerMovedAt < 180;
      const jump = Math.abs(phase - phaseAtLastFrame);
      if (jump >= 0.1 && !reset && !calm) burst = Math.max(burst, Math.min(jump * 2, 1));
      phaseAtLastFrame = phase;
      burst = calm ? 0 : burst * Math.pow(0.92, dt);
      const energy = Math.min(1, arc * 0.75 + burst * 0.7);
      const pointSize = (compact ? 2.7 : 3.25) * (1 + energy * 0.12);
      haloAngle += dt * (energy * 0.022 + (stirring ? 0.004 : 0));
      const haloCos = Math.cos(haloAngle);
      const haloSin = Math.sin(haloAngle);
      const rippleAge = (now - rippledAt) / 460;
      const rippling = !calm && rippleAge < 1;
      if (host) {
        const shape = names[Math.round(phase)];
        if (host.dataset.particleShape !== shape) host.dataset.particleShape = shape;
      }

      for (let p = 0; p < positions.length; p += 2) {
        const particle = p / 2;
        const xA = targetA[p];
        const yA = targetA[p + 1];
        const dx = targetB[p] - xA;
        const dy = targetB[p + 1] - yA;
        const curl = (particle % 2 === 0 ? 1 : -1) * arc * 0.32;
        let assembledX = xA + dx * blend - dy * curl;
        let assembledY = yA + dy * blend + dx * curl;
        if (particle >= outlineCount && !calm) {
          const orbitScale = 1 + burst * 0.16;
          const orbitX = assembledX * haloCos - assembledY * haloSin;
          assembledY = (assembledX * haloSin + assembledY * haloCos) * orbitScale;
          assembledX = orbitX * orbitScale;
        } else if (burst > 0.035) {
          const flare = 1 + burst * (particle % 4 === 0 ? 0.42 : 0.18);
          assembledX *= flare;
          assembledY *= flare;
        }
        const targetX = width * 0.5 + assembledX * radius;
        const targetY = height * 0.5 + assembledY * radius;
        if (reset || calm) {
          positions[p] = targetX;
          positions[p + 1] = targetY;
          velocity[p] = velocity[p + 1] = 0;
          continue;
        }

        const x = positions[p];
        const y = positions[p + 1];
        let fx = (targetX - x) * 0.088;
        let fy = (targetY - y) * 0.088;
        if (stirring || (dirty && energy > 0)) {
          const angle = Math.sin(x * 0.013 + time) * Math.cos(y * 0.013 + time) * Math.PI * 2;
          fx += Math.cos(angle) * 0.36;
          fy += Math.sin(angle) * 0.36;
        }
        if (hovering || rippling) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 0.5 && distanceSquared < pointerRadius * pointerRadius) {
            const distance = Math.sqrt(distanceSquared);
            const strength = (1 - distance / pointerRadius) ** 1.6;
            const wave = rippling ? Math.max(0, 1 - Math.abs(distance / pointerRadius - rippleAge) * 3) * (1 - rippleAge) * 27 : 0;
            const push = strength * (hovering ? 17 : 0) + wave;
            fx += dx / distance * push + pointer.vx * strength * 0.16;
            fy += dy / distance * push + pointer.vy * strength * 0.16;
          }
        }
        velocity[p] = (velocity[p] + fx * dt) * 0.78;
        velocity[p + 1] = (velocity[p + 1] + fy * dt) * 0.78;
        positions[p] += velocity[p] * dt;
        positions[p + 1] += velocity[p + 1] * dt;
        motionLeft = Math.max(motionLeft, Math.abs(velocity[p]), Math.abs(velocity[p + 1]));
      }

      if (renderer) renderer.draw(width, height, pointSize * dpr, energy);
      else drawFallback(pointSize);
      reset = false;
      dirty = false;
      pointer.vx *= 0.6;
      pointer.vy *= 0.6;
      settled = motionLeft < 0.08 ? settled + 1 : 0;
      if (!calm && (stirring || rippling || burst > 0.035 || settled < 4)) frame = requestAnimationFrame(tick);
    }

    function refresh() {
      dirty = true;
      settled = 0;
      if (initialized && visible && !document.hidden && !frame) {
        lastTick = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function resize() {
      if (!host || !canvas || !alternate) return;
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.75, Math.sqrt(1_200_000 / (width * height)));
      if (!initialized) return;
      const active = renderer ? canvas : alternate;
      const canvasWidth = Math.ceil(width * dpr);
      const canvasHeight = Math.ceil(height * dpr);
      if (active.width !== canvasWidth) active.width = canvasWidth;
      if (active.height !== canvasHeight) active.height = canvasHeight;
      reset = true;
      refresh();
    }

    function pointerMove(event: PointerEvent) {
      if (!host || event.pointerType === 'touch' || reducedMotion.matches) return;
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      pointer = {
        x, y, active: true,
        vx: pointer.active ? Math.max(-35, Math.min(35, x - pointer.x)) : 0,
        vy: pointer.active ? Math.max(-35, Math.min(35, y - pointer.y)) : 0,
      };
      pointerMovedAt = performance.now();
      host.dataset.particlePointer = 'true';
      refresh();
    }

    function pointerDown(event: PointerEvent) {
      if (!host || reducedMotion.matches) return;
      const bounds = host.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      rippledAt = performance.now();
      refresh();
    }

    function pointerLeave() {
      pointer.active = false;
      if (host) delete host.dataset.particlePointer;
      refresh();
    }

    function visibilityChanged() {
      if (document.hidden) stop();
      else refresh();
    }

    function motionChanged() {
      reset = true;
      pointer.active = false;
      if (host) delete host.dataset.particlePointer;
      refresh();
    }

    function contextLost(event: Event) {
      event.preventDefault();
      renderer?.dispose();
      renderer = null;
      setFallback();
      resize();
    }

    const watchSize = new ResizeObserver(resize);
    const watchVisibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (host) host.dataset.particleVisible = String(visible);
      if (visible) {
        initialize();
        reset = true;
        refresh();
      } else {
        pointer.active = false;
        if (host) delete host.dataset.particlePointer;
        stop();
      }
    });
    const unsubscribe = progress?.on('change', refresh);

    watchSize.observe(host);
    watchVisibility.observe(host);
    host.addEventListener('pointermove', pointerMove, { passive: true });
    host.addEventListener('pointerdown', pointerDown, { passive: true });
    host.addEventListener('pointerleave', pointerLeave);
    canvas.addEventListener('webglcontextlost', contextLost);
    document.addEventListener('visibilitychange', visibilityChanged);
    reducedMotion.addEventListener('change', motionChanged);
    resize();

    return () => {
      stop();
      unsubscribe?.();
      watchSize.disconnect();
      watchVisibility.disconnect();
      host.removeEventListener('pointermove', pointerMove);
      host.removeEventListener('pointerdown', pointerDown);
      host.removeEventListener('pointerleave', pointerLeave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', visibilityChanged);
      reducedMotion.removeEventListener('change', motionChanged);
      renderer?.dispose();
      canvas.width = canvas.height = 1;
      alternate.width = alternate.height = 1;
    };
  }, [shapeKey, progress]);

  return (
    <div ref={field} className={`particle-illustration${className ? ` ${className}` : ''}`} role="img" aria-label={label}>
      <div className="particle-orbit" aria-hidden="true"><i /><i /></div>
      <canvas ref={primary} aria-hidden="true" />
      <canvas ref={fallback} aria-hidden="true" hidden />
    </div>
  );
}
