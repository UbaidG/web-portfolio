# Coffee-Themed Portfolio Explorations: 3 Master Designs
**Cinematic Developer Fuel: Realistic 3D Steam Mugs, Seamless Bean Rivers & Horizontal Scroll Runways**
*Candidate: Ubaid Ghante — Machine Learning Engineer & Multi-Agent Systems Architect*

---

## Executive Summary & Creative Direction

Following your feedback and deep study of `Screen Recording 2026-09-14 at 1.49.08 AM.mov` and `Screen Recording 2026-09-14 at 1.14.36 AM.mov`:
1. **Scope Refined to 3 High-Polish Master Designs**:
   - Rather than 6 divergent prototypes, we crafted **3 deeply polished, production-grade designs** centered entirely on the **Coffee Theme** (the quintessential developer fuel).
2. **100% Genuine Resume Data**:
   - Completely eradicated all fictional quotes ("Jamie R.", "Gol D. Roger", "Hollywood is not ready") and fake review stats ("364 reviews").
   - Integrated Ubaid Ghante's exact career metrics: Korn Ferry (170M+ profiles, LLM job classification), ACE Software Solutions (autonomous banking swarms with CrewAI, LangGraph & Bedrock), Kratin LLC (20,890+ patients speech-to-text clinical voice agent), GH Raisoni College of Engineering (9.3 CGPA Summa Cum Laude), and 5x Google & IBM Certifications.
3. **Realistic 3D Coffee Elements & Procedural Steam**:
   - Replaced flat coasters with a **photorealistic 3D Coffee Mug / Takeaway Cup** featuring a hollow ceramic interior, liquid coffee surface with a golden crema ring, and **rising procedural steam particles** with organic wind turbulence.
   - Replaced primitive ellipsoids with **anatomically realistic coffee beans** featuring a curved longitudinal fissure/crease, raised inner lips, and procedural roasted PBR texture with micro-grain and oil sheen.
4. **Seamless Off-Screen Loop (No Visible Reset Pop)**:
   - Extended the stream horizontal bounds to $X \in [-36, +36]$ (the camera viewport at $Z=20$ is only $[-16, +16]$).
   - Beans spawn and recycle 20 units off-screen, completely eliminating any visible jumping or popping. Speed reduced to a gentle, organic drift ($0.02$ units/frame) with elastic cursor repulsion.
5. **Horizontal Scroll-Left Runway on Scroll Down**:
   - Studied `Screen Recording 2026-09-14 at 1.49.08 AM.mov` frame-by-frame: vertical scrolling seamlessly drives a horizontal card slide across the screen.
   - Built a 300vh pinned container where vertical scrolling translates career milestone cards smoothly from right to left (`translateX(-${progress * 65}%)`), letting the viewer traverse Korn Ferry, ACE Software, Kratin LLC, and GH Raisoni horizontally before unlocking vertical page flow.
6. **Multi-Stage Animation Phasing**:
   - Animations do not run continuously in a monolithic blur. Instead, animations are partitioned into distinct stages:
     - **Stage 1 (Hero & Extraction)**: 3D Coffee Cup with rising steam and gentle off-screen bean stream.
     - **Stage 2 (Horizontal Runway)**: Bean stream fades out as the horizontal card conveyor locks in.
     - **Stage 3 (Cupping Matrix / Lab Gauges)**: Interactive parameter controls, tech stack matrix, and project showcase.
     - **Stage 4 (Roast Log & Colophon)**: 5x Certifications and terminal contact footer.

---

## Live Interactive Testing Controls

The web application is live and running at **`http://localhost:5173/web-portfolio/`**:
- **Floating Switcher Dock**: Fixed at the bottom-center. Click **1**, **2**, or **3** to switch designs instantly with zero reload delay.
- **Instant Keyboard Shortcuts**: Press keys `1`, `2`, or `3` anywhere on the page to toggle between designs.
- **Direct URL Query Parameters**:
  - Design 1: `http://localhost:5173/web-portfolio/?v=1`
  - Design 2: `http://localhost:5173/web-portfolio/?v=2`
  - Design 3: `http://localhost:5173/web-portfolio/?v=3`

