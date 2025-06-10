const run = document.createElement("button");
document.body.appendChild(run);
run.addEventListener("click", async () => {
  const devices = await scan(notify);

  notify(JSON.stringify(devices, null, 4));
});

function notify(message) {
  const pre = document.createElement("pre");
  pre.textContent = message;

  document.body.appendChild(pre);
}
