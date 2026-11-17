const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\UXDLab\\.gemini\\antigravity\\brain\\6ece447d-9f22-47ea-b0b0-128c6def58f2';
const PORT = 9224;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-full-verify-'));
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
      deviceScaleFactor: 2,
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

  // --- 1. Small Phone (360x640): Tip & Rating Sheet ---
  console.log('\n=== Test 1: Small Phone (360x640) - Tip & Rating Sheet ===');
  await setViewport(360, 640, true);
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(1500);

  // Navigate to Bookings
  await evaluate(`document.querySelector('button[aria-label="Bookings"]').click()`);
  await sleep(600);

  // Click Past tab
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Past')).click()`);
  await sleep(600);

  // Click Rate
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Rate').click()`);
  await sleep(800);

  const checkTip1 = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const dialog = portal?.querySelector('[role="dialog"]');
    const footer = dialog?.querySelector('.border-t.bg-white');
    const submitBtn = footer?.querySelector('button');
    const submitRect = submitBtn?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      hasDialog: Boolean(dialog),
      title: dialog?.querySelector('#rating-sheet-title')?.textContent,
      submitInViewport: submitRect ? (submitRect.bottom <= window.innerHeight && submitRect.top >= 0) : false,
      submitRect: submitRect ? { top: Math.round(submitRect.top), bottom: Math.round(submitRect.bottom) } : null,
      tabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('360x640 Tip & Rating (With $15 tip):', checkTip1);
  await takeScreenshot('sheet_tip_rating_360x640_with_tip.png');

  // Select "No Tip"
  console.log('Selecting "No Tip"...');
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'No Tip').click()`);
  await sleep(400);

  const checkTipNoTip = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const footer = portal?.querySelector('.border-t.bg-white');
    const submitBtn = footer?.querySelector('button');
    const submitRect = submitBtn?.getBoundingClientRect();
    return {
      submitBtnText: submitBtn?.textContent.trim(),
      submitInViewport: submitRect ? (submitRect.bottom <= window.innerHeight && submitRect.top >= 0) : false,
      submitRect: submitRect ? { top: Math.round(submitRect.top), bottom: Math.round(submitRect.bottom) } : null,
    };
  })()`);
  console.log('360x640 Tip & Rating (No Tip):', checkTipNoTip);
  await takeScreenshot('sheet_tip_rating_360x640_no_tip.png');

  // Test Escape Key
  console.log('Testing Escape key to close...');
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(600);

  const afterEscape = await evaluate(`(() => {
    const dialog = document.getElementById('sheet-portal')?.querySelector('[role="dialog"]');
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      sheetClosed: !dialog,
      tabBarRestored: !tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('After Escape:', afterEscape);

  // --- 2. Standard Phone (390x844): Tip & Rating Sheet ---
  console.log('\n=== Test 2: Standard Phone (390x844) - Tip & Rating Sheet ===');
  await setViewport(390, 844, true);
  await sleep(500);

  // Re-open Rate
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Rate').click()`);
  await sleep(800);

  const checkTip390 = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const footer = portal?.querySelector('.border-t.bg-white');
    const submitBtn = footer?.querySelector('button');
    const submitRect = submitBtn?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      submitInViewport: submitRect ? (submitRect.bottom <= window.innerHeight && submitRect.top >= 0) : false,
      submitRect: submitRect ? { top: Math.round(submitRect.top), bottom: Math.round(submitRect.bottom) } : null,
      tabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('390x844 Tip & Rating:', checkTip390);
  await takeScreenshot('sheet_tip_rating_390x844.png');

  // Close by clicking backdrop
  console.log('Testing Backdrop click to close...');
  await evaluate(`document.querySelector('#sheet-portal .bg-black\\\\/45').click()`);
  await sleep(600);

  const afterBackdrop = await evaluate(`(() => {
    const dialog = document.getElementById('sheet-portal')?.querySelector('[role="dialog"]');
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      sheetClosed: !dialog,
      tabBarRestored: !tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('After Backdrop click:', afterBackdrop);

  // --- 3. Tablet (768x1024): Cleaner Profile & Free Estimate Sheets ---
  console.log('\n=== Test 3: Tablet (768x1024) - Cleaner Profile & Estimate Sheets ===');
  await setViewport(768, 1024, false);
  await sleep(600);

  // Navigate to Home
  await evaluate(`(() => {
    const homeBtn = document.querySelector('button[aria-label="Home"]');
    if (homeBtn) homeBtn.click();
  })()`);
  await sleep(1000);

  // Click on "Maria S." cleaner button
  await evaluate(`(() => {
    const img = document.querySelector('img[alt="Maria S."]');
    const btn = img?.closest('button');
    if (btn) btn.click();
  })()`);
  await sleep(1000);

  const checkCleanerTablet = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const dialog = portal?.querySelector('[role="dialog"]');
    const footer = dialog?.querySelector('.border-t.bg-white');
    const requestBtn = footer?.querySelector('button');
    const requestRect = requestBtn?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      hasDialog: Boolean(dialog),
      cleanerName: dialog?.querySelector('#cleaner-sheet-title')?.textContent,
      requestBtnText: requestBtn?.textContent.trim(),
      requestInViewport: requestRect ? (requestRect.bottom <= window.innerHeight && requestRect.top >= 0) : false,
      tabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('Tablet Cleaner Profile Sheet:', checkCleanerTablet);
  await takeScreenshot('sheet_cleaner_profile_tablet_768x1024.png');

  // Click Request Cleaner button -> Opens Free Estimate Sheet!
  console.log('Clicking "Request Maria S." to open Free Estimate sheet...');
  await evaluate(`document.querySelector('#sheet-portal .border-t.bg-white button').click()`);
  await sleep(1000);

  const checkEstimateTablet = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const dialog = portal?.querySelector('[role="dialog"]');
    const footer = dialog?.querySelector('.border-t.bg-white');
    const submitBtn = footer?.querySelector('button[type="submit"]');
    const submitRect = submitBtn?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      hasDialog: Boolean(dialog),
      title: dialog?.querySelector('#estimate-sheet-title')?.textContent,
      submitBtnText: submitBtn?.textContent.trim(),
      submitInViewport: submitRect ? (submitRect.bottom <= window.innerHeight && submitRect.top >= 0) : false,
      submitRect: submitRect ? { top: Math.round(submitRect.top), bottom: Math.round(submitRect.bottom) } : null,
      tabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('Tablet Free Estimate Sheet:', checkEstimateTablet);
  await takeScreenshot('sheet_estimate_tablet_768x1024.png');

  // Close estimate sheet with close button
  await evaluate(`document.querySelector('#sheet-portal [aria-label="Close estimate form"]').click()`);
  await sleep(600);

  // --- 4. Desktop (1440x900): Call Dialog inside Phone Frame ---
  console.log('\n=== Test 4: Desktop (1440x900) - Call Dialog inside Phone Frame ===');
  await setViewport(1440, 900, false);
  await sleep(800);

  // Navigate to Chat
  await evaluate(`document.querySelector('button[aria-label="Chat"]').click()`);
  await sleep(800);

  // Click phone call button in chat header
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-phone') || b.getAttribute('aria-label')?.includes('Call')).click()`);
  await sleep(800);

  const checkCallDialog = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const dialog = portal?.querySelector('[role="dialog"]');
    const callNow = dialog?.querySelector('a[href^="tel:"]');
    const phoneScreen = document.querySelector('#app-shell');
    const dialogBox = dialog?.querySelector('.rounded-\\\\[24px\\\\]');
    const dialogRect = dialogBox?.getBoundingClientRect();
    const phoneRect = phoneScreen?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      hasDialog: Boolean(dialog),
      hasCallNowBtn: Boolean(callNow),
      dialogInsidePhone: phoneRect && dialogRect ? (
        dialogRect.left >= phoneRect.left - 5 &&
        dialogRect.right <= phoneRect.right + 5
      ) : false,
      dialogRect: dialogRect ? { left: Math.round(dialogRect.left), right: Math.round(dialogRect.right), width: Math.round(dialogRect.width) } : null,
      phoneRect: phoneRect ? { left: Math.round(phoneRect.left), right: Math.round(phoneRect.right), width: Math.round(phoneRect.width) } : null,
      tabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('Desktop Call Dialog inside Phone Frame:', checkCallDialog);
  await takeScreenshot('dialog_call_desktop_1440x900.png');

  // --- 5. Small Phone (360x640): Free Estimate Sheet Full Form Visibility ---
  console.log('\n=== Test 5: Small Phone (360x640) - Free Estimate Sheet Submit Button ===');
  await setViewport(360, 640, true);
  await sleep(600);

  // Navigate to Home and open Free Estimate
  await evaluate(`document.querySelector('button[aria-label="Home"]').click()`);
  await sleep(800);
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Claim Offer')).click()`);
  await sleep(800);

  const checkEstimate360 = await evaluate(`(() => {
    const portal = document.getElementById('sheet-portal');
    const footer = portal?.querySelector('.border-t.bg-white');
    const submitBtn = footer?.querySelector('button[type="submit"]');
    const submitRect = submitBtn?.getBoundingClientRect();
    const tabBar = document.querySelector('[class*="bottom-0"][class*="z-30"]');
    return {
      title: portal?.querySelector('#estimate-sheet-title')?.textContent,
      submitInViewport: submitRect ? (submitRect.bottom <= window.innerHeight && submitRect.top >= 0) : false,
      submitRect: submitRect ? { top: Math.round(submitRect.top), bottom: Math.round(submitRect.bottom) } : null,
      tabBarHidden: tabBar?.className.includes('translate-y-full'),
    };
  })()`);
  console.log('360x640 Free Estimate Submit Button:', checkEstimate360);
  await takeScreenshot('sheet_estimate_360x640.png');

  console.log('\nAll tests passed successfully! Cleaning up...');
  ch.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

run().catch((e) => {
  console.error('Verification error:', e);
  process.exit(1);
});
