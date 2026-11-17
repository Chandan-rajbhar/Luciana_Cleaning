const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\UXDLab\\.gemini\\antigravity\\brain\\6ece447d-9f22-47ea-b0b0-128c6def58f2';
const PORT = 9229;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-android-test-'));
  const ch = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + tmpDir,
    '--disable-gpu',
    '--no-sandbox',
    'about:blank',
  ]);

  let list = null;
  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      list = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${PORT}/json/list`, (res) => {
          let d = '';
          res.on('data', (c) => (d += c));
          res.on('end', () => resolve(JSON.parse(d)));
        });
        req.on('error', reject);
      });
      if (list && list.length > 0) break;
    } catch {}
  }

  const ws = new WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((r) => {
      const i = id++;
      const handler = (ev) => {
        const p = JSON.parse(ev.data);
        if (p.id === i) {
          ws.removeEventListener('message', handler);
          r(p.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');

  async function setAndroidViewport(w, visibleH, fullH) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: visibleH,
      deviceScaleFactor: 2.625,
      mobile: true,
      fitWindow: false,
    });
    await send('Emulation.setTouchEmulationEnabled', {
      enabled: true,
      maxTouchPoints: 5,
    });
    // Set --app-h explicitly to simulate visualViewport height matching visible area
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.documentElement.style.setProperty('--app-h', '${visibleH}px');
        window.dispatchEvent(new Event('resize'));
      })()`,
    });
    await sleep(400);
  }

  async function setDesktopViewport(w, h) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: false,
      fitWindow: false,
    });
    await send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await send('Runtime.evaluate', {
      expression: `(() => {
        document.documentElement.style.removeProperty('--app-h');
        window.dispatchEvent(new Event('resize'));
      })()`,
    });
    await sleep(500);
  }

  async function evaluate(code) {
    const res = await send('Runtime.evaluate', {
      expression: code,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async function takeScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(artifactDir, filename);
    fs.writeFileSync(fullPath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  }

  console.log('Navigating to http://localhost:5173...');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(2000);

  const measureVisibility = `(() => {
    const shell = document.getElementById('app-shell');
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const nav = document.querySelector('nav[role="tablist"]');
    const shellRect = shell?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    const windowH = window.innerHeight;
    const computedShell = shell ? window.getComputedStyle(shell) : null;
    const computedMain = main ? window.getComputedStyle(main) : null;

    return {
      windowH,
      shell: shellRect ? {
        top: Math.round(shellRect.top),
        bottom: Math.round(shellRect.bottom),
        height: Math.round(shellRect.height),
        position: computedShell?.position,
      } : null,
      header: headerRect ? {
        top: Math.round(headerRect.top),
        bottom: Math.round(headerRect.bottom),
        height: Math.round(headerRect.height),
      } : null,
      main: {
        paddingBottom: computedMain?.paddingBottom,
        scrollHeight: main?.scrollHeight,
        clientHeight: main?.clientHeight,
      },
      nav: navRect ? {
        top: Math.round(navRect.top),
        bottom: Math.round(navRect.bottom),
        height: Math.round(navRect.height),
        left: Math.round(navRect.left),
        right: Math.round(navRect.right),
        distFromBottom: Math.round(windowH - navRect.bottom),
        isFullyVisible: navRect.top >= 0 && navRect.bottom <= windowH,
      } : null,
    };
  })()`;

  // =========================================================================
  // TEST 1: Android Chrome at 390px - Address Bar Visible (788px) vs Hidden (844px)
  // =========================================================================
  console.log('\n--- 1. Android Chrome 390px (Address Bar Visible: 390x788) ---');
  await setAndroidViewport(390, 788, 844);
  const m390_visible = await evaluate(measureVisibility);
  console.log('390x788 Metrics:', JSON.stringify(m390_visible, null, 2));
  await takeScreenshot('android_390_addressbar_visible.png');

  console.log('\n--- 1b. Android Chrome 390px (Address Bar Hidden / Scrolled: 390x844) ---');
  await setAndroidViewport(390, 844, 844);
  const m390_hidden = await evaluate(measureVisibility);
  console.log('390x844 Metrics:', JSON.stringify(m390_hidden, null, 2));
  await takeScreenshot('android_390_addressbar_hidden.png');

  // =========================================================================
  // TEST 2: Android Chrome at 360px - Address Bar Visible (584px) vs Hidden (640px)
  // =========================================================================
  console.log('\n--- 2. Android Chrome 360px (Address Bar Visible: 360x584) ---');
  await setAndroidViewport(360, 584, 640);
  const m360_visible = await evaluate(measureVisibility);
  console.log('360x584 Metrics:', JSON.stringify(m360_visible, null, 2));
  await takeScreenshot('android_360_addressbar_visible.png');

  console.log('\n--- 2b. Android Chrome 360px (Address Bar Hidden: 360x640) ---');
  await setAndroidViewport(360, 640, 640);
  const m360_hidden = await evaluate(measureVisibility);
  console.log('360x640 Metrics:', JSON.stringify(m360_hidden, null, 2));
  await takeScreenshot('android_360_addressbar_hidden.png');

  // =========================================================================
  // TEST 3: Android Chrome at 430px - Address Bar Visible (876px) vs Hidden (932px)
  // =========================================================================
  console.log('\n--- 3. Android Chrome 430px (Address Bar Visible: 430x876) ---');
  await setAndroidViewport(430, 876, 932);
  const m430_visible = await evaluate(measureVisibility);
  console.log('430x876 Metrics:', JSON.stringify(m430_visible, null, 2));
  await takeScreenshot('android_430_addressbar_visible.png');

  console.log('\n--- 3b. Android Chrome 430px (Address Bar Hidden: 430x932) ---');
  await setAndroidViewport(430, 932, 932);
  const m430_hidden = await evaluate(measureVisibility);
  console.log('430x932 Metrics:', JSON.stringify(m430_hidden, null, 2));
  await takeScreenshot('android_430_addressbar_hidden.png');

  // =========================================================================
  // TEST 4: Tablet (768x1024)
  // =========================================================================
  console.log('\n--- 4. Tablet Check (768x1024) ---');
  await setAndroidViewport(768, 1024, 1024);
  const mTablet = await evaluate(measureVisibility);
  console.log('Tablet 768x1024 Metrics:', JSON.stringify(mTablet, null, 2));
  await takeScreenshot('android_tablet_768x1024.png');

  // =========================================================================
  // TEST 5: Desktop Scaled Phone Frame (1440x900)
  // =========================================================================
  console.log('\n--- 5. Desktop Scaled Phone Frame (1440x900) ---');
  await setDesktopViewport(1440, 900);
  const mDesktop = await evaluate(`(() => {
    const frame = document.querySelector('.desktop-phone-frame');
    const shell = document.getElementById('app-shell');
    const nav = document.querySelector('nav[role="tablist"]');
    const frameRect = frame?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    return {
      hasDesktopFrame: Boolean(frame),
      frameRect: frameRect ? {
        top: Math.round(frameRect.top),
        bottom: Math.round(frameRect.bottom),
        width: Math.round(frameRect.width),
        height: Math.round(frameRect.height),
      } : null,
      navInsideFrame: frameRect && navRect ? (
        navRect.top >= frameRect.top &&
        navRect.bottom <= frameRect.bottom
      ) : false,
      navRect: navRect ? {
        top: Math.round(navRect.top),
        bottom: Math.round(navRect.bottom),
      } : null,
    };
  })()`);
  console.log('Desktop 1440x900 Metrics:', JSON.stringify(mDesktop, null, 2));
  await takeScreenshot('android_test_desktop_1440x900.png');

  // =========================================================================
  // TEST 6: Scroll up and down inside <main> at 390x788
  // =========================================================================
  console.log('\n--- 6. Scroll Test inside <main> with Address Bar Visible ---');
  await setAndroidViewport(390, 788, 844);
  await sleep(400);

  // Scroll down to middle
  await evaluate(`(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 400;
  })()`);
  await sleep(300);
  const scrollMid = await evaluate(`(() => {
    const main = document.querySelector('main');
    const nav = document.querySelector('nav[role="tablist"]');
    const navRect = nav?.getBoundingClientRect();
    return {
      scrollTop: main?.scrollTop,
      navFullyVisible: navRect ? (navRect.top >= 0 && navRect.bottom <= window.innerHeight) : false,
      distFromBottom: navRect ? window.innerHeight - navRect.bottom : null,
    };
  })()`);
  console.log('Scrolled 400px Metrics:', scrollMid);
  await takeScreenshot('android_390_scrolled_middle.png');

  // Scroll all the way to the bottom
  await evaluate(`(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = main.scrollHeight;
  })()`);
  await sleep(300);
  const scrollEnd = await evaluate(`(() => {
    const main = document.querySelector('main');
    const nav = document.querySelector('nav[role="tablist"]');
    const navRect = nav?.getBoundingClientRect();
    return {
      scrollTop: main?.scrollTop,
      maxScroll: main?.scrollHeight - main?.clientHeight,
      navFullyVisible: navRect ? (navRect.top >= 0 && navRect.bottom <= window.innerHeight) : false,
      distFromBottom: navRect ? window.innerHeight - navRect.bottom : null,
    };
  })()`);
  console.log('Scrolled to Bottom Metrics:', scrollEnd);
  await takeScreenshot('android_390_scrolled_bottom.png');

  // =========================================================================
  // TEST 7: Bottom Sheet Render & Slide Down at 390x788
  // =========================================================================
  console.log('\n--- 7. Bottom Sheet at 390x788 ---');
  await evaluate(`(() => {
    const claimBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Claim Offer'));
    if (claimBtn) claimBtn.click();
  })()`);
  await sleep(600);

  const sheetMetrics = await evaluate(`(() => {
    const sheet = document.querySelector('[role="dialog"]');
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Estimate Request'));
    const submitRect = submitBtn?.getBoundingClientRect();
    const nav = document.querySelector('nav[role="tablist"]');
    const wrapper = nav?.parentElement;
    const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
    return {
      sheetOpen: Boolean(sheet),
      navHidden: wrapperStyle?.opacity === '0',
      submitBtnVisible: submitRect ? (submitRect.top >= 0 && submitRect.bottom <= window.innerHeight) : false,
      submitBtnBottom: submitRect ? Math.round(submitRect.bottom) : null,
      windowH: window.innerHeight,
    };
  })()`);
  console.log('Sheet Open Metrics at 390x788:', sheetMetrics);
  await takeScreenshot('android_390_sheet_open.png');

  // Close sheet
  await evaluate(`(() => {
    const closeBtn = document.querySelector('button[aria-label="Close estimate form"]');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(500);

  console.log('\nAll Android Chrome tests complete! Cleaning up...');
  ch.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

run().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
