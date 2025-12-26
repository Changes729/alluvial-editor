export function waitUntil(conditionFn: () => boolean, interval = 100) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (conditionFn()) {
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
}
