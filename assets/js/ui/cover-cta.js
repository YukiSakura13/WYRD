const PARTICLE_TARGET_IDLE = 8;
const PARTICLE_TARGET_HOVER = 30;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function drawRoundedClip(ctx, width, height) {
  const x = 12;
  const y = 12;
  const w = width - 24;
  const h = height - 26;
  const r = 28;

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
  const baseAlpha = 0.042 + activeLevel * 0.06;
  const glowAlpha = baseAlpha + breath * (0.018 + activeLevel * 0.026);
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.86, 2, width * 0.5, height * 0.86, width * 0.52);

  glow.addColorStop(0, `rgba(208,216,226,${glowAlpha})`);
  glow.addColorStop(0.42, `rgba(198,204,212,${glowAlpha * 0.48})`);
  glow.addColorStop(1, "rgba(208,216,226,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = glow;
  ctx.fillRect(12, 12, width - 24, height - 26);
  ctx.restore();
}

function drawActiveVeil(ctx, width, height, time, activeLevel) {
  if (activeLevel <= 0.01) return;

  const sweep = 0.5 + Math.sin((time * Math.PI * 2) / 3.8) * 0.5;
  const centerY = height * (0.76 - sweep * 0.34);
  const veilAlpha = 0.034 * activeLevel;
  const veil = ctx.createLinearGradient(0, centerY - height * 0.18, 0, centerY + height * 0.18);

  veil.addColorStop(0, "rgba(224,231,238,0)");
  veil.addColorStop(0.42, `rgba(224,231,238,${veilAlpha * 0.72})`);
  veil.addColorStop(0.58, `rgba(224,231,238,${veilAlpha})`);
  veil.addColorStop(1, "rgba(224,231,238,0)");

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = veil;
  ctx.fillRect(width * 0.1, centerY - height * 0.22, width * 0.8, height * 0.44);
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

    const particle = {
      x: rand(rect.width * 0.13, rect.width * 0.87),
      y: rect.height - rand(18, 34),
      baseX: 0,
      size: rand(1.2, state.hover ? 3.2 : 2.4),
      speed: rand(8, state.hover ? 34 : 17),
      drift: rand(5, state.hover ? 20 : 11),
      phase: rand(0, Math.PI * 2),
      life: 0,
      maxLife: rand(2.8, state.hover ? 3.9 : 5.4),
      alpha: rand(0.24, state.hover ? 0.7 : 0.42),
    };
    particle.baseX = particle.x;
    state.particles.push(particle);
  }

  function spawnOrnamentSpark(width, height) {
    state.ornamentSparks.push({
      x: width * 0.5 + rand(-36, 36),
      y: height * 0.18 + rand(-7, 8),
      size: rand(1.2, state.hover ? 2.8 : 2.4),
      life: 0,
      maxLife: rand(1.3, 2.1),
      drift: rand(-4, 4),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.22, state.hover ? 0.56 : 0.4),
    });
  }

  function drawParticles(width, height, dt) {
    const exitLift = state.exiting ? Math.min(1, state.exitElapsed / 0.24) : 0;

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.life += dt;
      p.y -= p.speed * (1 + exitLift * 0.18) * dt;
      p.x = p.baseX + Math.sin(p.phase + p.life * 2.2) * p.drift;

      const fadeIn = Math.min(1, p.life / 0.6);
      const fadeOut = Math.max(0, 1 - p.life / p.maxLife);
      const alpha = p.alpha * fadeIn * fadeOut;

      ctx.beginPath();
      ctx.fillStyle = `rgba(224,231,238,${alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life > p.maxLife || p.y < 14) {
        state.particles.splice(i, 1);
      }
    }
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
    ctx.save();
    drawRoundedClip(ctx, width, height);
    drawEmberGlow(ctx, width, height, state.emberClock, state.activeLevel);
    drawActiveVeil(ctx, width, height, state.emberClock, state.activeLevel);

    if (!state.exiting) {
      const spawnCount = state.hover ? 4 : 1;
      for (let i = 0; i < spawnCount; i += 1) {
        if (Math.random() < (state.hover ? 0.34 : 0.08)) spawnParticle();
      }
    }

    if (state.ornamentSparks.length < (state.hover ? 4 : 2) && Math.random() < (state.hover ? 0.028 : 0.005)) {
      spawnOrnamentSpark(width, height);
    }

    drawParticles(width, height, dt);
    drawOrnamentSparks(dt);
    ctx.restore();

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
