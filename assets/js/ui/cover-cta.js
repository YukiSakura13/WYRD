const MAGNETIC_CONFIG = Object.freeze({
  damping: 42,
  stiffness: 420,
  rangeX: 28,
  rangeY: 14,
  actionableArea: 42,
  attraction: 64,
  attractionRadius: 0.52,
  curl: 9,
  particleDamping: 31,
  particleStiffness: 240,
  touchPulse: 880,
  hoverParticleCeiling: 34,
  idleParticleCeiling: 12,
  touchIdleParticleCeiling: 18,
});

function random(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function createCoverCtaAnimation(button) {
  const canvas = button?.querySelector(".cover-cta-canvas");
  const context = canvas?.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)");
  const touchPresentation = coarsePointer.matches || window.innerWidth < 560;

  if (!button || !canvas || !context || reduceMotion.matches || canvas.dataset.glowMounted === "true") {
    return;
  }

  canvas.dataset.glowMounted = "true";
  button.dataset.magneticDust = "ready";

  const state = {
    active: 0,
    hover: false,
    touchUntil: 0,
    particles: [],
    spawnClock: 0,
    lastTime: performance.now(),
    magnet: {
      engaged: false,
      touch: false,
      pointerX: 0,
      pointerY: 0,
      focusX: 0,
      focusY: 0,
      targetX: 0,
      targetY: 0,
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      strength: 0,
    },
  };

  canvas.dataset.magneticState = "idle";

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function setMagneticState(engaged) {
    if (state.magnet.engaged === engaged) return;
    state.magnet.engaged = engaged;
    canvas.dataset.magneticState = engaged ? "active" : "idle";
    button.classList.toggle("is-magnetic", engaged);
  }

  function releaseMagnet() {
    setMagneticState(false);
    state.magnet.targetX = 0;
    state.magnet.targetY = 0;
  }

  function updateMagnetFromPoint(clientX, clientY, allowExpandedArea) {
    const rect = button.getBoundingClientRect();
    const area = allowExpandedArea ? MAGNETIC_CONFIG.actionableArea : 0;
    const withinBounds =
      clientX >= rect.left - area &&
      clientX <= rect.right + area &&
      clientY >= rect.top - area &&
      clientY <= rect.bottom + area;

    if (!withinBounds) {
      releaseMagnet();
      return false;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normalizedX = clamp((clientX - centerX) / Math.max(1, rect.width / 2), -1, 1);
    const normalizedY = clamp((clientY - centerY) / Math.max(1, rect.height / 2), -1, 1);

    state.magnet.pointerX = clamp(clientX - rect.left, 0, rect.width);
    state.magnet.pointerY = clamp(clientY - rect.top, 0, rect.height);
    if (!state.magnet.engaged) {
      state.magnet.focusX = state.magnet.pointerX;
      state.magnet.focusY = state.magnet.pointerY;
    }

    setMagneticState(true);
    state.magnet.targetX = normalizedX * MAGNETIC_CONFIG.rangeX;
    state.magnet.targetY = normalizedY * MAGNETIC_CONFIG.rangeY;
    return true;
  }

  function stepMagnet(delta) {
    const steps = Math.max(1, Math.ceil(delta / (1 / 120)));
    const step = delta / steps;

    for (let index = 0; index < steps; index += 1) {
      const accelerationX =
        (state.magnet.targetX - state.magnet.x) * MAGNETIC_CONFIG.stiffness -
        state.magnet.velocityX * MAGNETIC_CONFIG.damping;
      const accelerationY =
        (state.magnet.targetY - state.magnet.y) * MAGNETIC_CONFIG.stiffness -
        state.magnet.velocityY * MAGNETIC_CONFIG.damping;

      state.magnet.velocityX += accelerationX * step;
      state.magnet.velocityY += accelerationY * step;
      state.magnet.x += state.magnet.velocityX * step;
      state.magnet.y += state.magnet.velocityY * step;
    }

    const strengthTarget = state.magnet.engaged ? 1 : 0;
    const response = strengthTarget ? 8 : 4.8;
    state.magnet.strength +=
      (strengthTarget - state.magnet.strength) * Math.min(1, delta * response);

    const focusResponse = 1 - Math.exp(-delta * 12);
    state.magnet.focusX +=
      (state.magnet.pointerX - state.magnet.focusX) * focusResponse;
    state.magnet.focusY +=
      (state.magnet.pointerY - state.magnet.focusY) * focusResponse;

    if (
      !state.magnet.engaged &&
      Math.abs(state.magnet.x) < 0.01 &&
      Math.abs(state.magnet.y) < 0.01 &&
      Math.abs(state.magnet.velocityX) < 0.01 &&
      Math.abs(state.magnet.velocityY) < 0.01
    ) {
      state.magnet.x = 0;
      state.magnet.y = 0;
      state.magnet.velocityX = 0;
      state.magnet.velocityY = 0;
    }
  }

  function spawn(width, height) {
    const fromLeft = Math.random() < 0.5;
    const x = fromLeft
      ? random(width * 0.12, width * 0.35)
      : random(width * 0.65, width * 0.88);
    const bright = Math.random() < 0.18 + state.active * 0.08 + (touchPresentation ? 0.05 : 0);

    state.particles.push({
      x,
      baseX: x,
      targetX: width * 0.5 + random(-width * 0.05, width * 0.05),
      y: random(height * 0.64, height * 0.82),
      size: bright ? random(1.25, 1.9) : random(0.55, 1.15),
      halo: bright ? random(5.5, 8) : random(2.8, 5),
      speed: random(5, 11) * (1 + state.active * 0.68),
      drift: random(2, 7),
      phase: random(0, Math.PI * 2),
      alpha: bright
        ? random(touchPresentation ? 0.58 : 0.5, touchPresentation ? 0.84 : 0.78)
        : random(touchPresentation ? 0.24 : 0.18, touchPresentation ? 0.5 : 0.44),
      life: 0,
      maxLife: random(3.2, 5.3),
      depth: random(0.56, 1.16),
      magnetX: 0,
      magnetY: 0,
      magnetVelocityX: 0,
      magnetVelocityY: 0,
      magnetStiffness: MAGNETIC_CONFIG.particleStiffness * random(0.82, 1.18),
      magnetDamping: MAGNETIC_CONFIG.particleDamping * random(0.9, 1.12),
      curlDirection: Math.random() < 0.5 ? -1 : 1,
    });
  }

  function drawMagneticWell(width, height) {
    if (state.magnet.strength < 0.01) return;

    const radius = Math.max(58, Math.min(108, width * 0.14, height * 1.05));
    const alpha = 0.082 * state.magnet.strength;
    const glow = context.createRadialGradient(
      state.magnet.focusX,
      state.magnet.focusY,
      0,
      state.magnet.focusX,
      state.magnet.focusY,
      radius,
    );
    glow.addColorStop(0, `rgba(238,244,248,${alpha})`);
    glow.addColorStop(0.28, `rgba(196,211,222,${alpha * 0.48})`);
    glow.addColorStop(1, "rgba(160,178,196,0)");

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  function drawField(width, height, time) {
    const breath = 0.5 + Math.sin((time * Math.PI * 2) / 6.8) * 0.5;
    const idleAlpha = touchPresentation ? 0.036 : 0.026;
    const breathAlpha = touchPresentation ? 0.024 : 0.018;
    const alpha = idleAlpha + breath * breathAlpha + state.active * 0.052;
    const fieldX = width * 0.5 + state.magnet.x * 0.58;
    const fieldY = height * 0.53 + state.magnet.y * 0.58;
    const glow = context.createRadialGradient(fieldX, fieldY, 1, fieldX, fieldY, width * 0.43);
    glow.addColorStop(0, `rgba(226,234,240,${alpha})`);
    glow.addColorStop(0.44, `rgba(177,194,208,${alpha * 0.42})`);
    glow.addColorStop(1, "rgba(160,178,196,0)");

    context.save();
    context.globalCompositeOperation = "screen";
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    drawMagneticWell(width, height);
    context.restore();
  }

  function stepParticleMagnet(particle, targetX, targetY, delta) {
    const steps = Math.max(1, Math.ceil(delta / (1 / 120)));
    const step = delta / steps;

    for (let index = 0; index < steps; index += 1) {
      const accelerationX =
        (targetX - particle.magnetX) * particle.magnetStiffness -
        particle.magnetVelocityX * particle.magnetDamping;
      const accelerationY =
        (targetY - particle.magnetY) * particle.magnetStiffness -
        particle.magnetVelocityY * particle.magnetDamping;

      particle.magnetVelocityX += accelerationX * step;
      particle.magnetVelocityY += accelerationY * step;
      particle.magnetX += particle.magnetVelocityX * step;
      particle.magnetY += particle.magnetVelocityY * step;
    }
  }

  function drawParticles(width, height, delta) {
    context.save();
    context.globalCompositeOperation = "screen";

    for (let index = state.particles.length - 1; index >= 0; index -= 1) {
      const particle = state.particles[index];
      particle.life += delta;
      particle.y -= particle.speed * delta;
      particle.baseX +=
        (particle.targetX - particle.baseX) *
        Math.min(1, delta * (particle.y < height * 0.42 ? 0.5 : 0.08));
      particle.x =
        particle.baseX + Math.sin(particle.phase + particle.life * 2.1) * particle.drift;

      let targetMagnetX = state.magnet.x * particle.depth;
      let targetMagnetY = state.magnet.y * particle.depth;
      const attractionX = state.magnet.focusX - particle.x;
      const attractionY = state.magnet.focusY - particle.y;
      const attractionDistance = Math.hypot(attractionX, attractionY);
      const attractionRadius = Math.max(
        150,
        Math.min(420, width * MAGNETIC_CONFIG.attractionRadius),
      );
      let magneticInfluence = 0;

      if (attractionDistance < attractionRadius && state.magnet.strength > 0.001) {
        const distance = Math.max(1, attractionDistance);
        const directionX = attractionX / distance;
        const directionY = attractionY / distance;
        const falloff = Math.pow(1 - attractionDistance / attractionRadius, 1.35);
        magneticInfluence = falloff * state.magnet.strength;
        const pull =
          MAGNETIC_CONFIG.attraction *
          magneticInfluence *
          (0.72 + particle.depth * 0.28);
        const curl =
          MAGNETIC_CONFIG.curl *
          magneticInfluence *
          particle.curlDirection *
          Math.sin(particle.phase + particle.life * 1.25);

        targetMagnetX += directionX * pull - directionY * curl;
        targetMagnetY += directionY * pull + directionX * curl;
      }

      stepParticleMagnet(particle, targetMagnetX, targetMagnetY, delta);
      const drawX = particle.x + particle.magnetX;
      const drawY = particle.y + particle.magnetY;
      const horizontalFade = clamp(
        (Math.min(drawX, width - drawX) - width * 0.08) / 12,
        0,
        1,
      );
      const verticalFade = clamp(
        (Math.min(drawY, height - drawY) - height * 0.1) / 6,
        0,
        1,
      );
      const edgeFade = horizontalFade * verticalFade;
      const fadeIn = Math.min(1, particle.life / 0.4);
      const fadeOut = Math.min(1, Math.max(0, (particle.maxLife - particle.life) / 0.85));
      const alpha =
        particle.alpha *
        fadeIn *
        fadeOut *
        edgeFade *
        (0.72 + state.active * 0.5 + magneticInfluence * 0.62);
      const haloSize = particle.halo * (1 + magneticInfluence * 0.4);
      const particleSize = particle.size * (1 + magneticInfluence * 0.24);
      const halo = context.createRadialGradient(drawX, drawY, 0, drawX, drawY, haloSize);
      halo.addColorStop(0, `rgba(241,246,249,${alpha * 0.56})`);
      halo.addColorStop(0.35, `rgba(189,205,218,${alpha * 0.24})`);
      halo.addColorStop(1, "rgba(160,178,196,0)");

      context.fillStyle = halo;
      context.beginPath();
      context.arc(drawX, drawY, haloSize, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = `rgba(239,244,247,${alpha})`;
      context.beginPath();
      context.arc(drawX, drawY, particleSize, 0, Math.PI * 2);
      context.fill();

      if (particle.life >= particle.maxLife || particle.y < height * 0.12) {
        state.particles.splice(index, 1);
      }
    }

    context.restore();
  }

  function render(now) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const delta = Math.min(0.05, (now - state.lastTime) / 1000);
    state.lastTime = now;

    const touchActive = now < state.touchUntil;
    if (!touchActive && state.magnet.touch) {
      state.magnet.touch = false;
      releaseMagnet();
    }

    const target = state.hover || touchActive ? 1 : 0;
    state.active += (target - state.active) * Math.min(1, delta * (target ? 5.6 : 2.8));
    stepMagnet(delta);
    context.clearRect(0, 0, width, height);

    if (width > 0 && height > 0 && !document.hidden) {
      state.spawnClock += delta;
      const interval = state.active > 0.2 ? 0.06 : touchPresentation ? 0.17 : 0.24;
      const limit =
        state.active > 0.2
          ? MAGNETIC_CONFIG.hoverParticleCeiling
          : touchPresentation
            ? MAGNETIC_CONFIG.touchIdleParticleCeiling
            : MAGNETIC_CONFIG.idleParticleCeiling;

      if (state.spawnClock >= interval && state.particles.length < limit) {
        state.spawnClock = 0;
        spawn(width, height);
      }

      drawField(width, height, now / 1000);
      drawParticles(width, height, delta);
    }

    window.requestAnimationFrame(render);
  }

  function handlePointerMove(event) {
    if (!finePointer.matches || event.pointerType !== "mouse") return;
    updateMagnetFromPoint(event.clientX, event.clientY, true);
  }

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("blur", releaseMagnet);
  document.addEventListener("visibilitychange", function handleVisibilityChange() {
    if (document.hidden) releaseMagnet();
  });

  button.addEventListener("pointerenter", function handlePointerEnter(event) {
    if (!finePointer.matches || event.pointerType !== "mouse") return;
    state.hover = true;
    updateMagnetFromPoint(event.clientX, event.clientY, true);
  });

  button.addEventListener("pointerleave", function handlePointerLeave(event) {
    if (event.pointerType === "mouse") state.hover = false;
  });

  button.addEventListener("pointerdown", function handlePointerDown(event) {
    if (event.pointerType === "mouse") return;
    state.touchUntil = performance.now() + MAGNETIC_CONFIG.touchPulse;
    state.magnet.touch = true;
    updateMagnetFromPoint(event.clientX, event.clientY, false);
  });

  button.addEventListener("pointermove", function handleTouchMove(event) {
    if (!state.magnet.touch || event.pointerType === "mouse") return;
    updateMagnetFromPoint(event.clientX, event.clientY, false);
  });

  button.addEventListener("pointerup", function handlePointerUp(event) {
    if (event.pointerType === "mouse") return;
    state.touchUntil = Math.max(state.touchUntil, performance.now() + 520);
  });

  button.addEventListener("pointercancel", function handlePointerCancel() {
    state.touchUntil = 0;
    state.magnet.touch = false;
    releaseMagnet();
  });

  resize();
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(button);
  } else {
    window.addEventListener("resize", resize);
  }

  window.requestAnimationFrame(function start(time) {
    state.lastTime = time;
    render(time);
  });
}
