export function createRitualController(options = {}) {
  const { duration = 3, onComplete, onTick } = options;

  let ritualTimer = null;
  let activeMode = null;

  function stop() {
    if (ritualTimer) {
      clearInterval(ritualTimer);
      ritualTimer = null;
    }

    activeMode = null;
  }

  function start(mode) {
    stop();
    activeMode = mode;

    let value = duration;
    onTick(value, activeMode);

    ritualTimer = setInterval(function () {
      value -= 1;
      onTick(Math.max(value, 0), activeMode);

      if (value <= 0) {
        const completedMode = activeMode;
        stop();
        onComplete(completedMode);
      }
    }, 1000);
  }

  return {
    start,
    stop,
  };
}
