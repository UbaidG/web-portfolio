export interface VideoPromptSpec {
  id: string;
  title: string;
  concept: string;
  cameraSetup: {
    lens: string;
    focalLength: string;
    aperture: string;
    angle: string;
    motion: string;
    framerate: string;
  };
  lightingSetup: {
    keyLight: string;
    rimLight: string;
    ambient: string;
    temperature: string;
    volumetric: string;
  };
  environmentAesthetics: {
    surface: string;
    backdrop: string;
    propDetails: string;
    colorPalette: string[];
  };
  promptText: string;
  startFrameDescription: string;
  endFrameDescription: string;
  startFrameUrl: string;
  endFrameUrl: string;
  suggestedTools: string[];
}

export const COFFEE_OVERFLOW_VIDEO_SPEC: VideoPromptSpec = {
  id: "espresso-overflow-v1",
  title: "Hero Section: The Espresso Extraction & Liquid Cascade",
  concept:
    "A photorealistic macro cinematic sequence of an artisan ceramic espresso cup filling with rich crema, overflowing smoothly over the curved rim, and cascading down a fluted slate stone platform into a dark liquid wave.",
  cameraSetup: {
    lens: "Hasselblad HC 2,2/100mm or Cooke Anamorphic /i Full Frame Plus 85mm",
    focalLength: "85mm Macro",
    aperture: "f/1.8 (razor-sharp focal plane on cup rim, soft cinematic background falloff)",
    angle: "15° elevated macro close-up, eye-level with the cup's meniscus",
    motion: "Slow, imperceptible 3% push-in dolly forward with zero jitter; camera remains anchored on the cup center",
    framerate: "120fps high-speed capture (conforming to 24fps for luxurious slow-motion liquid physics)",
  },
  lightingSetup: {
    keyLight: "Soft 45-degree directional diffused octabox from top-left, shaping the cylindrical ceramic curvature",
    rimLight: "Hard 3200K tungsten backlight tracing the porcelain lip and edge of the cascading liquid ribbons",
    ambient: "Deep matte slate room tone, -3 EV ambient fill to preserve dramatic chiaroscuro contrast",
    temperature: "3200K warm gold highlights against 5600K cool titanium ambient shadows",
    volumetric: "Subtle wisp of rising coffee steam caught in the backlight, dissipating into negative space",
  },
  environmentAesthetics: {
    surface: "Architectural fluted dark basalt/slate stone slab with fine mineral grain",
    backdrop: "Dark warm graphite studio gradient, minimal brutalist luxury cafe lab",
    propDetails: "Hand-thrown stoneware ceramic espresso cup in matte bone-cream glaze, unglazed raw textured base",
    colorPalette: ["#1b1009", "#2b170d", "#c87a3e", "#f5ebe0", "#181a1b"],
  },
  promptText:
    "Cinematic 8k macro slow-motion video, 120fps. A minimalist handcrafted bone-cream matte stoneware espresso cup sitting on a dark fluted slate stone plinth. Shot on 85mm anamorphic prime lens at f/1.8. Dramatic chiaroscuro studio lighting, 3200K golden rim light tracing the lip. The cup starts filled to 95% with thick golden hazelnut-striped espresso crema. In smooth slow motion, the espresso rises, forms a tense liquid meniscus at the brim, and luxuriously spills over the ceramic edge. Three thick, glossy, dark amber liquid ribbons run smoothly down the matte side of the cup and pool onto the fluted stone counter, spreading outward into a reflective liquid floor with micro-crema bubbles and golden reflections. Subtle steam curls gently into the dark backdrop. Ultra-realistic fluid dynamics, viscous liquid velocity, surface tension break, zero turbulence.",
  startFrameDescription:
    "Start frame (0.0s): Espresso cup filled to 95% brim with tiger-striped crema resting statically under soft morning light.",
  endFrameDescription:
    "End frame (5.0s): Viscous dark espresso cascading down the ceramic sides and pooling into a reflective amber fluid mirror on the stone platform.",
  startFrameUrl: `${import.meta.env.BASE_URL}designs/espresso-start.jpg`,
  endFrameUrl: `${import.meta.env.BASE_URL}designs/espresso-overflow.jpg`,
  suggestedTools: [
    "Runway Gen-3 Alpha (Image-to-Video)",
    "Kling AI 1.5 (Image-to-Video with Camera Motion: Zoom In 1.2)",
    "Luma Dream Machine (Keyframe Start + End interpolation)",
    "OpenAI Sora",
  ],
};
