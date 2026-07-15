const PARTICLE_TARGET_IDLE = 18;
const PARTICLE_TARGET_HOVER = 30;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function drawRoundedClip(ctx, width, height) {
  const x = 18;
  const y = 22;
  const w = width - 36;
  const h = height - 47;
  const r = 18;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.clip();
}

function drawEmberGlow(ctx, width, height, time, activeLevel) {
  const breath = 0.5 + Math.sin((time * Math.PI * 2) / 4.8) * 0.5;
  const baseAlpha = 0.024 + activeLevel * 0.026;
  const glowAlpha = baseAlpha + breath * (0.014 + activeLevel * 0.012);
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.56, 2, width * 0.5, height * 0.56, width * 0.48);

  glow.addColorStop(0, `rgba(206,218,230,${glowAlpha})`);
  glow.addColorStop(0.46, `rgba(176,190,204,${glowAlpha * 0.42})`);
  glow.addColorStop(1, "rgba(208,216,226,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = glow;
  ctx.fillRect(18, 22, width - 36, height - 47);
  ctx.restore();
}

export function createCoverCtaAnimation(button) {
  const canvas = button?.querySelector(".cover-cta-canvas");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!button || !canvas || prefersReduced) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const state = {
    particles: [],
    ornamentSparks: [],
    hover: false,
    exiting: false,
    exitElapsed: 0,
    activeLevel: 0,
    last: performance.now(),
    emberClock: 0,
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnParticle(force = false) {
    const rect = canvas.getBoundingClientRect();
    const target = state.hover ? PARTICLE_TARGET_HOVER : PARTICLE_TARGET_IDLE;
    if (!force && state.particles.length >= target) return;

    const kindRoll = Math.random();
    const kind = kindRoll < 0.11 ? "star" : kindRoll < 0.82 ? "spark" : "dust";
    const leftStream = Math.random() < 0.5;
    const x = leftStream
      ? rand(rect.width * 0.12, rect.width * 0.36)
      : rand(rect.width * 0.64, rect.width * 0.88);
    const hoverBoost = state.hover ? 1.12 : 1;

    const style = kind === "star"
      ? {
          alpha: rand(0.76, 0.94),
          halo: rand(8, 12),
          maxLife: rand(3.4, 4.6),
          size: rand(1.7, 2.6),
          speed: rand(10, 17),
        }
      : kind === "spark"
        ? {
            alpha: rand(0.5, 0.76),
            halo: rand(5, 8),
            maxLife: rand(3.2, 5),
            size: rand(1.4, 2.5),
            speed: rand(10, state.hover ? 28 : 20),
          }
        : {
            alpha: rand(0.2, 0.36),
            halo: rand(2.5, 4),
            maxLife: rand(4.2, 6.2),
            size: rand(0.65, 1.2),
            speed: rand(5, 11),
          };

    const particle = {
      x,
      y: rect.height - rand(18, 34),
      baseX: x,
      targetX: rect.width * 0.5 + rand(-26, 26),
      kind,
      size: style.size * hoverBoost,
      halo: style.halo * hoverBoost,
      speed: style.speed * hoverBoost,
      drift: rand(3, state.hover ? 14 : 9),
      phase: rand(0, Math.PI * 2),
      life: 0,
      maxLife: style.maxLife,
      alpha: Math.min(0.94, style.alpha * hoverBoost),
    };
    state.particles.push(particle);
  }

  function spawnOrnamentSpark(width, height) {
    state.ornamentSparks.push({
      x: width * 0.5 + rand(-9, 9),
      y: height * 0.18 + rand(-2, 3),
      size: rand(0.9, state.hover ? 1.8 : 1.5),
      life: 0,
      maxLife: rand(0.9, 1.4),
      drift: rand(-1.5, 1.5),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.34, state.hover ? 0.68 : 0.54),
    });
  }

  function drawParticles(width, height, dt) {
    const exitLift = state.exiting ? Math.min(1, state.exitElapsed / 0.24) : 0;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.life += dt;
      p.y -= p.speed * (1 + exitLift * 0.18) * dt;
      const steerRate = state.exiting ? 1.8 : p.y < height * 0.4 ? 0.58 : 0.07;
      p.baseX += (p.targetX - p.baseX) * Math.min(1, dt * steerRate);
      p.x = p.baseX + Math.sin(p.phase + p.life * 2.2) * p.drift;

      const fadeIn = Math.min(1, p.life / 0.35);
      const fadeOut = Math.min(1, Math.max(0, (p.maxLife - p.life) / 0.8));
      const exitBrightness = state.exiting ? 1.12 : 1;
      const twinkle = p.kind === "star" ? 0.76 + Math.sin(p.phase + p.life * 4.2) * 0.24 : 1;
      const topEdgeFade = Math.min(1, Math.max(0, (p.y - 22) / 10));
      const alpha = Math.min(1, p.alpha * fadeIn * fadeOut * exitBrightness * twinkle * topEdgeFade);

      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.halo);
      halo.addColorStop(0, `rgba(236,242,247,${alpha * 0.5})`);
      halo.addColorStop(0.32, `rgba(190,205,219,${alpha * 0.24})`);
      halo.addColorStop(1, "rgba(160,178,196,0)");
      ctx.beginPath();
      ctx.fillStyle = halo;
      ctx.arc(p.x, p.y, p.halo, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = p.kind === "dust"
        ? `rgba(205,216,226,${alpha})`
        : `rgba(242,246,249,${alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.kind === "star" && alpha > 0.18) {
        const ray = p.halo * (0.38 + twinkle * 0.18);
        ctx.strokeStyle = `rgba(237,243,248,${alpha * 0.62})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x - ray, p.y);
        ctx.lineTo(p.x + ray, p.y);
        ctx.moveTo(p.x, p.y - ray);
        ctx.lineTo(p.x, p.y + ray);
        ctx.stroke();
      }

      if (p.life > p.maxLife || p.y < 20) {
        state.particles.splice(i, 1);
      }
    }

    ctx.restore();
  }

  function drawOrnamentSparks(dt) {
    for (let i = state.ornamentSparks.length - 1; i >= 0; i -= 1) {
      const p = state.ornamentSparks[i];
      p.life += dt;
      p.x += p.drift * dt;
      p.y -= 2.2 * dt;

      const fadeIn = Math.min(1, p.life / 0.45);
      const fadeOut = Math.max(0, 1 - p.life / p.maxLife);
      const alpha = p.alpha * fadeIn * fadeOut;

      ctx.beginPath();
      ctx.fillStyle = `rgba(234,239,245,${alpha})`;
      ctx.arc(p.x + Math.sin(p.phase + p.life * 3) * 2.5, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life > p.maxLife) {
        state.ornamentSparks.splice(i, 1);
      }
    }
  }

  function frame(now) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    state.emberClock += dt;
    if (state.exiting) state.exitElapsed += dt;

    const targetActive = state.hover ? 1 : 0;
    const activeSpeed = targetActive > state.activeLevel ? 5.5 : 3.2;
    state.activeLevel += (targetActive - state.activeLevel) * Math.min(1, dt * activeSpeed);

    ctx.clearRect(0, 0, width, height);

    if (!state.exiting) {
      const spawnCount = state.hover ? 4 : 1;
      for (let i = 0; i < spawnCount; i += 1) {
        if (Math.random() < (state.hover ? 0.34 : 0.08)) spawnParticle();
      }
    }

    if (state.ornamentSparks.length < 1 && Math.random() < (state.hover ? 0.012 : 0.004)) {
      spawnOrnamentSpark(width, height);
    }

    ctx.save();
    drawRoundedClip(ctx, width, height);
    drawEmberGlow(ctx, width, height, state.emberClock, state.activeLevel);
    drawParticles(width, height, dt);
    ctx.restore();

    drawOrnamentSparks(dt);

    requestAnimationFrame(frame);
  }

  button.addEventListener("pointerenter", function handlePointerEnter() {
    state.hover = true;
    for (let i = 0; i < 14; i += 1) spawnParticle(true);
  });

  button.addEventListener("pointerleave", function handlePointerLeave() {
    state.hover = false;
  });

  button.addEventListener("focus", function handleFocus() {
    state.hover = true;
    for (let i = 0; i < 10; i += 1) spawnParticle(true);
  });

  button.addEventListener("blur", function handleBlur() {
    state.hover = false;
  });

  button.addEventListener("click", function handleActivation() {
    state.exiting = true;
    state.exitElapsed = 0;
    state.hover = false;
  });

  resize();
  for (let i = 0; i < PARTICLE_TARGET_IDLE; i += 1) spawnParticle(true);
  window.addEventListener("resize", resize);
  requestAnimationFrame(function start(time) {
    state.last = time;
    frame(time);
  });
}
