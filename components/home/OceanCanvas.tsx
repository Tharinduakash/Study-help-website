"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; radius: number; speed: number; drift: number; phase: number; alpha: number };
type Point = { x: number; y: number };
type Swimmer = {
  // Stored in the fish's own direction of travel; left-swimmers are mirrored when drawn.
  spine: Point[];
  size: number;
  mirrored: boolean;
  lane: number;
  heading: number;
  speed: number;
  burst: number;
  nextBurst: number;
  beat: number;
  seed: number;
};
type Rib = Point & { nx: number; ny: number; tx: number; ty: number };

const tau = Math.PI * 2;
const lastNode = 35;
const bodyEnd = 20;
const between = (low: number, high: number) => low + Math.random() * (high - low);
const ribs: Rib[] = Array.from({ length: lastNode + 1 }, () => ({ x: 0, y: 0, nx: 0, ny: 0, tx: 0, ty: 0 }));

// One fish, which stays in its own band of open water above or below the headline.
function makeSwimmer(width: number, height: number, anywhere: boolean, upper: boolean): Swimmer {
  const size = width < 768 ? between(120, 140) : between(180, 220);
  const start = anywhere ? between(width * 0.15, width * 0.85) : -size * 0.2;
  const lane = upper ? between(height * 0.15, height * 0.23) : between(height * 0.79, height * 0.87);
  const gap = size / lastNode;
  return {
    spine: Array.from({ length: lastNode + 1 }, (_, index) => ({ x: start - index * gap, y: lane })),
    size,
    mirrored: Math.random() < 0.5,
    lane,
    heading: 0,
    speed: between(0.5, 0.75),
    burst: 0,
    nextBurst: between(1500, 4500),
    beat: Math.random() * tau,
    seed: Math.random() * tau,
  };
}

// Moves the head, then lets each node trail the one in front, so the whole fish
// curves through turns.
function swim(fish: Swimmer, time: number, step: number, height: number, away: Point | null) {
  fish.nextBurst -= step * 16.7;
  if (fish.nextBurst <= 0) {
    fish.burst = between(1.1, 2.2);
    fish.nextBurst = between(3000, 7000);
  }
  if (away) {
    fish.burst = Math.max(fish.burst, 2.8);
    fish.heading += Math.sign(fish.spine[0].y - away.y || 1) * 0.04 * step;
  }
  fish.burst *= 0.982 ** step;

  const wander = Math.sin(time / 2300 + fish.seed) * 0.3 + Math.sin(time / 870 + fish.seed * 2) * 0.1;
  const toLane = Math.max(-0.5, Math.min(0.5, (fish.lane - fish.spine[0].y) * 0.006));
  fish.heading += (wander + toLane - fish.heading) * 0.03 * step;

  const pace = fish.speed + fish.burst;
  fish.beat += (0.06 + pace * 0.085) * step;
  const head = fish.spine[0];
  head.x += Math.cos(fish.heading) * pace * step;
  head.y = Math.max(height * 0.04, Math.min(height * 0.96, head.y + Math.sin(fish.heading) * pace * step));

  const gap = fish.size / lastNode;
  for (let index = 1; index <= lastNode; index++) {
    const lead = fish.spine[index - 1];
    const node = fish.spine[index];
    const angle = Math.atan2(lead.y - node.y, lead.x - node.x);
    node.x = lead.x - Math.cos(angle) * gap;
    node.y = lead.y - Math.sin(angle) * gap;
  }
}

// Half-depth of the body at a point from nose (0) to tail base (1): a round belly, a narrow tail joint.
const bodyDepth = (along: number, size: number) => size * (0.018 * along + 0.132 * Math.sin(Math.PI * along ** 0.82));

