async function scan(notify) {
  if (!notify) {
    notify = (message) => console.log("scan: " + message);
  }

  notify("Finding the subnet");
  const [router] = await findSubnet();
  console.log(router);

  if (!router) {
    notify("Didn't find it");
    return [];
  }

  notify("Searching in " + router);
  const subnet = router.split(".")[2];

  notify("Looking for devices");
  const devices = await findDevices(subnet, notify);

  console.log(devices);
  const identified = await Promise.all(devices.map(identify));

  notify("Done");
  return identified;

  async function identify(ip) {
    const circuitpy = await fetch("http://" + ip + "/cp/version.json").then(
      async (response) => {
        const json = await response.json().catch(() => null);

        if (!json) {
          return false;
        }

        return { ...json, type: "circuitpy" };
      },
      () => false,
    );
    const router = ip.endsWith(".1") && {
      ip,
      type: "router",
      version: "unknown",
    };
    const unknown = { ip, type: "unknown", version: "unknown" };

    return circuitpy || router || unknown;
  }

  async function scanRange(predicate, start, end) {
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 250);

    const responses = await Promise.allSettled(
      [...Array(end - start + 1).keys()].map((index) =>
        ping(predicate(start + index), controller.signal),
      ),
    );

    return responses
      .filter((res) => res.status === "fulfilled")
      .map((res) => res.value);
  }

  async function findSubnet() {
    return scanRange((addr) => `192.168.${addr}.1`, 0, 50);
  }

  async function findDevices(subnet, notify) {
    let devices = [];

    for (let start = 0; start < 255; start += 50) {
      const end = start < 205 ? start + 50 : 255;
      notify(`Scanning ${start} through ${end}`);

      const batch = await scanRange(
        (addr) => `192.168.${subnet}.${addr}`,
        +start,
        +end,
      );

      devices.push(...batch);
    }

    return devices;
  }

  async function ping(ip, signal) {
    const page = await fetch("http://" + ip, {
      mode: "no-cors",
      signal: signal,
    });

    return ip;
  }
}
