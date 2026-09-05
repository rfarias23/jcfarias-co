/**
 * Responsive conformance audit — spec 003.
 *
 * Loads the home page at 390, 834 and 1440 px in headless Chrome and checks every
 * cell of the README "Responsive behaviour" table (9 rows x 3 viewports = 27 cells),
 * plus touch targets, prefers-reduced-motion, the CC BY-SA credit and page overflow.
 *
 *   URL=http://localhost:3000/ npm run audit:responsive
 *
 * Uses the locally installed Google Chrome (override with CHROME_PATH). No browser
 * download. Exit code 1 if any cell or check fails.
 */
import { chromium } from "playwright-core";

const TARGET = process.env.URL ?? "http://localhost:3000/";
const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VIEWPORTS = [
  { w: 390, h: 844, tier: "mobile" },
  { w: 834, h: 1112, tier: "tablet" },
  { w: 1440, h: 900, tier: "desktop" },
];

function probe() {
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  const vis = (el) => !!el && cs(el).display !== "none" && cs(el).visibility !== "hidden";
  const cols = (el) => (el ? cs(el).gridTemplateColumns.split(" ").length : 0);

  const desktopNav = q("header nav");
  const burger = q('button[aria-label="Open menu"]');
  const heroGrid = q("#top > div");
  const heroCols = heroGrid ? cs(heroGrid).gridTemplateColumns.split(" ").map(parseFloat) : [];
  const plate = q('img[alt^="Museo Soumaya"]')?.parentElement;
  const practiceGrid = q("#practice > div.grid");
  const statsGrid = qa("main div.grid").find(
    (g) => g.className.includes("grid-cols-2") && g.className.includes("md:grid-cols-4"),
  );
  const txOuter = q("#transactions > div[class*='overflow-x-auto']");
  const txTrack = txOuter?.firstElementChild;
  const txRows = qa("#transactions [class*='grid-cols-[minmax']");
  const txHint = qa("#transactions p").find((p) =>
    p.textContent.includes("Scroll for the full record"),
  );
  const projGrid = qa("main div.grid").find(
    (g) => g.className.includes("md:grid-cols-2") && g.className.includes("gap-0.5"),
  );
  const projFrame = projGrid?.firstElementChild;
  const insightsGrid = q("#insights > div.grid");
  const aboutGrid = q("#about > div.grid");
  const portrait = q('img[alt="Juan Carlos Farias"]')?.parentElement;
  const footer = q("footer#contact");
  const footerGrid = footer?.querySelector(".shell.grid");
  const officesGrid = footer?.querySelector("div.grid.grid-cols-2");
  const mailBtn = footer?.querySelector('a[href^="mailto:"]');
  const credit = qa("p").find((p) => p.textContent.includes("CC BY-SA"));

  return {
    scrollW: document.documentElement.scrollWidth,
    innerW: innerWidth,
    innerH: innerHeight,
    nav: {
      desktop: vis(desktopNav),
      burger: vis(burger),
      burgerRect: rect(burger),
      contact: !!desktopNav?.querySelector('a[href="#contact"]'),
    },
    hero: {
      cols: heroCols.length,
      ratio: heroCols.length === 2 ? heroCols[0] / heroCols[1] : null,
    },
    plate: { h: rect(plate)?.h ?? 0 },
    practice: {
      cols: cols(practiceGrid),
      gap: cs(practiceGrid)?.gap,
      bg: cs(practiceGrid)?.backgroundColor,
    },
    insights: {
      cols: cols(insightsGrid),
      gap: cs(insightsGrid)?.gap,
      bg: cs(insightsGrid)?.backgroundColor,
    },
    stats: { cols: cols(statsGrid), gap: cs(statsGrid)?.gap, bg: cs(statsGrid)?.backgroundColor },
    tx: {
      overflowX: cs(txOuter)?.overflowX,
      clientW: txOuter?.clientWidth,
      scrollW: txOuter?.scrollWidth,
      trackMinW: cs(txTrack)?.minWidth,
      rows: txRows.length,
      colsPerRow: txRows.length ? cols(txRows[0]) : 0,
      hint: vis(txHint),
    },
    projects: { cols: cols(projGrid), frameH: rect(projFrame)?.h ?? 0 },
    about: { cols: cols(aboutGrid), portraitMaxW: cs(portrait)?.maxWidth },
    footer: { cols: cols(footerGrid), officesCols: cols(officesGrid), mailRect: rect(mailBtn) },
    credit: {
      visible: vis(credit),
      link: !!credit?.querySelector('a[href*="commons.wikimedia.org"]'),
    },
  };
}