---

## Detailed Breakdown of the 3 Master Coffee Designs

---

### Design 1: The Espresso Lab (Modern Specialty Roastery)
*Dialing In High-Yield Distributed AI & Autonomous Agent Pipelines*

> **Concept**: A high-tech specialty coffee laboratory where machine learning engineering is treated like precision espresso extraction: calibrated pressure, optimal grind distribution, and zero-defect yield.

| Hero Viewport: 3D Ceramic Mug, Steam & Off-Screen Bean Stream | Scrolled View: Horizontal Career Runway & Extraction Gauges |
| :---: | :---: |
| ![Design 1 Hero](screenshots/coffee_design1_espresso_lab.png) | ![Design 1 Scrolled](screenshots/coffee_design1_espresso_lab_scrolled.png) |

#### Visual Identity & Design System
- **Palette**: Deep Roasted Espresso (`#0c0a09`), Warm Amber / Crema Gold (`#f59e0b` / `#d97706`), Steam Froth White (`#fafaf9`), Rich Walnut Wood (`#1c1917`).
- **Typography**: Space Grotesk / Inter Display for bold roast headers + JetBrains Mono for barista extraction telemetry.
- **3D Centerpiece**: High-polygon 3D ceramic mug with hollow chamber, dark liquid espresso, golden crema meniscus, and 85 animated steam particles floating upward with sinusoidal curl.
- **Interactive Bean Stream**: 135 roasted beans flowing gently left-to-right across $[-36, +36]$. Deflects outward when the mouse cursor approaches.
- **Horizontal Scroll Runway**:
  - Vertical scroll smoothly glides the candidate's career cards horizontally:
    1. **Korn Ferry**: Machine Learning Engineer (Nov 2025–Present) — ResearchFox 170M+ candidate profiles, LLM Job Classifier, Salary Prediction Engine, Datadog/Arize AX.
    2. **ACE Software Solutions**: AI Solutions Engineer (Nov 2024–Nov 2025) — Autonomous banking swarms with CrewAI & LangGraph on Amazon Bedrock, MCP servers.
    3. **Kratin LLC**: AI/ML Engineer (Jan 2023–Nov 2024) — Real-time Speech-to-Text clinical agent for 20,890+ patients, RAG & Neo4j graph pipeline.
    4. **GH Raisoni College of Engineering**: B.Tech CSE (2020–2024) — **9.3 CGPA (Summa Cum Laude)**, Top 1% rank.
- **Interactive Cupping Station**:
  - 4 interactive extraction sliders (Extraction Yield, Agent Pressure, Latency Tolerance, Crema Density) that dynamically compute a live Brew Rating and Model Output status.
- **Production Project Showcase**:
  - Voice Agent Pipeline (WebSockets / STT-LLM-TTS / 85ms).
  - Multi-Agent Financial Swarm (Amazon Bedrock / CrewAI / pgvector).
  - Stitchit iOS Mobile Intelligence (CoreML / Swift / FastViT).

---

### Design 2: Caffeine Overclocked (Developer Fuel Cyber-Roast)
*Autonomous Agent Architecture Fueled by High-Octane Roast*

> **Concept**: The raw, gritty, late-night engineering aesthetic. Coffee as the biochemical fuel powering terminal commands, multi-agent swarms, and high-throughput production infrastructure.

| Hero Viewport: Takeaway Cup, Heat Sleeve & Developer Terminal | Scrolled View: Production Conveyor Runway & 5x Certifications |
| :---: | :---: |
| ![Design 2 Hero](screenshots/coffee_design2_caffeine_overclocked.png) | ![Design 2 Scrolled](screenshots/coffee_design2_caffeine_overclocked_scrolled.png) |

