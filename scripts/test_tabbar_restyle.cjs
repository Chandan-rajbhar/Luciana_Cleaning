const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\UXDLab\\.gemini\\antigravity\\brain\\6ece447d-9f22-47ea-b0b0-128c6def58f2';
const PORT = 9228;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-tabbar-test-'));
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

  console.log('Navigating to http://localhost:5173...');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(2000);

  // Helper to inspect TabBar
  const inspectTabBar = `(() => {
    const nav = document.querySelector('nav[role="tablist"]');
    if (!nav) return { found: false };

    const navStyle = window.getComputedStyle(nav);
    const navRect = nav.getBoundingClientRect();
    const tabs = Array.from(nav.querySelectorAll('button[role="tab"]')).map(btn => {
      const allSpans = Array.from(btn.querySelectorAll('span'));
      const labelEl = allSpans.find(s => !s.hasAttribute('aria-label') && !s.classList.contains('rounded-full')) || allSpans[allSpans.length - 1];
      const iconEl = btn.querySelector('svg');
      const badgeEl = btn.querySelector('span[aria-label]');
      const btnStyle = window.getComputedStyle(btn);
      const btnRect = btn.getBoundingClientRect();
      const labelStyle = labelEl ? window.getComputedStyle(labelEl) : null;
      const iconStyle = iconEl ? window.getComputedStyle(iconEl) : null;

      return {
        label: labelEl?.textContent.trim(),
        ariaSelected: btn.getAttribute('aria-selected') === 'true',
        bgColor: btnStyle.backgroundColor,
        textColor: btnStyle.color,
        btnWidth: Math.round(btnRect.width),
        btnHeight: Math.round(btnRect.height),
        labelScrollWidth: labelEl?.scrollWidth,
        labelClientWidth: labelEl?.clientWidth,
        labelOverflows: labelEl ? labelEl.scrollWidth > labelEl.clientWidth : false,
        labelFontSize: labelStyle?.fontSize,
        iconWidth: iconEl?.clientWidth || iconEl?.getBoundingClientRect().width,
        iconHeight: iconEl?.clientHeight || iconEl?.getBoundingClientRect().height,
        hasBadge: Boolean(badgeEl),
        badgeText: badgeEl?.textContent.trim(),
      };
    });

    const appShell = document.getElementById('app-shell') || document.body;
    const shellRect = appShell.getBoundingClientRect();

    return {
      found: true,
      position: navStyle.position,
      borderRadius: navStyle.borderRadius,
      backgroundColor: navStyle.backgroundColor,
      border: navStyle.border,
      padding: navStyle.padding,
      zIndex: navStyle.zIndex,
      navRect: {
        width: Math.round(navRect.width),
        height: Math.round(navRect.height),
        left: Math.round(navRect.left),
        right: Math.round(navRect.right),
        bottom: Math.round(navRect.bottom),
      },
      distFromShellLeft: Math.round(navRect.left - shellRect.left),
      distFromShellRight: Math.round(shellRect.right - navRect.right),
      distFromShellBottom: Math.round(shellRect.bottom - navRect.bottom),
      tabCount: tabs.length,
      tabs,
    };
  })()`;

  // 1. TEST AT 360 WIDTH
  console.log('\n--- 1. Testing at 360x640 (Mobile Small) ---');
  await setViewport(360, 640, true);
  await sleep(600);
  const data360 = await evaluate(inspectTabBar);
  console.log('360x640 TabBar Info:', JSON.stringify(data360, null, 2));
  await takeScreenshot('tabbar_360x640.png');

  // 2. TEST AT 390 WIDTH
  console.log('\n--- 2. Testing at 390x844 (Mobile Standard) ---');
  await setViewport(390, 844, true);
  await sleep(600);
  const data390 = await evaluate(inspectTabBar);
  console.log('390x844 TabBar Info:', JSON.stringify(data390, null, 2));
  await takeScreenshot('tabbar_390x844.png');

  // 3. TEST AT 430 WIDTH
  console.log('\n--- 3. Testing at 430x932 (Mobile Large) ---');
  await setViewport(430, 932, true);
  await sleep(600);
  const data430 = await evaluate(inspectTabBar);
  console.log('430x932 TabBar Info:', JSON.stringify(data430, null, 2));
  await takeScreenshot('tabbar_430x932.png');

  // 4. TEST AT TABLET (768x1024)
  console.log('\n--- 4. Testing at 768x1024 (Tablet) ---');
  await setViewport(768, 1024, true);
  await sleep(600);
  const data768 = await evaluate(inspectTabBar);
  console.log('768x1024 TabBar Info:', JSON.stringify(data768, null, 2));
  await takeScreenshot('tabbar_tablet_768x1024.png');

  // 5. TEST AT DESKTOP PHONE FRAME (1440x900)
  console.log('\n--- 5. Testing at 1440x900 (Desktop Phone Frame) ---');
  await setViewport(1440, 900, false);
  await sleep(800);
  const data1440 = await evaluate(inspectTabBar);
  console.log('1440x900 TabBar Info:', JSON.stringify(data1440, null, 2));
  await takeScreenshot('tabbar_desktop_1440x900.png');

  // 6. TEST TAB NAVIGATION: Click "Services", "Book", "Bookings", "Chat", "Home"
  console.log('\n--- 6. Testing Tab Navigation ---');
  // Click "Services"
  await evaluate(`(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const servicesTab = tabs.find(t => t.textContent.includes('Services'));
    if (servicesTab) servicesTab.click();
  })()`);
  await sleep(400);
  const servicesActive = await evaluate(`(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const servicesTab = tabs.find(t => t.textContent.includes('Services'));
    return {
      isSelected: servicesTab?.getAttribute('aria-selected') === 'true',
      hasHeading: Boolean(document.querySelector('h1')?.textContent.includes('Services')),
    };
  })()`);
  console.log('Services Tab Click:', servicesActive);
  await takeScreenshot('tabbar_services_active.png');

  // Click "Book" (should navigate to Schedule screen)
  console.log('\n--- Testing Book Tab (Opens Schedule screen) ---');
  await evaluate(`(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const bookTab = tabs.find(t => t.textContent.includes('Book') && !t.textContent.includes('Bookings'));
    if (bookTab) bookTab.click();
  })()`);
  await sleep(500);
  const bookNavResult = await evaluate(`(() => {
    const h1 = document.querySelector('h1');
    const nav = document.querySelector('nav[role="tablist"]');
    return {
      screenHeading: h1?.textContent.trim(),
      isScheduleScreen: document.body.textContent.includes('Select Date & Time') || document.body.textContent.includes('Date & Time'),
      tabBarHidden: !nav || nav.offsetParent === null,
    };
  })()`);
  console.log('Book Tab Click Result:', bookNavResult);
  await takeScreenshot('tabbar_schedule_screen.png');

  // Go back to home
  await evaluate(`(() => {
    const backBtn = document.querySelector('button[aria-label="Go back"]');
    if (backBtn) backBtn.click();
  })()`);
  await sleep(500);

  // Click "Bookings"
  console.log('\n--- Testing Bookings Tab ---');
  await evaluate(`(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const bTab = tabs.find(t => t.textContent.includes('Bookings'));
    if (bTab) bTab.click();
  })()`);
  await sleep(400);
  const bookingsActive = await evaluate(`(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const bTab = tabs.find(t => t.textContent.includes('Bookings'));
    return {
      isSelected: bTab?.getAttribute('aria-selected') === 'true',
      hasHeading: document.body.textContent.includes('My Bookings') || document.body.textContent.includes('Upcoming'),
    };
  })()`);
  console.log('Bookings Tab Click:', bookingsActive);
  await takeScreenshot('tabbar_bookings_active.png');

  // Click "Home"
  await evaluate(`(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const homeTab = tabs.find(t => t.textContent.includes('Home'));
    if (homeTab) homeTab.click();
  })()`);
  await sleep(400);

  // 7. TEST THEMES (coral, lime, mint, lavender)
  console.log('\n--- 7. Testing 4 Themes Contrast & Variables ---');
  for (const theme of ['coral', 'lime', 'mint', 'lavender']) {
    await evaluate(`document.documentElement.setAttribute('data-theme', '${theme}')`);
    await sleep(200);
    const themeMetrics = await evaluate(`(() => {
      const activeTab = document.querySelector('button[role="tab"][aria-selected="true"]');
      const style = window.getComputedStyle(activeTab);
      const rootStyle = window.getComputedStyle(document.documentElement);
      return {
        theme: '${theme}',
        primary: rootStyle.getPropertyValue('--primary').trim(),
        primaryTint: rootStyle.getPropertyValue('--primary-tint').trim(),
        primaryText: rootStyle.getPropertyValue('--primary-text').trim(),
        activeBg: style.backgroundColor,
        activeColor: style.color,
      };
    })()`);
    console.log(`Theme ${theme} metrics:`, themeMetrics);
    await takeScreenshot(`tabbar_theme_${theme}.png`);
  }

  // Reset theme to coral
  await evaluate(`document.documentElement.removeAttribute('data-theme')`);

  // 8. TEST SHEET OPENING (Verify TabBar slides down and hides smoothly)
  console.log('\n--- 8. Testing Bottom Sheet Open / Hide TabBar ---');
  await setViewport(390, 844, true);
  await sleep(400);
  await evaluate(`(() => {
    const claimBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Claim Offer'));
    if (claimBtn) claimBtn.click();
  })()`);
  await sleep(500);

  const sheetTabBarState = await evaluate(`(() => {
    const nav = document.querySelector('nav[role="tablist"]');
    const wrapper = nav?.parentElement;
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
    return {
      wrapperOpacity: wrapperStyle?.opacity,
      wrapperTransform: wrapperStyle?.transform,
      wrapperPointerEvents: wrapperStyle?.pointerEvents,
      navRect: navRect ? { top: Math.round(navRect.top), bottom: Math.round(navRect.bottom) } : null,
      isOffScreenOrHidden: (wrapperStyle?.opacity === '0') || (navRect && navRect.top >= window.innerHeight),
    };
  })()`);
  console.log('Sheet Open TabBar State:', sheetTabBarState);
  await takeScreenshot('tabbar_hidden_by_sheet.png');

  // Close sheet
  await evaluate(`(() => {
    const closeBtn = document.querySelector('button[aria-label="Close estimate form"]') || document.querySelector('button[aria-label="Close dialog"]') || document.querySelector('button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  })()`);
  await sleep(600);

  const sheetClosedTabBarState = await evaluate(`(() => {
    const nav = document.querySelector('nav[role="tablist"]');
    const wrapper = nav?.parentElement;
    const wrapperStyle = wrapper ? window.getComputedStyle(wrapper) : null;
    return {
      wrapperOpacity: wrapperStyle?.opacity,
      wrapperPointerEvents: wrapperStyle?.pointerEvents,
      isRestored: wrapperStyle?.opacity === '1',
    };
  })()`);
  console.log('Sheet Closed TabBar State:', sheetClosedTabBarState);

  console.log('\nAll tests complete! Cleaning up...');
  ch.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

run().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
