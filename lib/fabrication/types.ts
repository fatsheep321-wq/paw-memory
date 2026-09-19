export type TagParameters = {
  width: number;
  height: number;
  thickness: number;
  panelThickness: number;
  cornerRadius: number;
  holeDiameter: number;
  holeInset: number;
  qrSize: number;
  qrQuietModules: number;
};

export const DEFAULT_TAG_PARAMETERS: Readonly<TagParameters> = {
  width: 60,
  height: 42,
  thickness: 3,
  panelThickness: 1.2,
  cornerRadius: 4,
  holeDiameter: 4,
  holeInset: 6,
  qrSize: 26,
  qrQuietModules: 4,
};

export const TAG_PARAMETER_LIMITS = {
  width: { min: 50, max: 90, step: 1 },
  height: { min: 36, max: 65, step: 1 },
  thickness: { min: 2, max: 6, step: 0.5 },
} as const;

export type TagLayout = {
  holeCenters: readonly [readonly [number, number], readonly [number, number]];
  qr: { x: number; y: number; size: number };
};

export function normalizeTagParameters(input: TagParameters): TagParameters {
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const width = clamp(input.width, TAG_PARAMETER_LIMITS.width.min, TAG_PARAMETER_LIMITS.width.max);
  const height = clamp(input.height, TAG_PARAMETER_LIMITS.height.min, TAG_PARAMETER_LIMITS.height.max);
  const thickness = clamp(input.thickness, TAG_PARAMETER_LIMITS.thickness.min, TAG_PARAMETER_LIMITS.thickness.max);
  const cornerRadius = clamp(input.cornerRadius, 2, Math.min(width, height) / 4);
  const holeDiameter = clamp(input.holeDiameter, 3, 6);
  const holeInset = clamp(input.holeInset, holeDiameter / 2 + 2, Math.min(9, width / 4));
  const qrSize = Math.min(input.qrSize, height - 14, width - (holeInset + holeDiameter / 2 + 3) * 2);

  return {
    width,
    height,
    thickness,
    panelThickness: clamp(input.panelThickness, 0.8, 2),
    cornerRadius,
    holeDiameter,
    holeInset,
    qrSize,
    qrQuietModules: Math.max(4, Math.round(input.qrQuietModules)),
  };
}

export function getTagLayout(input: TagParameters): TagLayout {
  const parameters = normalizeTagParameters(input);
  const holeY = parameters.holeInset;
  return {
    holeCenters: [
      [parameters.holeInset, holeY],
      [parameters.width - parameters.holeInset, holeY],
    ],
    qr: {
      x: (parameters.width - parameters.qrSize) / 2,
      y: parameters.height - parameters.qrSize - 4,
      size: parameters.qrSize,
    },
  };
}

export function tagParametersEqual(a: TagParameters, b: TagParameters) {
  return (Object.keys(a) as (keyof TagParameters)[]).every((key) => a[key] === b[key]);
}
