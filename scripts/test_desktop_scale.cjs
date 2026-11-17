const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\UXDLab\\.gemini\\antigravity\\brain\\6ece447d-9f22-47ea-b0b0-128c6def58f2';
const PORT = 9226;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-desktop-scale-'));
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

  async function setViewport(w, h, touch = false) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: touch || w < 1025,
      fitWindow: false,
    });
    if (touch || w < 1025) {
      await send('Emulation.setTouchEmulationEnabled', {
        enabled: true,
        maxTouchPoints: 5,
      });
    } else {
      await send('Emulation.setTouchEmulationEnabled', { enabled: false });
    }
    // Trigger window resize event inside page
    await send('Runtime.evaluate', {
      expression: 'window.dispatchEvent(new Event("resize"))',
    });
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

  console.log('Navigating to http://localhost:5173/ ...');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(1500);

  // ========================================================
  // TEST 1: 1366x768 (Laptop / Smaller Desktop)
  // ========================================================
  console.log('\n=== TEST 1: 1366x768 (Desktop) ===');
  await setViewport(1366, 768, false);
  await sleep(600);

  const data1366 = await evaluate(`(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const frameScale = rootStyle.getPropertyValue('--frame-scale').trim();
    const stage = document.querySelector('.desktop-phone-stage');
    const frame = document.querySelector('.desktop-phone-frame');
    const appShell = document.querySelector('#app-shell');
    const frameRect = frame ? frame.getBoundingClientRect() : null;
    const bodyScrollHeight = document.body.scrollHeight;
    const docScrollHeight = document.documentElement.scrollHeight;
    
    return {
      windowW: window.innerWidth,
      windowH: window.innerHeight,
      frameScale,
      hasStage: Boolean(stage),
      hasFrame: Boolean(frame),
      frameOffsetHeight: frame?.offsetHeight,
      frameOffsetWidth: frame?.offsetWidth,
      frameRect: frameRect ? {
        top: Math.round(frameRect.top),
        bottom: Math.round(frameRect.bottom),
        left: Math.round(frameRect.left),
        right: Math.round(frameRect.right),
        width: Math.round(frameRect.width),
        height: Math.round(frameRect.height),
      } : null,
      isFullyVisible: frameRect ? (frameRect.top >= 0 && frameRect.bottom <= window.innerHeight) : false,
      hasPageScrollbar: docScrollHeight > window.innerHeight || bodyScrollHeight > window.innerHeight,
      docScrollHeight,
    };
  })()`);
  console.log('1366x768 Metrics:', JSON.stringify(data1366, null, 2));

  // Test drag on Before/After Slider at 1366x768
  console.log('Testing Before/After Slider drag at 1366x768...');
  const sliderBefore = await evaluate(`(() => {
    const sliderHandle = document.querySelector('[role="slider"]');
    return {
      ariaValueNow: sliderHandle?.getAttribute('aria-valuenow'),
      rect: sliderHandle?.getBoundingClientRect(),
    };
  })()`);

  // Scroll down slightly so slider is visible if needed
  await evaluate(`(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 450;
  })()`);
  await sleep(400);

  const sliderHandlePos = await evaluate(`(() => {
    const handle = document.querySelector('[role="slider"]');
    if (!handle) return null;
    const rect = handle.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);

  if (sliderHandlePos) {
    // Mouse drag
    await send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: sliderHandlePos.x,
      y: sliderHandlePos.y,
      button: 'left',
      clickCount: 1,
    });
    await sleep(50);
    // Move to the right by 60px
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: sliderHandlePos.x + 60,
      y: sliderHandlePos.y,
    });
    await sleep(50);
    await send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: sliderHandlePos.x + 60,
      y: sliderHandlePos.y,
      button: 'left',
    });
    await sleep(300);
  }

  const sliderAfter = await evaluate(`(() => {
    const sliderHandle = document.querySelector('[role="slider"]');
    const main = document.querySelector('main');
    return {
      ariaValueNow: sliderHandle?.getAttribute('aria-valuenow'),
      scrollTop: main?.scrollTop,
    };
  })()`);
  console.log('Slider drag result at 1366x768:', { sliderBefore, sliderAfter });

  // Scroll back to top
  await evaluate(`(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  })()`);
  await sleep(300);

  await takeScreenshot('desktop_1366x768.png');

  // ========================================================
  // TEST 2: 1440x900 (Standard Desktop)
  // ========================================================
  console.log('\n=== TEST 2: 1440x900 (Standard Desktop) ===');
  await setViewport(1440, 900, false);
  await sleep(600);

  const data1440 = await evaluate(`(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const frameScale = rootStyle.getPropertyValue('--frame-scale').trim();
    const frame = document.querySelector('.desktop-phone-frame');
    const frameRect = frame ? frame.getBoundingClientRect() : null;
    const docScrollHeight = document.documentElement.scrollHeight;
    
    return {
      windowW: window.innerWidth,
      windowH: window.innerHeight,
      frameScale,
      frameOffsetHeight: frame?.offsetHeight,
      frameRect: frameRect ? {
        top: Math.round(frameRect.top),
        bottom: Math.round(frameRect.bottom),
        width: Math.round(frameRect.width),
        height: Math.round(frameRect.height),
      } : null,
      isFullyVisible: frameRect ? (frameRect.top >= 0 && frameRect.bottom <= window.innerHeight) : false,
      hasPageScrollbar: docScrollHeight > window.innerHeight,
    };
  })()`);
  console.log('1440x900 Metrics:', JSON.stringify(data1440, null, 2));

  // Click on "Claim Offer" to verify Free Estimate bottom sheet opens and stays inside scaled frame
  console.log('Opening Free Estimate Sheet at 1440x900...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Claim Offer'));
    if (btn) btn.click();
  })()`);
  await sleep(800);

  const sheetCheck1440 = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const dialog = portal?.querySelector('[role="dialog"]');
    const sheetPanel = dialog?.querySelector('.rounded-t-\\\\[28px\\\\]');
    const phoneScreen = document.querySelector('.desktop-phone-frame');
    const sheetRect = sheetPanel?.getBoundingClientRect();
    const phoneRect = phoneScreen?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    
    return {
      hasDialog: Boolean(dialog),
      sheetRect: sheetRect ? {
        top: Math.round(sheetRect.top),
        bottom: Math.round(sheetRect.bottom),
        left: Math.round(sheetRect.left),
        right: Math.round(sheetRect.right),
      } : null,
      phoneRect: phoneRect ? {
        top: Math.round(phoneRect.top),
        bottom: Math.round(phoneRect.bottom),
        left: Math.round(phoneRect.left),
        right: Math.round(phoneRect.right),
      } : null,
      sheetContainedInPhone: sheetRect && phoneRect ? (
        sheetRect.left >= phoneRect.left - 5 &&
        sheetRect.right <= phoneRect.right + 5 &&
        sheetRect.bottom <= phoneRect.bottom + 5
      ) : false,
      isTabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('Sheet check at 1440x900:', JSON.stringify(sheetCheck1440, null, 2));

  await takeScreenshot('desktop_1440x900_with_sheet.png');

  // Close sheet with Escape
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(500);

  await takeScreenshot('desktop_1440x900.png');

  // ========================================================
  // TEST 3: 1920x1080 (Full HD Desktop)
  // ========================================================
  console.log('\n=== TEST 3: 1920x1080 (Full HD Desktop) ===');
  await setViewport(1920, 1080, false);
  await sleep(600);

  const data1920 = await evaluate(`(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const frameScale = rootStyle.getPropertyValue('--frame-scale').trim();
    const frame = document.querySelector('.desktop-phone-frame');
    const frameRect = frame ? frame.getBoundingClientRect() : null;
    const docScrollHeight = document.documentElement.scrollHeight;
    
    return {
      windowW: window.innerWidth,
      windowH: window.innerHeight,
      frameScale,
      frameOffsetHeight: frame?.offsetHeight,
      frameRect: frameRect ? {
        top: Math.round(frameRect.top),
        bottom: Math.round(frameRect.bottom),
        width: Math.round(frameRect.width),
        height: Math.round(frameRect.height),
      } : null,
      isFullyVisible: frameRect ? (frameRect.top >= 0 && frameRect.bottom <= window.innerHeight) : false,
      hasPageScrollbar: docScrollHeight > window.innerHeight,
    };
  })()`);
  console.log('1920x1080 Metrics:', JSON.stringify(data1920, null, 2));

  // Trigger toast on desktop and verify position absolute inside phone frame
  console.log('Triggering toast at 1920x1080...');
  await evaluate(`(() => {
    // Click Claim Offer copy code button or navigate
    const copyBtn = document.querySelector('button[style*="rgba(255,255,255"]');
    if (copyBtn) copyBtn.click();
  })()`);
  await sleep(400);

  const toastCheck1920 = await evaluate(`(() => {
    const toast = document.querySelector('[role="status"]');
    const phone = document.querySelector('.desktop-phone-frame');
    const toastRect = toast?.getBoundingClientRect();
    const phoneRect = phone?.getBoundingClientRect();
    return {
      hasToast: Boolean(toast),
      toastPositionStyle: toast ? getComputedStyle(toast).position : null,
      toastMessage: toast?.textContent.trim(),
      toastRect: toastRect ? { top: Math.round(toastRect.top), left: Math.round(toastRect.left), width: Math.round(toastRect.width) } : null,
      toastInsidePhone: toastRect && phoneRect ? (
        toastRect.left >= phoneRect.left &&
        toastRect.right <= phoneRect.right &&
        toastRect.top >= phoneRect.top
      ) : false,
    };
  })()`);
  console.log('Toast check at 1920x1080:', JSON.stringify(toastCheck1920, null, 2));

  await takeScreenshot('desktop_1920x1080.png');

  // ========================================================
  // TEST 4: Mobile & Tablet untouched check
  // ========================================================
  console.log('\n=== TEST 4: Phone & Tablet Untouched Check ===');
  // Phone 390x844
  await setViewport(390, 844, true);
  await sleep(600);
  const phoneCheck = await evaluate(`(() => {
    const frame = document.querySelector('.desktop-phone-frame');
    const fullScreenShell = document.querySelector('#root > div');
    const isBezelPresent = Boolean(document.querySelector('.rounded-\\\\[48px\\\\]'));
    return {
      device: document.documentElement.getAttribute('data-device'),
      hasDesktopFrame: Boolean(frame),
      isBezelPresent,
      rootWidth: fullScreenShell?.offsetWidth,
      rootHeight: fullScreenShell?.offsetHeight,
    };
  })()`);
  console.log('Phone 390x844 Check:', phoneCheck);
  await takeScreenshot('phone_390x844_untouched.png');

  // Tablet 768x1024
  await setViewport(768, 1024, false);
  await sleep(600);
  const tabletCheck = await evaluate(`(() => {
    const frame = document.querySelector('.desktop-phone-frame');
    const isBezelPresent = Boolean(document.querySelector('.rounded-\\\\[48px\\\\]'));
    return {
      device: document.documentElement.getAttribute('data-device'),
      hasDesktopFrame: Boolean(frame),
      isBezelPresent,
    };
  })()`);
  console.log('Tablet 768x1024 Check:', tabletCheck);
  await takeScreenshot('tablet_768x1024_untouched.png');

  console.log('\nAll tests complete! Killing Chrome...');
  ch.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

run().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
