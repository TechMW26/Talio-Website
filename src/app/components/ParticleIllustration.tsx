import { useEffect, useRef } from 'react';
import { type MotionValue } from 'motion/react';
import { particleTargets, type ParticleShape } from './particleShapes';
import '@/styles/particle-illustration.css';

export type { ParticleShape } from './particleShapes';
export type ParticleFlight = 'rise' | 'sweep' | 'wave' | 'fold';

type ParticleIllustrationProps = {
  shapes: readonly ParticleShape[];
  label: string;
  progress?: MotionValue<number>;
  className?: string;
  flight?: ParticleFlight;
  align?: 'center' | 'bottom';
};

// WebGL points and cursor interaction adapted from
// Lightswind UI's Animated Particles. See ATTRIBUTIONS.md for the source and license.
const vertexSource = `
attribute vec2 a_position;
attribute float a_opacity;
uniform vec2 u_resolution;
uniform float u_pointSize;
varying float v_opacity;
void main() {
  vec2 clip = a_position / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = u_pointSize * (0.58 + a_opacity * 0.45);
  v_opacity = a_opacity;
}`;

const fragmentSource = `
precision mediump float;
varying float v_opacity;
void main() {
  float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
  float edge = 1.0 - smoothstep(0.27, 0.5, distanceFromCenter);
  gl_FragColor = vec4(vec3(1.0), edge * v_opacity);
}`;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

const MAX_WEBGL_STAGES = 4;
let webglStages = 0;

function createRenderer(canvas: HTMLCanvasElement, positions: Float32Array, opacity: Float32Array) {
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
  const opacityBuffer = gl.createBuffer();

  function dispose() {
    gl?.deleteShader(vertex);
    gl?.deleteShader(fragment);
    gl?.deleteProgram(program);
    gl?.deleteBuffer(positionBuffer);
    gl?.deleteBuffer(opacityBuffer);
  }

  if (!vertex || !fragment || !program || !positionBuffer || !opacityBuffer) {
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
  const pointOpacity = gl.getAttribLocation(program, 'a_opacity');
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, opacity, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(pointOpacity);
  gl.vertexAttribPointer(pointOpacity, 1, gl.FLOAT, false, 0, 0);
  webglStages++;

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
    dispose() {
      webglStages--;
      dispose();
    },
  };
}