#### Visual Identity & Design System
- **Palette**: Pitch Black Roastery (`#0a0806`), High-Octane Orange (`#f97316`), Terminal Amber (`#fbbf24`), Smoked Carbon (`#18181b`).
- **Typography**: Monospace Code Matrix (JetBrains Mono / Fira Code) with bold industrial technical headers.
- **3D Centerpiece**: 3D Kraft paper takeaway cup with ribbed brown heat sleeve, drinking lid opening, and rising vertical steam plume.
- **Interactive Bean Stream**: Dark-roasted beans flowing along a low-frequency conveyor line, tumbling when brushed by cursor coordinates.
- **Horizontal Production Conveyor (Scroll-Left on Scroll Down)**:
  - Sticky viewport translating industrial telemetry cards horizontally:
    - `01 / KORN FERRY CORE RUNTIME`: 170M+ candidate knowledge graph, Tableau MCP integration, Arize AX agent evaluation.
    - `02 / ACE FINANCIAL CLUSTER`: Bedrock-hosted multi-agent swarms, autonomous ledger auditing, pgvector indexing.
    - `03 / KRATIN CLINICAL ENGINE`: 20,890 lymphedema patient cohort, dual RASA + RAG diagnostic voice bot.
    - `04 / ACADEMIC KERNEL`: GH Raisoni B.Tech CSE, 9.3 CGPA, Academic Excellence Citation.
- **5x IBM & Google Certifications Board (Jan 2026)**:
  - Google: Deploying Generative AI on Vertex AI
  - Google: Foundations of AI & Vector Search
  - IBM: Generative AI Engineering & Multi-Agent Swarms
  - IBM: Enterprise LLMs & Prompt Optimization
  - IBM: Cloud AI Production Pipelines
- **Terminal Brew Monitor & Contact Shell**:
  - Live command prompt style contact form (`ubaid@coffee-terminal:~$ mail --to ubaidghante@gmail.com`).

---

### Design 3: Artisanal Crema (Luxury Editorial Cafe)
*Precision Craftsmanship, Single-Origin Intelligence & Elegant Typography*

> **Concept**: A luxurious, Michelin-caliber specialty cafe aesthetic. Understated warmth, elegant editorial serif typography, and tactile craftsmanship reflecting senior engineering maturity.

| Hero Viewport: Layered Cortado Glass, Froth Meniscus & Soft Stream | Scrolled View: Editorial Horizontal Career Gallery & Colophon |
| :---: | :---: |
| ![Design 3 Hero](screenshots/coffee_design3_artisanal_crema.png) | ![Design 3 Scrolled](screenshots/coffee_design3_artisanal_crema_scrolled.png) |

#### Visual Identity & Design System
- **Palette**: Roasted Mocha Dark (`#17120e`), Oat Milk Silk (`#f5ede2`), Warm Cinnamon (`#c27803`), Burnished Gold (`#d4af37`).
- **Typography**: Editorial Serif Display (Playfair / Cormorant style) paired with clean geometric grotesque for body and micro-labels.
- **3D Centerpiece**: Minimalist flared ceramic cortado cup with rich espresso gradient, steamed micro-foam top, and delicate vapor trails.
- **Interactive Bean Stream**: Relaxed, floating beans with subtle rotational momentum and soft elastic cursor dispersal.
- **Editorial Horizontal Career Slide**:
  - Pinned horizontal slide exhibiting career chapters with curated pull-quotes and authentic technical accomplishments:
    - *Chapter I: The Distributed Graph* — Korn Ferry (170M+ Profiles, LLM Classifier).
    - *Chapter II: The Autonomous Agent* — ACE Software Solutions (Bedrock Swarms & MCPs).
    - *Chapter III: The Clinical Voice* — Kratin LLC (20,890 Patients Speech-to-Text).
    - *Chapter IV: Summa Cum Laude* — GH Raisoni B.Tech CSE (9.3 CGPA).
