import { useEffect, useRef } from 'react';
import { type MotionValue } from 'motion/react';
import { particleTargets, type ParticleShape } from './particleShapes';
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
varying vec4 v_ink;
void main() {
  vec2 clip = a_position / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = u_pointSize * (0.63 + a_ink.a * 0.65);
  v_ink = a_ink;
}`;

const fragmentSource = `
precision mediump float;
varying vec4 v_ink;
void main() {
  float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
  if (distanceFromCenter > 0.5) discard;
  gl_FragColor = vec4(v_ink.rgb, (1.0 - smoothstep(0.17, 0.5, distanceFromCenter)) * v_ink.a);
}`;

const palette = [
  [0.58, 0.32, 0.97],
  [0.43, 0.56, 1],
  [0.76, 0.54, 1],
  [0.85, 0.87, 1],
  [0.95, 0.48, 0.78],
] as const;

function createRenderer(canvas: HTMLCanvasElement, positions: Float32Array, ink: Float32Array) {
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

  return {
    draw(width: number, height: number, pointSize: number) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(size, pointSize);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
      gl.drawArrays(gl.POINTS, 0, positions.length / 2);
    },
    dispose,
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
    const count = compact ? 860 : 1620;
    const names = shapeKey ? shapeKey.split(',') as ParticleShape[] : ['orbit' as const];
    const targets = names.map(name => particleTargets(name, count));
    const positions = new Float32Array(count * 2);
    const velocity = new Float32Array(count * 2);
    const ink = new Float32Array(count * 4);
    const fallbackInks = Array.from({ length: count }, (_, i) => {
      const color = palette[(i * 17 + Math.floor(i / 13)) % palette.length];
      const alpha = i > count * 0.87 ? 0.22 + (i % 9) * 0.045 : 0.55 + (i % 9) * 0.05;
      ink.set([...color, alpha], i * 4);
      return `rgba(${color.map(channel => Math.round(channel * 255)).join(',')},${alpha})`;
    });

    let renderer = createRenderer(canvas, positions, ink);
    let context2d: CanvasRenderingContext2D | null = null;
    let visible = false;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let dirty = true;
    let reset = true;
    let frame = 0;
    let lastTick = 0;
    let pointer = { x: -1000, y: -1000, vx: 0, vy: 0, active: false };
    let settled = 0;

    function setFallback() {
      if (!canvas || !alternate || !host) return;
      alternate.hidden = !!renderer;
      canvas.hidden = !renderer;
      if (!renderer) context2d = alternate.getContext('2d');
      host.dataset.particleRenderer = renderer ? 'webgl' : 'canvas';
    }

    function drawFallback(pointSize: number) {
      if (!context2d || !alternate) return;
      context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      context2d.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        context2d.fillStyle = fallbackInks[i];
        context2d.beginPath();
        context2d.arc(positions[i * 2], positions[i * 2 + 1], pointSize * (0.28 + ink[i * 4 + 3] * 0.2), 0, Math.PI * 2);
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

      const raw = calm ? 0 : Math.min(1, Math.max(0, progress?.get() ?? 0));
      const phase = raw * (targets.length - 1);
      const index = Math.floor(phase);
      const targetA = targets[index];
      const targetB = targets[Math.min(index + 1, targets.length - 1)];
      // Leave each silhouette intact long enough to read it, then morph on scroll.
      const fraction = Math.min(1, Math.max(0, (phase - index - 0.22) / 0.56));
      const blend = fraction * fraction * (3 - 2 * fraction);
      const radius = Math.min(width, height) * 0.408;
      const pointerRadius = Math.min(width, height) * 0.24;
      const pointSize = compact ? 2.15 : 2.75;
      const time = now * 0.00072;
      let motionLeft = 0;
      const hovering = pointer.active && !calm;

      for (let p = 0; p < positions.length; p += 2) {
        const targetX = width * 0.5 + (targetA[p] + (targetB[p] - targetA[p]) * blend) * radius;
        const targetY = height * 0.5 + (targetA[p + 1] + (targetB[p + 1] - targetA[p + 1]) * blend) * radius;
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
        if (hovering || (dirty && fraction > 0 && fraction < 1)) {
          const angle = Math.sin(x * 0.013 + time) * Math.cos(y * 0.013 + time) * Math.PI * 2;
          fx += Math.cos(angle) * 0.15;
          fy += Math.sin(angle) * 0.15;
        }
        if (hovering) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 0.5 && distanceSquared < pointerRadius * pointerRadius) {
            const distance = Math.sqrt(distanceSquared);
            const strength = (1 - distance / pointerRadius) ** 2;
            fx += dx / distance * strength * 10 + pointer.vx * strength * 0.1;
            fy += dy / distance * strength * 10 + pointer.vy * strength * 0.1;
          }
        }
        velocity[p] = (velocity[p] + fx * dt) * 0.78;
        velocity[p + 1] = (velocity[p + 1] + fy * dt) * 0.78;
        positions[p] += velocity[p] * dt;
        positions[p + 1] += velocity[p + 1] * dt;
        motionLeft = Math.max(motionLeft, Math.abs(velocity[p]), Math.abs(velocity[p + 1]));
      }

      if (renderer) renderer.draw(width, height, pointSize * dpr);
      else drawFallback(pointSize);
      reset = false;
      dirty = false;
      pointer.vx *= 0.6;
      pointer.vy *= 0.6;
      settled = motionLeft < 0.08 ? settled + 1 : 0;
      if (!calm && (hovering || settled < 4)) frame = requestAnimationFrame(tick);
    }

    function refresh() {
      dirty = true;
      settled = 0;
      if (visible && !document.hidden && !frame) {
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      for (const element of [canvas, alternate]) {
        element.width = Math.ceil(width * dpr);
        element.height = Math.ceil(height * dpr);
      }
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
      refresh();
    }

    function pointerLeave() {
      pointer.active = false;
      refresh();
    }

    function visibilityChanged() {
      if (document.hidden) stop();
      else refresh();
    }

    function motionChanged() {
      reset = true;
      pointer.active = false;
      refresh();
    }

    function contextLost(event: Event) {
      event.preventDefault();
      renderer?.dispose();
      renderer = null;
      setFallback();
      refresh();
    }

    const watchSize = new ResizeObserver(resize);
    const watchVisibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        reset = true;
        refresh();
      } else {
        pointer.active = false;
        stop();
      }
    });
    const unsubscribe = progress?.on('change', () => {
      if (!reducedMotion.matches) refresh();
    });

    setFallback();
    watchSize.observe(host);
    watchVisibility.observe(host);
    host.addEventListener('pointermove', pointerMove, { passive: true });
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
      host.removeEventListener('pointerleave', pointerLeave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', visibilityChanged);
      reducedMotion.removeEventListener('change', motionChanged);
      renderer?.dispose();
    };
  }, [shapeKey, progress]);

  return (
    <div ref={field} className={`particle-illustration${className ? ` ${className}` : ''}`} role="img" aria-label={label}>
      <canvas ref={primary} aria-hidden="true" />
      <canvas ref={fallback} aria-hidden="true" hidden />
    </div>
  );
}
