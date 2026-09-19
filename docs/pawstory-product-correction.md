# PawStory 爪爪奇遇 — product correction

Reframed the product around a desktop pet avatar, detachable raincoat / birthday hat / snack accessories, and video memories. Added /studio and /awaken/demo; /make routes now lead to the studio, and the existing tag fabrication tool is retained at /fabrication/[id]. Existing /m/demo content is unchanged.

MakerMuse is an external link (https://www.makermuse.ai/), not an integrated API. Local GLB imports are preview-only and do not automatically fit accessories. Demo pet geometry is created in this project. Accessory links are browser-local configuration pointing to published cloud memories; downloaded QR codes work independently of that local configuration. No cloud model storage, AI generation or physical fit validation is claimed.

Removed public model-source navigation and explanatory cards at the user's request. Source attribution and licenses remain in lib/fabrication/attribution.ts and fabrication ZIP artifacts.

Validation: TypeScript and production build passed. Existing demo QR decoded and fabrication geometry/SVG checks passed. Local homepage returned HTTP 200 with the new brand. Browser automation was interrupted by the computer-use service; full visual/mobile interaction verification remains unperformed.
