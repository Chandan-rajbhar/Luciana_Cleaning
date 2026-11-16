const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\UXDLab\\.gemini\\antigravity\\brain\\6ece447d-9f22-47ea-b0b0-128c6def58f2';

const tests = [
  { name: 'verify_ipad_mini_portrait_768x1024', w: 768, h: 1024, touch: false },
  { name: 'verify_ipad_mini_landscape_1024x768', w: 1024, h: 768, touch: false },
  { name: 'verify_android_tablet_800x1280', w: 800, h: 1280, touch: false },
  { name: 'verify_ipad_air_landscape_1180x820', w: 1180, h: 820, touch: true },
  { name: 'verify_ipad_pro_12_9_landscape_1366x1024', w: 1366, h: 1024, touch: true },
  { name: 'verify_phone_390x844', w: 390, h: 844, touch: false },
  { name: 'verify_desktop_1440x900', w: 1440, h: 900, touch: false },
];

for (const t of tests) {
  const outPath = path.join(artifactDir, `${t.name}.png`);
  const touchArgs = t.touch ? '--touch-events=enabled' : '';
  // On Windows, Chrome headless window-size includes 16px frame width and 95px frame height
  const winW = t.w + 16;
  const winH = t.h + 95;
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-sandbox ${touchArgs} --window-size=${winW},${winH} --virtual-time-budget=2000 --screenshot="${outPath}" http://localhost:5173/`;
  console.log(`Capturing ${t.name} at viewport ${t.w}x${t.h}...`);
  try {
    execSync(cmd, { stdio: 'ignore' });
    console.log(`Captured ${t.name}`);
  } catch (err) {
    console.error(`Failed ${t.name}:`, err.message);
  }
}
