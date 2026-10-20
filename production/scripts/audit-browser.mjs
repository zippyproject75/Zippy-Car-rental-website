import { spawn } from "node:child_process";

const VIEWPORTS = [320, 360, 390, 768, 1024, 1280, 1440];
const ROUTES = [
  "/",
  "/cars",
  "/cars/fronx",
  "/cars/brezza",
  "/cars/baleno",
  "/cars/ertiga-1",
  "/cars/ertiga-2",
  "/book",
  "/about",
  "/faq",
  "/contact",
  "/terms-and-conditions",
  "/privacy-policy",
  "/cookie-policy",
  "/cancellation-and-refund-policy",
  "/hi",
  "/mr",
  "/nonexistent-page",
];

async function runAudit() {
  const chrome = spawn(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    [
      "--headless=new",
      "--disable-gpu",
      "--remote-debugging-port=9223",
      "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  // Wait for Chrome to be ready
  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch("http://127.0.0.1:9223/json");
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) throw new Error("No debugging WebSocket URL found");

    const ws = new WebSocket(wsUrl);
    await new Promise((r) => (ws.onopen = r));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === msgId) {
            ws.removeEventListener("message", handler);
            resolve(res.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Enable Page and Runtime
    await send("Page.enable");
    await send("Runtime.enable");

    const consoleMessages = [];
    ws.addEventListener("message", (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleMessages.push({
          type: msg.params.type,
          args: msg.params.args.map((a) => a.value ?? a.description),
        });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        consoleMessages.push({
          type: "exception",
          text: msg.params.exceptionDetails.text,
          exception: msg.params.exceptionDetails.exception?.description,
        });
      }
    });

    console.log("=== CHECKING ALL ROUTES AT 1440px ===");
    for (const route of ROUTES) {
      consoleMessages.length = 0;
      await send("Page.navigate", { url: `http://localhost:3000${route}` });
      await new Promise((r) => setTimeout(r, 1200));

      const titleRes = await send("Runtime.evaluate", {
        expression: "document.title",
      });
      const errors = consoleMessages.filter(
        (m) => m.type === "error" || m.type === "exception"
      );
      console.log(
        `Route ${route.padEnd(32)} -> Title: "${titleRes?.result?.value}" | Console Errors: ${errors.length}`
      );
      if (errors.length) {
        console.log("  Errors:", JSON.stringify(errors));
      }
    }

    console.log("\n=== CHECKING RESPONSIVE OVERFLOW ON ALL VIEWPORTS (Route: / and /book) ===");
    for (const testRoute of ["/", "/book", "/cars", "/contact"]) {
      console.log(`\nRoute: ${testRoute}`);
      for (const w of VIEWPORTS) {
        await send("Emulation.setDeviceMetricsOverride", {
          width: w,
          height: 800,
          deviceScaleFactor: 1,
          mobile: w < 768,
        });
        await send("Page.navigate", { url: `http://localhost:3000${testRoute}` });
        await new Promise((r) => setTimeout(r, 1000));

        const overflowRes = await send("Runtime.evaluate", {
          expression: `
            (() => {
              const w = window.innerWidth;
              const sw = document.documentElement.scrollWidth;
              const offenders = [];
              document.querySelectorAll('*').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.right > w + 2) {
                  offenders.push({
                    tag: el.tagName,
                    cls: (el.className || '').toString().slice(0, 40),
                    right: Math.round(r.right),
                    w: Math.round(r.width)
                  });
                }
              });
              return JSON.stringify({ innerWidth: w, scrollWidth: sw, offenders: offenders.slice(0, 4) });
            })()
          `,
        });

        const overflowData = JSON.parse(overflowRes?.result?.value || "{}");
        const hasOverflow = overflowData.scrollWidth > overflowData.innerWidth + 1;
        console.log(
          `  ${w}px: innerWidth=${overflowData.innerWidth}, scrollWidth=${overflowData.scrollWidth} -> ${hasOverflow ? "OVERFLOW DETECTED!" : "OK"}`
        );
        if (hasOverflow && overflowData.offenders?.length) {
          console.log("    Offenders:", overflowData.offenders);
        }
      }
    }

    console.log("\n=== TESTING ENQUIRY FLOW INTERACTION IN DOM ===");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url: "http://localhost:3000/book" });
    await new Promise((r) => setTimeout(r, 1500));

    // Fill form and check result
    const enquiryTest = await send("Runtime.evaluate", {
      expression: `
        (() => {
          // Select car: Fronx
          const carSelect = document.getElementById('enquiry-car') || document.querySelector('select[name="car"]');
          // Check branches
          const branchSelect = document.getElementById('enquiry-branch') || document.querySelector('select[name="branch"]');
          // Buttons
          const submitBtn = document.querySelector('button[type="submit"]') || document.querySelector('[data-testid="enquiry-submit"]');
          
          return JSON.stringify({
            carFound: !!carSelect,
            branchFound: !!branchSelect,
            submitFound: !!submitBtn,
            carOptions: carSelect ? Array.from(carSelect.options).map(o => o.value) : [],
            branchOptions: branchSelect ? Array.from(branchSelect.options).map(o => o.value) : []
          });
        })()
      `,
    });
    console.log("Enquiry Form DOM Structure:", enquiryTest?.result?.value);

    ws.close();
  } finally {
    chrome.kill();
  }
}

runAudit().catch(console.error);