function probeMenu() {
  const cs = (el) => getComputedStyle(el);
  const rect = (el) => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  const overlay = document.querySelector("div.fixed.inset-0");
  const close = document.querySelector('button[aria-label="Close menu"]');
  const links = [...overlay.querySelectorAll("nav a")];
  return {
    visible: cs(overlay).visibility === "visible" && cs(overlay).opacity === "1",
    bg: cs(overlay).backgroundColor,
    rect: rect(overlay),
    bodyOverflow: document.body.style.overflow,
    closeRect: rect(close),
    minLinkH: Math.min(...links.map((a) => rect(a).h)),
  };
}

const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;
const RULE = "rgb(228, 228, 228)";
const INK = "rgb(14, 14, 14)";

function evaluateCells(v, r, menu) {
  const m = v.tier === "mobile";
  const t = v.tier === "tablet";
  const d = v.tier === "desktop";
  const vh = (n) => Math.round((v.h * n) / 100);
  return [
    [
      "Nav",
      d
        ? r.nav.desktop && !r.nav.burger && r.nav.contact
        : !r.nav.desktop &&
          r.nav.burger &&
          menu?.visible &&
          menu.bg === INK &&
          menu.rect.w === v.w &&
          menu.bodyOverflow === "hidden",
      d
        ? `nav visible, contact=${r.nav.contact}`
        : `burger, overlay ${menu?.bg} ${menu?.rect.w}x${menu?.rect.h}`,
    ],
    [
      "Hero",
      d ? r.hero.cols === 2 && near(r.hero.ratio, 1.35 / 0.65, 0.02) : r.hero.cols === 1,
      `cols=${r.hero.cols}${r.hero.ratio ? ` ratio=${r.hero.ratio.toFixed(3)}` : ""}`,
    ],
    [
      "Hero plate",
      m
        ? near(r.plate.h, Math.max(vh(54), 340))
        : t
          ? near(r.plate.h, Math.max(vh(66), 460))
          : near(r.plate.h, Math.max(vh(74), 520)),
      `${r.plate.h}px (${Math.round((r.plate.h / v.h) * 100)}vh)`,
    ],
    [
      "Practice / Insights",
      r.practice.cols === (m ? 1 : 3) &&
        r.insights.cols === (m ? 1 : 3) &&
        r.practice.gap === "1px" &&
        r.insights.gap === "1px" &&
        r.practice.bg === RULE &&
        r.insights.bg === RULE,
      `practice=${r.practice.cols} insights=${r.insights.cols} gap=${r.practice.gap}`,
    ],
    [
      "Stats",
      r.stats.cols === (m ? 2 : 4) && r.stats.gap === "1px" && r.stats.bg === RULE,
      `cols=${r.stats.cols} gap=${r.stats.gap}`,
    ],
    [
      "Transactions",
      r.tx.colsPerRow === 5 &&
        (d
          ? r.tx.overflowX === "visible" && r.tx.scrollW === r.tx.clientW && !r.tx.hint
          : r.tx.overflowX === "auto" &&
            r.tx.scrollW > r.tx.clientW &&
            r.tx.trackMinW === "860px" &&
            r.tx.hint),
      `cols=${r.tx.colsPerRow} overflow=${r.tx.overflowX} ${r.tx.scrollW}/${r.tx.clientW} hint=${r.tx.hint}`,
    ],
    [
      "Project frames",
      r.projects.cols === (m ? 1 : 2) &&
        (m
          ? near(r.projects.frameH, Math.max(vh(46), 300))
          : near(r.projects.frameH, Math.max(vh(60), 440))),
      `cols=${r.projects.cols} frame=${r.projects.frameH}px`,
    ],
    [
      "About",
      d
        ? r.about.cols === 2 && r.about.portraitMaxW === "none"
        : r.about.cols === 1 && r.about.portraitMaxW === "420px",
      `cols=${r.about.cols} portrait max-w=${r.about.portraitMaxW}`,
    ],
    [
      "Footer",
      r.footer.cols === (d ? 2 : 1) && r.footer.officesCols === 2,
      `cols=${r.footer.cols} offices=${r.footer.officesCols}`,
    ],
  ];
}

