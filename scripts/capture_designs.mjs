import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUTPUT_DIR = path.resolve("./screenshots");
const ARTIFACTS_DIR = "/Users/ubaidghante/.gemini/antigravity-ide/brain/a5d60a67-db0e-498e-b097-7a6dac47be35";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log("Launching Chrome at:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--window-size=1440,960",
    ],
    defaultViewport: { width: 1440, height: 960 },
  });

  const designs = [
    { id: 1, name: "design1_atelier.png", label: "Kinetic Atelier / Fluid Editorial" },
    { id: 2, name: "design2_cyber_terminal.png", label: "Neural Cyber-Terminal" },
    { id: 3, name: "design3_swiss_blueprint.png", label: "Swiss Modernist Blueprint" },
    { id: 4, name: "design4_ethereal_aurora.png", label: "Ethereal Aurora" },
    { id: 5, name: "design5_analog_archive.png", label: "1970s Braun Analog Archive" },
    { id: 6, name: "design6_spatial_gallery.png", label: "Spatial Holo-Gallery" },
  ];

  for (const d of designs) {
    console.log(`\nCapturing Design #${d.id} (${d.label})...`);
    const page = await browser.newPage();
    const url = `http://localhost:5173/web-portfolio/?v=${d.id}`;
    
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    // Allow Three.js and animations to settle
    await new Promise((r) => setTimeout(r, 2500));

    // Capture Hero / Top fold
    const outPath = path.join(OUTPUT_DIR, d.name);
    await page.screenshot({ path: outPath, type: "png" });
    console.log(`Saved screenshot to: ${outPath}`);

    // Copy to artifacts dir for embedding in markdown
    const artifactPath = path.join(ARTIFACTS_DIR, d.name);
    fs.copyFileSync(outPath, artifactPath);
    console.log(`Copied to artifacts dir: ${artifactPath}`);

    // Capture a scrolled fold view for deep evaluation
    await page.evaluate(() => window.scrollBy({ top: 900, behavior: "instant" }));
    await new Promise((r) => setTimeout(r, 1200));
    const scrolledName = d.name.replace(".png", "_scrolled.png");
    const scrolledPath = path.join(OUTPUT_DIR, scrolledName);
    await page.screenshot({ path: scrolledPath, type: "png" });
    fs.copyFileSync(scrolledPath, path.join(ARTIFACTS_DIR, scrolledName));
    console.log(`Saved scrolled view to: ${scrolledPath}`);

    await page.close();
  }

  await browser.close();
  console.log("\nAll 6 designs successfully captured!");
}

capture().catch((err) => {
  console.error("Screenshot capture error:", err);
  process.exit(1);
});