export function ParticleIllustration({
  shapes, label, progress, className, flight = 'rise', align = 'center',
}: ParticleIllustrationProps) {
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
    const count = compact ? 900 : 1660;
    const names = shapeKey ? shapeKey.split(',') as ParticleShape[] : ['orbit' as const];
    const targets: (ReturnType<typeof particleTargets> | undefined)[] = [];
    const positions = new Float32Array(count * 2);
    const displacement = new Float32Array(count * 2);
    const opacity = Float32Array.from({ length: count }, (_, index) => 0.36 + (index % 15) * 0.044);
    const fallbackInks = Array.from(opacity, alpha => `rgba(255,255,255,${alpha})`);

    let renderer: ReturnType<typeof createRenderer> = null;
    let context2d: CanvasRenderingContext2D | null = null;
    let initialized = false;
    let visible = false;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let reset = true;
    let frame = 0;
    let lastTick = 0;
    let current = 0;
    let pointer: { x: number; y: number } | null = null;
    let ripple: { x: number; y: number; start: number } | null = null;

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
      renderer = createRenderer(canvas, positions, opacity);
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
        const radius = pointSize * (0.29 + opacity[i] * 0.22);
        context2d.arc(positions[i * 2], positions[i * 2 + 1], radius, 0, Math.PI * 2);
        context2d.fill();
      }
    }

    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      const calm = reducedMotion.matches;
      if (lastTick && now - lastTick < (compact ? 25 : 14) && !reset) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const elapsed = lastTick ? Math.min(50, now - lastTick) : 16.7;
      lastTick = now;
      const last = names.length - 1;
      const requested = clamp(progress?.get() ?? 0) * last;
      const follow = 1 - Math.exp(-elapsed / 70);
      if (reset || calm) current = calm ? Math.round(requested) : requested;
      else current += (requested - current) * follow;
      const moving = !calm && Math.abs(requested - current) > 0.002;
      if (!moving && !calm) current = requested;

      const index = Math.floor(current);
      const segment = current - index;
      const next = segment > 0 ? Math.min(index + 1, last) : index;
      const origin = targets[index] ??= particleTargets(names[index], count);
      const destination = targets[next] ??= particleTargets(names[next], count);
      const { points: from } = origin;
      const { points: to } = destination;
      const bottomAligned = align === 'bottom';
      const radius = Math.min(width * .43, height * (bottomAligned ? .47 : .39));
      const bottom = height - 1.8;
      const centerX = width * .5;
      const centerY = bottomAligned ? bottom : height * .5;
      const fromBaseline = bottomAligned ? origin.bottom : 0;
      const toBaseline = bottomAligned ? destination.bottom : 0;
      const pointerRadius = Math.min(width, height) * .2;
      const rippleAge = ripple ? (now - ripple.start) / 430 : 1;
      if (rippleAge >= 1) ripple = null;

      if (host) {
        const shape = names[Math.round(current)];
        if (host.dataset.particleShape !== shape) host.dataset.particleShape = shape;
      }

      let settling = false;
      for (let p = 0; p < positions.length; p += 2) {
        const startX = from[p];
        const endX = to[p];
        const startY = from[p + 1] - fromBaseline;
        const endY = to[p + 1] - toBaseline;
        const stagger = flight === 'rise' ? from[p + 1] * .095
          : flight === 'fold' ? Math.abs(startX) * .16 - .08 : startX * .095;
        const step = clamp((segment - .12 - stagger) / .76);
        const t = step * step * (3 - 2 * step);
        const bend = 2 * t * (1 - t);
        const band = Math.sin(startX * 5 + from[p + 1] * 3);
        const lift = flight === 'wave' ? .52 + band * .35 : flight === 'sweep' ? .44 + from[p + 1] * .18 : .72 + band * .12;
        const side = flight === 'fold' ? -(startX + endX) * .47
          : flight === 'sweep' ? .78 + band * .22
          : flight === 'wave' ? band * .38 : band * .15;

        // A quadratic Bézier between the two outline points. A small spatial
        // stagger releases groups in sequence and keeps the same path in reverse.
        const middleX = centerX + (startX + endX) * radius * .5;
        const middleY = centerY + (startY + endY) * radius * .5;
        const controlX = Math.max(2, Math.min(width - 2, middleX + side * radius));
        const controlY = Math.max(2, middleY - lift * radius);
        const x = centerX + (startX + (endX - startX) * t) * radius + bend * (controlX - middleX);
        const y = centerY + (startY + (endY - startY) * t) * radius + bend * (controlY - middleY);

        let pushX = 0;
        let pushY = 0;
        if (!calm && (pointer || ripple)) {
          if (pointer) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance > .1 && distance < pointerRadius) {
              const force = (1 - distance / pointerRadius) ** 2 * 12;
              pushX = dx / distance * force;
              pushY = dy / distance * force;
            }
          }
          if (ripple) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy);
            const wave = clamp(1 - Math.abs(distance / (pointerRadius * 1.6) - rippleAge) * 5) * (1 - rippleAge) * 9;
            if (distance > .1 && wave > 0) {
              pushX += dx / distance * wave;
              pushY += dy / distance * wave;
            }
          }
        }

        displacement[p] = reset || calm ? pushX : displacement[p] + (pushX - displacement[p]) * follow;
        displacement[p + 1] = reset || calm ? pushY : displacement[p + 1] + (pushY - displacement[p + 1]) * follow;
        if (Math.abs(pushX - displacement[p]) + Math.abs(pushY - displacement[p + 1]) > .08) settling = true;
        positions[p] = x + displacement[p];
        positions[p + 1] = y + displacement[p + 1];
      }

      const pointSize = compact ? 2.5 : 2.9;
      if (renderer) renderer.draw(width, height, pointSize * dpr);
      else drawFallback(pointSize);
      reset = false;
      if (!calm && (moving || settling || ripple)) frame = requestAnimationFrame(tick);
    }

    function refresh() {
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
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      host.dataset.particlePointer = 'true';
      refresh();
    }

    function pointerDown(event: PointerEvent) {
      if (!host || reducedMotion.matches) return;
      const bounds = host.getBoundingClientRect();
      ripple = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, start: performance.now() };
      refresh();
    }

    function pointerLeave() {
      pointer = null;
      if (host) delete host.dataset.particlePointer;
      refresh();
    }

    function visibilityChanged() {
      if (document.hidden) stop();
      else refresh();
    }

    function motionChanged() {
      reset = true;
      pointer = null;
      ripple = null;
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
        pointer = null;
        ripple = null;
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
  }, [shapeKey, progress, flight, align]);

  return (
    <div ref={field} className={`particle-illustration${className ? ` ${className}` : ''}`} role="img" aria-label={label}>
      <canvas ref={primary} aria-hidden="true" />
      <canvas ref={fallback} aria-hidden="true" hidden />
    </div>
  );
}
