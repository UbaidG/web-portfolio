export interface VideoKeyframe {
  number: number;
  timecode: string;
  phase: string;
  description: string;
  imageUrl: string;
  isUserReference?: boolean;
}

export interface VideoPromptSpec {
  id: string;
  title: string;
  concept: string;
  cameraSetup: {
    lens: string;
    focalLength: string;
    aperture: string;
    angle: string;
    panDownMotion: string;
    framerate: string;
  };
  lightingSetup: {
    keyLight: string;
    fillLight: string;
    ambient: string;
    temperature: string;
    volumetric: string;
  };
  environmentAesthetics: {
    plinthSurface: string;
    backdrop: string;
    teapot: string;
    cup: string;
    colorPalette: string[];
    websiteTransition: string;
  };
  masterPromptText: string;
  keyframes: VideoKeyframe[];
  suggestedTools: string[];
}

export const COFFEE_OVERFLOW_VIDEO_SPEC: VideoPromptSpec = {
  id: "espresso-white-stone-pour-v3",
  title: "Hero Sequence: 9-Frame Teapot Pour, Stone Cascade & Pure White Transition",
  concept:
    "A photorealistic macro slow-motion commercial sequence: an elegant off-white ceramic teapot pours steaming dark coffee into a handcrafted ceramic cup resting on an architectural white stone plinth. The camera remains locked at eye level as the coffee fills to the brim and creates a rich crema dome (Frames 1-2), overflowing onto the white stone surface (Frame 3). Only as the coffee cascades down the vertical white marble wall does the camera begin a smooth, cinematic pan-down (Frames 4-7), following the descending viscous drips as the background brightens into high-key studio light (Frame 8), arriving at a completely pure white frame with thick coffee dripping in the top right corner (Frame 9) that seamlessly merges with the portfolio website.",
  cameraSetup: {
    lens: "Cooke Anamorphic /i Full Frame Plus 85mm Prime or ARRI Signature Prime 75mm",
    focalLength: "85mm Macro",
    aperture: "f/2.0 (razor focus on ceramic cup rim, liquid crema meniscus, buttery shallow depth of field)",
    angle: "Starts at eye-level macro close-up locked on the ceramic cup and teapot spout (Frames 1-3)",
    panDownMotion:
      "STRICT CAMERA TIMING: Camera stays static during the pour, brim fill, and ledge pooling (0.0s - 3.2s, Frames 1-3). The smooth vertical pan-down initiates at 3.3s only as coffee spills over the 90° chamfered stone edge (Frame 4), smoothly tracking the cascading dark liquid ribbons down the vertical white marble face (Frames 5-8), decelerating and settling into the upper-right corner as the canvas reaches pure white (Frame 9).",
    framerate: "120fps high-speed capture (conforming to 24fps for ultra-luxurious, viscous fluid velocity)",
  },
  lightingSetup: {
    keyLight: "Large 120cm diffused softbox from upper-left providing soft, high-end commercial daylight",
    fillLight: "Subtle white bounce board from right to keep clean soft shadows behind the cascading drips",
    ambient: "Transitions from soft warm studio ambient (Frames 1-4) to high-key luminous pure white (Frames 5-9)",
    temperature: "5200K daylight with warm 3400K golden amber highlights in the aerated coffee crema",
    volumetric: "Delicate translucent wisps of rising steam caught against the dark studio backdrop early in the pour",
  },
  environmentAesthetics: {
    plinthSurface: "Architectural white marble/stone plinth with smooth horizontal ledge and vertical stone face",
    backdrop: "Starts as deep espresso brown studio backdrop, transitioning through marble into 100% pure white (#ffffff)",
    teapot: "Handcrafted off-white / cream ceramic teapot with elegant curved handle and slender pouring spout",
    cup: "Artisan textured white/cream ceramic coffee cup with organic handle and thick ceramic rim",
    colorPalette: ["#ffffff", "#fbfaf8", "#e8e3dc", "#c87a3e", "#5a3418", "#1c110a"],
    websiteTransition: "Frame 9 terminates on a 100% solid white canvas (#ffffff) with thick coffee dripping in the top right corner, perfectly blending into the portfolio website without any seam or background jump.",
  },
  masterPromptText:
    "Cinematic 8k macro slow-motion video, 120fps, shot on Cooke 85mm anamorphic macro lens at f/2.0. High-end Scandinavian luxury studio. An artisan off-white ceramic teapot pours a continuous steaming stream of rich dark espresso into a matching cream ceramic cup resting on an architectural white stone plinth. In the first phase, the camera is locked static at eye level. The cup fills to the brim, forming a thick, glossy convex dome of aerated golden-caramel crema with micro-bubbles. As the pour continues, the thick crema overflows the ceramic rim, pooling on the horizontal white stone ledge. At 3.3 seconds, as the coffee flows over the 90-degree chamfered edge and cascades down the vertical white marble face, the camera begins a smooth, deliberate pan-down and slight tilt. The camera tracks the viscous coffee ribbons as they stretch down the white stone in organic dripping streams. The scene progressively brightens into luminous high-key studio light, diffusing the marble into pure white. The camera settles on a final composition where the entire background is completely solid pure white (hex #ffffff), with thick, frothy, glossy caramel coffee dripping down organically in the top right corner with natural rounded teardrop tips and soft subtle warm contact shadows. Ultra-realistic fluid dynamics, glossy specular highlights, zero camera jitter, commercial grade cinematography.",
  keyframes: [
    {
      number: 1,
      timecode: "0.0s — 1.5s",
      phase: "Phase 1: Initial Teapot Pour",
      description:
        "Off-white ceramic teapot pours a continuous steaming stream of amber coffee into the cream ceramic cup on the white stone ledge. Camera locked at eye-level.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame1_user.jpg`,
      isUserReference: true,
    },
    {
      number: 2,
      timecode: "1.5s — 2.8s",
      phase: "Phase 2: Filled to the Brim",
      description:
        "Continuous pour fills cup to the absolute rim, creating a thick, convex dome of aerated golden crema with micro-bubbles. Camera remains static.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame2_user.jpg`,
      isUserReference: true,
    },
    {
      number: 3,
      timecode: "2.8s — 3.5s",
      phase: "Phase 3: Overflow on Stone Ledge",
      description:
        "Crema breaks surface tension, overflowing down the curved ceramic cup and pooling across the horizontal white stone surface.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame3_user.jpg`,
      isUserReference: true,
    },
    {
      number: 4,
      timecode: "3.5s — 4.3s",
      phase: "Phase 4: Pan-Down & Marble Cascade",
      description:
        "Camera initiates smooth pan-down as coffee pours over the 90° chamfered edge, cascading down the vertical white marble wall in thick dripping streams.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame4_user.jpg`,
      isUserReference: true,
    },
    {
      number: 5,
      timecode: "4.3s — 5.0s",
      phase: "Phase 5: Deepening Cascade",
      description:
        "Camera pans down further; top ledge slides out of frame. Viscous caramel crema ribbons stretch downward along the vertical white marble face.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame5_pandown.jpg`,
      isUserReference: false,
    },
    {
      number: 6,
      timecode: "5.0s — 5.8s",
      phase: "Phase 6: Vertical Tracking & Studio Glow",
      description:
        "Camera tracks the descending droplet fronts. Studio daylight intensifies, lifting the marble background to a clean high-key tone.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame6_pandown.jpg`,
      isUserReference: false,
    },
    {
      number: 7,
      timecode: "5.8s — 6.5s",
      phase: "Phase 7: Rightward Drift & Deceleration",
      description:
        "Streams begin to decelerate, drifting toward the upper-right quadrant. Droplets form suspended teardrop beads held by surface tension as marble diffuses to 65% white.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame7_pandown.jpg`,
      isUserReference: false,
    },
    {
      number: 8,
      timecode: "6.5s — 7.2s",
      phase: "Phase 8: High-Key Luminous Settling",
      description:
        "The background reaches 88% pure white with soft ambient contact shading. Viscous crema streams settle comfortably in the upper-right area.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame8_pandown.jpg`,
      isUserReference: false,
    },
    {
      number: 9,
      timecode: "7.2s — 8.0s",
      phase: "Phase 9: Seamless Pure White Horizon",
      description:
        "Completely solid pure white canvas (#ffffff) with thick, frothy coffee dripping in the top right corner. Rounded teardrop tips merge seamlessly with the website below.",
      imageUrl: `${import.meta.env.BASE_URL}designs/frame9_pandown.jpg`,
      isUserReference: false,
    },
  ],
  suggestedTools: [
    "Runway Gen-3 Alpha (Image-to-Video with Keyframe Control: Frame 1 → Frame 4 → Frame 9)",
    "Kling AI 1.5 / 2.0 (High-speed 120fps macro fluid simulation)",
    "Luma Dream Machine (Multi-keyframe interpolation)",
    "OpenAI Sora (Prompt-guided cinematic fluid dynamics)",
  ],
};
