const appStatus = document.querySelector("#app-status");
const runtimeStatus = document.querySelector("#runtime-status");
const viewportSize = document.querySelector("#viewport-size");

function updateViewportSize() {
  viewportSize.textContent = `${window.innerWidth} x ${window.innerHeight}`;
}

function bootShell() {
  appStatus.textContent = "Ready";
  runtimeStatus.textContent = "Phase 0 shell loaded";
  updateViewportSize();
}

window.addEventListener("resize", updateViewportSize);
window.addEventListener("load", bootShell);