function evaluateChecks(v, r, menu) {
  const d = v.tier === "desktop";
  return [
    ["No page overflow", r.scrollW === r.innerW, `scrollWidth=${r.scrollW} viewport=${r.innerW}`],
    [
      "Touch targets 44px",
      r.footer.mailRect.h >= 44 &&
        (d ||
          (r.nav.burgerRect.w >= 44 &&
            r.nav.burgerRect.h >= 44 &&
            menu.closeRect.w >= 44 &&
            menu.closeRect.h >= 44 &&
            menu.minLinkH >= 44)),
      d
        ? `mail=${r.footer.mailRect.h}`
        : `burger=${r.nav.burgerRect.w}x${r.nav.burgerRect.h} close=${menu.closeRect.w}x${menu.closeRect.h} link>=${menu.minLinkH} mail=${r.footer.mailRect.h}`,
    ],
    [
      "CC BY-SA credit",
      r.credit.visible && r.credit.link,
      `visible=${r.credit.visible} commons link=${r.credit.link}`,
    ],
  ];
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
let cellsPass = 0;
let cellsTotal = 0;
let checksPass = 0;
let checksTotal = 0;
const line = (ok, label, detail) =>
  console.log(`${ok ? "CUMPLE    " : "NO CUMPLE "} ${label.padEnd(34)} ${detail}`);

try {
  for (const v of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: v.w, height: v.h },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(TARGET, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(probe);
    let menu = null;
    let escClosed = true;
    if (v.tier !== "desktop") {
      await page.click('button[aria-label="Open menu"]');
      await page.waitForTimeout(400);
      menu = await page.evaluate(probeMenu);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      escClosed = await page.evaluate(
        () => getComputedStyle(document.querySelector("div.fixed.inset-0")).visibility === "hidden",
      );
    }
    console.log(`\n── ${v.w}×${v.h} (${v.tier}) ──`);
    for (const [label, ok, detail] of evaluateCells(v, r, menu)) {
      cellsTotal++;
      if (ok) cellsPass++;
      line(ok, `[celda] ${label}`, detail);
    }
    const checks = evaluateChecks(v, r, menu);
    if (v.tier !== "desktop") checks.push(["Escape closes menu", escClosed, `hidden=${escClosed}`]);
    for (const [label, ok, detail] of checks) {
      checksTotal++;
      if (ok) checksPass++;
      line(ok, `[check] ${label}`, detail);
    }
    await ctx.close();
  }

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(TARGET, { waitUntil: "networkidle" });
  const rm = await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    nav: parseFloat(getComputedStyle(document.querySelector("header nav a")).transitionDuration),
    overlay: parseFloat(
      getComputedStyle(document.querySelector("div.fixed.inset-0")).transitionDuration,
    ),
  }));
  const rmOk = rm.scroll === "auto" && rm.nav <= 0.01 && rm.overlay <= 0.01;
  checksTotal++;
  if (rmOk) checksPass++;
  console.log(`\n── prefers-reduced-motion (1440) ──`);
  line(
    rmOk,
    "[check] Reduced motion",
    `scroll-behavior=${rm.scroll} nav=${rm.nav}s overlay=${rm.overlay}s`,
  );
  await ctx.close();
} finally {
  await browser.close();
}

console.log(
  `\n${cellsPass}/${cellsTotal} celdas CUMPLE · ${checksPass}/${checksTotal} checks adicionales CUMPLE`,
);
process.exit(cellsPass === cellsTotal && checksPass === checksTotal ? 0 : 1);
