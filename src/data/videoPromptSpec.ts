export interface VideoKeyframe {
  number: number;
  timecode: string;
  phase: string;
  description: string;
  imageUrl: string;
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
  id: "espresso-white-stone-pour-v2",
  title: "Hero Section: Teapot Pour, Surface Tension & White Stone Cascade",
  concept:
    "A photorealistic macro slow-motion sequence: an elegant matte dark gooseneck kettle pours steaming dark coffee into an artisan white ceramic cup resting on an architectural fluted white travertine stone plinth. The camera remains static at eye-level as the coffee fills to the brim and reaches a surface tension dome. The camera pan-down begins ONLY when the coffee breaks surface tension and starts flowing down the white stone ridges, smoothly tracking the liquid as it cascades toward a seamless pure white background.",
  cameraSetup: {
    lens: "Cooke Anamorphic /i Full Frame Plus 85mm Prime or ARRI Signature Prime 75mm",
    focalLength: "85mm Macro",
    aperture: "f/2.0 (crisp razor focus on cup rim and liquid meniscus, buttery soft studio falloff)",
    angle: "Starts at eye-level macro close-up (10° slight elevated angle) locked on the cup and kettle spout",
    panDownMotion:
      "CRITICAL: Camera remains completely static during the pour and fill (0.0s - 3.0s). The pan-down and gentle tilt-down initiates ONLY at 3.2s when the coffee overflows and starts flowing down the fluted white stone plinth, smoothly tracking the cascading dark liquid ribbons down toward the bottom of the frame into a clean white floor.",
    framerate: "120fps high-speed capture (conforming to 24fps for ultra-luxurious, viscous fluid velocity)",
  },
  lightingSetup: {
    keyLight: "Large 120cm diffused softbox from upper-left mimicking natural high-key Scandinavian morning daylight",
    fillLight: "Subtle white bounce board from right to keep clean architectural shadows on the fluted stone ridges",
    ambient: "High-key luminous white ambient environment (+1 EV), clean and pristine",
    temperature: "5200K pure daylight with warm 3400K golden highlights inside the liquid coffee crema",
    volumetric: "Delicate, translucent wisps of rising steam caught against the bright background",
  },
  environmentAesthetics: {
    plinthSurface: "Architectural fluted white travertine stone plinth with clean, carved vertical ridges and tactile mineral texture",
    backdrop: "Minimalist, luminous pure white Scandinavian architectural studio space, softly out-of-focus",
    teapot: "Minimalist designer matte black gooseneck kettle (Fellow Stagg aesthetic) with a slender arched spout",
    cup: "Hand-thrown artisan white ceramic coffee cup with a delicate textured glaze and organic round handle",
    colorPalette: ["#ffffff", "#fbfaf8", "#e8e3dc", "#c87a3e", "#24160e", "#1b1009"],
    websiteTransition: "Seamlessly blends into pure white (#ffffff / #fbfaf8) as the camera reaches the bottom of the stone plinth, allowing uninterrupted continuation of website typography and components.",
  },
  masterPromptText:
    "Cinematic 8k macro slow-motion video, 120fps. High-key minimalist Scandinavian studio with pristine bright white daylight. In the center, a handcrafted white ceramic coffee cup rests upon an architectural fluted matte white travertine stone plinth. Shot on 85mm anamorphic prime lens at f/2.0. In the upper frame, an elegant minimalist matte black gooseneck kettle pours a continuous steaming stream of rich dark amber coffee into the cup. The camera is locked static at eye level. The cup fills completely to the brim, forming a gleaming convex surface tension meniscus of golden tiger-striped crema. At 3 seconds, the surface tension breaks and thick, glossy, dark coffee overflows over the curved ceramic lip in smooth viscous ribbons. EXACTLY as the coffee starts flowing down the vertical fluted ridges of the white stone plinth, the camera begins a smooth, deliberate pan-down and slight tilt-down, tracking the rich dark coffee ribbons as they cascade down the fluted white stone grooves toward the bottom edge into a luminous, seamless pure white floor. Ultra-sharp textural detail on the carved white stone, rich liquid viscosity, zero camera jitter, high-end commercial cinematography.",
  keyframes: [
    {
      number: 1,
      timecode: "0.0s — 1.5s",
      phase: "Phase 1: The Teapot Pour",
      description:
        "Matte dark gooseneck kettle pouring a smooth, steaming stream of dark amber coffee into the white ceramic cup on the fluted white stone plinth. Camera static at eye level.",
      imageUrl: `${import.meta.env.BASE_URL}designs/pour-frame-1-pour.jpg`,
    },
    {
      number: 2,
      timecode: "1.5s — 2.8s",
      phase: "Phase 2: Filled to the Brim",
      description:
        "The coffee has filled to the absolute brim, creating a tense, curved liquid surface tension dome with golden crema micro-bubbles. Kettle finishes pour. Camera remains locked.",
      imageUrl: `${import.meta.env.BASE_URL}designs/pour-frame-2-brim.jpg`,
    },
    {
      number: 3,
      timecode: "2.8s — 3.5s",
      phase: "Phase 3: The Overflow Begins",
      description:
        "Surface tension breaks. Rich coffee spills over the ceramic rim, running down the cup sides and pooling on the top of the white stone plinth right as it meets the ridges.",
      imageUrl: `${import.meta.env.BASE_URL}designs/pour-frame-3-overflow.jpg`,
    },
    {
      number: 4,
      timecode: "3.5s — 5.0s",
      phase: "Phase 4: Pan Down & White Stone Cascade",
      description:
        "Camera pans down smoothly, tracking the dark coffee cascading down the vertical fluted grooves of the white stone plinth into a seamless, pure white background for the rest of the website.",
      imageUrl: `${import.meta.env.BASE_URL}designs/pour-frame-4-pandown.jpg`,
    },
  ],
  suggestedTools: [
    "Runway Gen-3 Alpha (Image-to-Video with Camera Control: Pan Down / Tilt Down)",
    "Kling AI 1.5 / 2.0 (Image-to-Video with Prompt Guidance)",
    "Luma Dream Machine (Keyframe interpolation using Frame 1 → Frame 2 → Frame 3 → Frame 4)",
    "OpenAI Sora",
  ],
};