- **Cupping Scorecard Matrix**:
  - Sensory analysis breakdown: Aroma (Distributed Architecture), Body (Production Scale), Acidity (Multi-Agent Reasoning), Balance (Latency & Cost Optimization).
- **Artisanal Project Collection & Editorial Colophon**:
  - Multi-card gallery highlighting Ubaid's GitHub, LinkedIn, and email with bespoke typography.

---

## Technical Architecture & Engineering Solutions

### 1. Parametric 3D Coffee Bean Geometry & Texture (`coffeeAssets.ts`)
```typescript
// Custom bean deformation: asymmetrical ellipsoid with longitudinal crease
const geometry = new THREE.SphereGeometry(0.55, 32, 24);
const pos = geometry.attributes.position;
for (let i = 0; i < pos.count; i++) {
  let x = pos.getX(i) * 1.5;
  let y = pos.getY(i) * 0.95;
  let z = pos.getZ(i) * 0.75;
  // Longitudinal fissure (groove) on front face (z > 0)
  if (z > 0.05) {
    const distFromCenterline = Math.abs(x);
    if (distFromCenterline < 0.28) {
      const creaseDepth = Math.cos((distFromCenterline / 0.28) * (Math.PI / 2)) * 0.22;
      z -= creaseDepth;
    }
  }
  pos.setXYZ(i, x, y, z);
}
```
Paired with a 512×512 procedural canvas texture featuring dark roasted gradients, radial fiber grain, and a deep brown fissure seam.

### 2. Seamless Off-Screen Stream Cycling (`RealisticCoffeeBeanStream.tsx`)
- Camera view width at $Z=20$ is roughly $[-16, +16]$.
- Stream bounds are set to $[-36, +36]$:
  ```typescript
  if (b.x > 36) {
    b.x = -36; // Re-enters 20 units outside the left screen boundary
    b.y = b.baseY + (Math.random() - 0.5) * 4;
  }
  ```
- Result: **Zero visible popping or resetting**. The stream appears truly infinite.

### 3. Procedural Rising Steam Particles (`CoffeeMug3DCanvas.tsx`)
- 85 billowed steam particles with additive blending (`THREE.AdditiveBlending`).
- Individual vertical velocity ($0.035$ to $0.065$) combined with sinusoidal lateral wobble:
  $$\Delta x = \sin(t \times 2.0 + \text{phase}) \times 0.015$$
- Opacity smoothly fades to zero as particles rise above the mug rim ($Y > 3.5$), creating an authentic hot coffee vapor plume.

### 4. Horizontal Scroll-Left Runway (`HorizontalScrollRunway.tsx`)
- Uses a `300vh` outer container with a `100vh sticky` viewport.
- As the user scrolls through the 300vh height:
  $$\text{progress} = \frac{-\text{rect.top}}{\text{offsetHeight} - \text{innerHeight}}$$
  $$\text{translateX} = -\text{progress} \times 65\%$$
- Once horizontal progress reaches 100%, vertical scrolling naturally resumes into subsequent sections. Exactly replicates the motion demonstrated in `Screen Recording 2026-09-14 at 1.49.08 AM.mov`.

---

## Verification & Build Validation

- **TypeScript Compilation & Vite Build**: Passed with 0 errors (`tsc -b && vite build` completed in 1.42s).
- **Puppeteer Headless Visual Capture**: Rendered and captured 6 high-definition screenshots across all 3 designs in both hero viewports and scrolled horizontal runways:
  - `screenshots/coffee_design1_espresso_lab.png`
  - `screenshots/coffee_design1_espresso_lab_scrolled.png`
  - `screenshots/coffee_design2_caffeine_overclocked.png`
  - `screenshots/coffee_design2_caffeine_overclocked_scrolled.png`
  - `screenshots/coffee_design3_artisanal_crema.png`
  - `screenshots/coffee_design3_artisanal_crema_scrolled.png`
- **Active Dev Server**: Accessible on `http://localhost:5173/web-portfolio/`.
