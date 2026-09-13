import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = path.resolve("./screenshots/origin-study");
const BASE_URL = "http://localhost:5173/web-portfolio/";

const viewports = [
  { name: "desktop", width: 1440, height: 960 },
  { name: "mobile", width: 390, height: 844 },
];

const checkpoints = [
  { name: "hero", progress: 0 },
  { name: "mid", progress: 0.45 },
  { name: "end", progress: 0.84 },
];

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function capture() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
    ],
  });

  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(BASE_URL, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    await wait(1600);

    for (const checkpoint of checkpoints) {
      await page.evaluate((progress) => {
        document.documentElement.style.scrollBehavior = "auto";
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.max(0, maxScroll * progress));
      }, checkpoint.progress);
      await wait(700);

      const filename = `origin-study-${viewport.name}-${checkpoint.name}.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        type: "png",
      });
      console.log(`Captured ${filename}`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`Saved Origin Study captures to ${OUTPUT_DIR}`);
}

capture().catch((error) => {
  console.error("Screenshot capture error:", error);
  process.exit(1);
});
