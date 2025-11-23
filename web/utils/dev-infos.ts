function getDeviceInfos() {
  const ua = navigator.userAgent;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua);
  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent: ua,
  };
}

function getScreenInfos() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  return {
    width,
    height,
    pixelRatio,
  };
}

export { getDeviceInfos, getScreenInfos };