// Adds the swimming wave to the spine and works out which way each point faces.
function buildRibs(fish: Swimmer) {
  const strength = 0.6 + Math.min(fish.speed + fish.burst, 2.4) * 0.34;
  for (let index = 0; index <= lastNode; index++) {
    const along = index / lastNode;
    const node = fish.spine[index];
    const swing = Math.sin(fish.beat - along * 5.2) * fish.size * (0.003 + 0.085 * along * along) * strength;
    ribs[index].x = node.x;
    ribs[index].y = node.y + swing;
  }
  for (let index = 0; index <= lastNode; index++) {
    const front = ribs[Math.max(0, index - 1)];
    const back = ribs[Math.min(lastNode, index + 1)];
    const length = Math.hypot(front.x - back.x, front.y - back.y) || 1;
    const rib = ribs[index];
    rib.tx = (front.x - back.x) / length;
    rib.ty = (front.y - back.y) / length;
    rib.nx = -rib.ty;
    rib.ny = rib.tx;
  }
  return strength;
}

function fillGradient(context: CanvasRenderingContext2D, from: Point, to: Point, stops: [number, string][]) {
  const gradient = context.createLinearGradient(from.x, from.y, to.x, to.y);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  return gradient;
}

// The long flowing tail. Each lobe trails the body and ripples on its own.
function drawTail(context: CanvasRenderingContext2D, fish: Swimmer) {
  const { size, beat } = fish;
  const edge = (index: number, side: number) => {
    const rib = ribs[index];
    const flow = (index - bodyEnd) / (lastNode - bodyEnd);
    const spread = size * (0.025 + 0.3 * flow ** 1.25) * side;
    const flutter = Math.sin(beat * 0.8 - flow * 6 + side) * size * 0.035 * flow;
    return { x: rib.x + rib.nx * (spread + flutter), y: rib.y + rib.ny * (spread + flutter) };
  };

  context.fillStyle = fillGradient(context, ribs[bodyEnd], ribs[lastNode], [
    [0, "rgba(22, 104, 165, 0.92)"],
    [0.5, "rgba(70, 165, 210, 0.5)"],
    [1, "rgba(170, 225, 242, 0.14)"],
  ]);
  context.beginPath();
  let point = edge(bodyEnd, -1);
  context.moveTo(point.x, point.y);
  for (let index = bodyEnd + 1; index <= lastNode; index++) {
    point = edge(index, -1);
    context.lineTo(point.x, point.y);
  }
  const notch = ribs[lastNode - 5];
  const tip = edge(lastNode, 1);
  context.quadraticCurveTo(ribs[lastNode].x, ribs[lastNode].y, notch.x, notch.y);
  context.quadraticCurveTo(ribs[lastNode].x, ribs[lastNode].y, tip.x, tip.y);
  for (let index = lastNode - 1; index >= bodyEnd; index--) {
    point = edge(index, 1);
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fill();

  context.strokeStyle = "rgba(222, 246, 255, 0.2)";
  context.lineWidth = 0.55;
  for (let ray = -7; ray <= 7; ray++) {
    if (ray === 0) continue;
    const side = ray / 7.4;
    context.beginPath();
    for (let index = bodyEnd; index <= lastNode - (Math.abs(ray) < 3 ? 6 : 1); index++) {
      const rib = ribs[index];
      const flow = (index - bodyEnd) / (lastNode - bodyEnd);
      const reach = size * (0.025 + 0.3 * flow ** 1.25) * side + Math.sin(beat * 0.8 - flow * 6 + side) * size * 0.035 * flow;
      if (index === bodyEnd) context.moveTo(rib.x + rib.nx * reach, rib.y + rib.ny * reach);
      else context.lineTo(rib.x + rib.nx * reach, rib.y + rib.ny * reach);
    }
    context.stroke();
  }
}

// A fin rooted along the body: `top` chooses the back or the belly.
function drawSailFin(context: CanvasRenderingContext2D, fish: Swimmer, first: number, last: number, reach: number, top: boolean, speed: number) {
  const { size, beat } = fish;
  const sign = top ? -1 : 1;
  const root = (index: number) => {
    const rib = ribs[index];
    const depth = bodyDepth(index / bodyEnd, size) * (top ? 0.92 : 1.1) * 0.94;
    return { x: rib.x + rib.nx * depth * sign, y: rib.y + rib.ny * depth * sign };
  };
  const tip = (index: number) => {
    const rib = ribs[index];
    const place = (index - first) / (last - first);
    const height = size * reach * Math.sin(Math.PI * Math.min(1, place * 0.92 + 0.08)) ** 0.7;
    const ripple = Math.sin(beat * speed - place * 5) * size * 0.022;
    const base = root(index);
    return {
      x: base.x + rib.nx * height * sign - rib.tx * (height * 0.55 + ripple),
      y: base.y + rib.ny * height * sign - rib.ty * (height * 0.55 + ripple),
    };
  };

  const start = root(first);
  const peak = tip(Math.round((first + last) / 2));
  context.fillStyle = fillGradient(context, start, peak, [[0, "rgba(18, 92, 150, 0.9)"], [1, "rgba(140, 210, 235, 0.22)"]]);
  context.beginPath();
  context.moveTo(start.x, start.y);
  for (let index = first; index <= last; index++) {
    const point = tip(index);
    context.lineTo(point.x, point.y);
  }
  for (let index = last; index >= first; index--) {
    const point = root(index);
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fill();

  context.strokeStyle = "rgba(222, 246, 255, 0.2)";
  context.lineWidth = 0.55;
  context.beginPath();
  for (let index = first; index <= last - 1; index += 0.5) {
    const lower = Math.floor(index);
    const mix = index - lower;
    const fromA = root(lower);
    const fromB = root(lower + 1);
    const toA = tip(lower);
    const toB = tip(lower + 1);
    context.moveTo(fromA.x + (fromB.x - fromA.x) * mix, fromA.y + (fromB.y - fromA.y) * mix);
    context.lineTo(toA.x + (toB.x - toA.x) * mix, toA.y + (toB.y - toA.y) * mix);
  }
  context.stroke();
}

function drawBody(context: CanvasRenderingContext2D, fish: Swimmer) {
  const { size } = fish;
  const mid = ribs[8];
  const depth = bodyDepth(8 / bodyEnd, size);

  const outline = () => {
    context.beginPath();
    for (let index = 0; index <= bodyEnd; index++) {
      const rib = ribs[index];
      const half = bodyDepth(index / bodyEnd, size) * 0.92;
      if (index === 0) context.moveTo(rib.x - rib.nx * half, rib.y - rib.ny * half);
      else context.lineTo(rib.x - rib.nx * half, rib.y - rib.ny * half);
    }
    for (let index = bodyEnd; index >= 0; index--) {
      const rib = ribs[index];
      const half = bodyDepth(index / bodyEnd, size) * 1.1;
      context.lineTo(rib.x + rib.nx * half, rib.y + rib.ny * half);
    }
    context.closePath();
  };

  outline();
  context.fillStyle = fillGradient(
    context,
    { x: mid.x - mid.nx * depth, y: mid.y - mid.ny * depth },
    { x: mid.x + mid.nx * depth * 1.1, y: mid.y + mid.ny * depth * 1.1 },
    [[0, "#08274a"], [0.3, "#0d5590"], [0.58, "#2a93c8"], [0.8, "#a6dcea"], [1, "#eef8fa"]],
  );
  context.fill();

  // Scales, clipped to the body so they curve with it.
  context.save();
  outline();
  context.clip();
  const radius = size * 0.0155;
  const scalePath = new Path2D();
  for (let index = 6; index <= bodyEnd - 1; index++) {
    const rib = ribs[index];
    const half = bodyDepth(index / bodyEnd, size);
    const angle = Math.atan2(rib.ty, rib.tx);
    for (let row = -4; row <= 4; row++) {
      const offset = (row + (index % 2) * 0.5) * (half / 4.2);
      const x = rib.x + rib.nx * offset;
      const y = rib.y + rib.ny * offset;
      scalePath.moveTo(x + Math.cos(angle + Math.PI / 2) * radius, y + Math.sin(angle + Math.PI / 2) * radius);
      scalePath.arc(x, y, radius, angle + Math.PI / 2, angle + Math.PI * 1.5, false);
    }
  }
  context.lineWidth = 0.9;
  context.strokeStyle = "rgba(4, 30, 60, 0.26)";
  context.stroke(scalePath);
  context.save();
  context.translate(size * 0.002, size * 0.002);
  context.lineWidth = 0.5;
  context.strokeStyle = "rgba(225, 248, 255, 0.24)";
  context.stroke(scalePath);
  context.restore();

  // A soft wet sheen along the upper flank, and a darker head and tail end.
  const sheen = context.createRadialGradient(mid.x, mid.y - depth * 0.3, 0, mid.x, mid.y - depth * 0.3, size * 0.2);
  sheen.addColorStop(0, "rgba(235, 250, 255, 0.34)");
  sheen.addColorStop(1, "rgba(235, 250, 255, 0)");
  context.fillStyle = sheen;
  context.fillRect(mid.x - size * 0.3, mid.y - size * 0.3, size * 0.6, size * 0.6);
  context.fillStyle = fillGradient(context, ribs[0], ribs[bodyEnd], [[0, "rgba(5, 34, 66, 0.5)"], [0.26, "rgba(5, 34, 66, 0)"], [0.72, "rgba(5, 34, 66, 0)"], [1, "rgba(5, 34, 66, 0.42)"]]);
  context.fillRect(mid.x - size * 0.5, mid.y - size * 0.4, size, size * 0.8);
  context.restore();

  // Gill cover, then eye.
  const gill = ribs[5];
  const gillDepth = bodyDepth(5 / bodyEnd, size);
  const gillAngle = Math.atan2(gill.ty, gill.tx);
  context.strokeStyle = "rgba(5, 34, 66, 0.3)";
  context.lineWidth = size * 0.005;
  context.beginPath();
  context.ellipse(gill.x + gill.tx * size * 0.03, gill.y + gill.ty * size * 0.03, size * 0.035, gillDepth * 0.72, gillAngle, -Math.PI / 2, Math.PI / 2);
  context.stroke();

  const eyeRib = ribs[2];
  const eyeX = eyeRib.x - eyeRib.nx * size * 0.024;
  const eyeY = eyeRib.y - eyeRib.ny * size * 0.024;
  const mouth = ribs[0];
  context.strokeStyle = "rgba(4, 26, 50, 0.6)";
  context.lineWidth = size * 0.004;
  context.beginPath();
  context.moveTo(mouth.x + mouth.nx * size * 0.006, mouth.y + mouth.ny * size * 0.006);
  context.quadraticCurveTo(mouth.x - mouth.tx * size * 0.018, mouth.y - mouth.ty * size * 0.018 + size * 0.008, mouth.x - mouth.tx * size * 0.03 + mouth.nx * size * 0.012, mouth.y - mouth.ty * size * 0.03 + mouth.ny * size * 0.012);
  context.stroke();

  // Amber iris, as on a real goldfish.
  context.fillStyle = "#c9a662";
  context.beginPath();
  context.arc(eyeX, eyeY, size * 0.0155, 0, tau);
  context.fill();
  context.fillStyle = "#04121f";
  context.beginPath();
  context.arc(eyeX + eyeRib.tx * size * 0.002, eyeY + eyeRib.ty * size * 0.002, size * 0.0098, 0, tau);
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(eyeX + size * 0.004, eyeY - size * 0.004, size * 0.0026, 0, tau);
  context.fill();
}

// The side fin behind the gills, sculling at its own slower rhythm.
function drawSideFin(context: CanvasRenderingContext2D, fish: Swimmer) {
  const { size, beat } = fish;
  const rib = ribs[7];
  const x = rib.x + rib.nx * size * 0.05;
  const y = rib.y + rib.ny * size * 0.05;
  const open = 0.85 + Math.sin(beat * 0.55) * 0.4;
  const angle = Math.atan2(-rib.ty, -rib.tx) - open;
  const length = size * 0.125;
  const spreadA = angle - 0.42;
  const spreadB = angle + 0.42;
  const end = { x: x + Math.cos(angle) * length, y: y + Math.sin(angle) * length };

  context.fillStyle = fillGradient(context, { x, y }, end, [[0, "rgba(50, 140, 195, 0.75)"], [1, "rgba(190, 232, 245, 0.2)"]]);
  context.beginPath();
  context.moveTo(x, y);
  context.quadraticCurveTo(x + Math.cos(spreadA) * length, y + Math.sin(spreadA) * length, end.x, end.y);
  context.quadraticCurveTo(x + Math.cos(spreadB) * length, y + Math.sin(spreadB) * length, x, y);
  context.fill();
}

function drawSwimmer(context: CanvasRenderingContext2D, fish: Swimmer) {
  buildRibs(fish);
  context.lineCap = "round";
  context.lineJoin = "round";
  drawTail(context, fish);
  drawSailFin(context, fish, 6, 17, 0.135, true, 0.7);
  drawSailFin(context, fish, 14, 19, 0.1, false, 0.9);
  drawSailFin(context, fish, 9, 12, 0.11, false, 0.6);
  drawBody(context, fish);
  drawSideFin(context, fish);
}

// A calm underwater backdrop: rising particles and two fish. Pauses off-screen
// and draws one still frame for visitors who prefer reduced motion.
export function OceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lastTime = 0;
    let particles: Particle[] = [];
    let swimmers: Swimmer[] = [];
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(90, Math.round((width * height) / 15000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 2.2,
        speed: 0.08 + Math.random() * 0.34,
        drift: 8 + Math.random() * 22,
        phase: Math.random() * tau,
        alpha: 0.18 + Math.random() * 0.55,
      }));
      swimmers = [makeSwimmer(width, height, true, true), makeSwimmer(width, height, true, false)];
    };

    const draw = (time: number, step: number) => {
      context.clearRect(0, 0, width, height);

      swimmers.forEach((fish, index) => {
        const head = fish.spine[0];
        const pointerX = fish.mirrored ? width - pointer.x : pointer.x;
        const near = Math.hypot(head.x - pointerX, head.y - pointer.y) < fish.size * 1.1;
        if (step > 0) swim(fish, time, step, height, near ? { x: pointerX, y: pointer.y } : null);

        context.save();
        if (fish.mirrored) {
          context.translate(width, 0);
          context.scale(-1, 1);
        }
        drawSwimmer(context, fish);
        context.restore();
        if (fish.spine[lastNode].x > width + 40) swimmers[index] = makeSwimmer(width, height, false, index === 0);
      });

      for (const particle of particles) {
        const x = particle.x + Math.sin(time / 2600 + particle.phase) * particle.drift;
        context.beginPath();
        context.arc(x, particle.y, particle.radius, 0, tau);
        context.fillStyle = `rgba(114, 229, 242, ${particle.alpha})`;
        context.fill();
        particle.y -= particle.speed * step;
        if (particle.y < -8) particle.y = height + 8;
      }
    };

    const loop = (time: number) => {
      // Elapsed time keeps speed the same on 60 Hz and 120 Hz screens.
      const step = Math.min((time - (lastTime || time)) / 16.7, 3);
      lastTime = time;
      if (visible) draw(time, step);
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
    };

    resize();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(canvas);
    const onResize = () => {
      resize();
      if (reduced) draw(0, 0);
    };
    window.addEventListener("resize", onResize);
    if (reduced) {
      draw(0, 0);
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />;
}
