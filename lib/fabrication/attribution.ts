export const SCADQR_PROJECT_URL = "https://github.com/xypwn/scadqr";
export const SCADQR_COMMIT = "a27e1feeed8b048b730fcd2620c0021b3b52a283";

export const SCADQR_MIT_LICENSE = `MIT License

Copyright (c) 2024 Darwin Schuppan and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export function fabricationModifications(parametersSummary: string) {
  return `# PawStory fabrication modifications

This package adapts the structural ideas demonstrated by scadqr demo_tag.scad:
a rounded baseplate, attachment holes, and protected QR padding.

Upstream project: ${SCADQR_PROJECT_URL}
Pinned commit: ${SCADQR_COMMIT}
Author: Darwin Schuppan and contributors
License: MIT (see scadqr-MIT-LICENSE.txt)

PawStory implementation changes:
- Reimplemented the geometry in TypeScript/Three.js; no upstream SCAD source is bundled.
- Uses a rectangular two-hole plate and a separate laser panel.
- Uses one shared TagParameters model for preview and STL generation.
- Generates a layered SVG with an actual memory URL QR code and outline-only ASCII label.
- Adds project-created flexible-link reference geometry for visualization only.
- Parameters: ${parametersSummary}

Not validated for production wear: printer/material tolerances, laser settings, strength,
waterproofing, pet comfort, and garment fit all require physical prototyping.
No G-code, laser power, or speed settings are included.
`;
}
