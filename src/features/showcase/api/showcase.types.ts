import type { CutoutModelType, CutoutPalette } from '@/shared/ui';

export interface ShowcaseAngleView {
  readonly id: string;
  readonly label: string;
  readonly scaleClass: string;
  readonly mirror: boolean;
}

export interface ShowcaseVariant {
  readonly id: string;
  readonly name: string;
  readonly palette: CutoutPalette;
  readonly swatchClass: string;
  readonly stageRadialDarkClass: string;
  readonly stageRadialLightClass: string;
  readonly watermarkClass: string;
  readonly soldOutSizes: readonly string[];
}

export interface ShowcaseSizeOption {
  readonly label: string;
  readonly price: number;
  readonly rating: number;
  readonly reviews: number;
  readonly stock: number;
  readonly soldOut?: boolean;
}

export interface ShowcaseProduct {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly model: CutoutModelType;
  readonly sizeLabelHeader: string;
  readonly defaultVariantIndex: number;
  readonly variants: readonly ShowcaseVariant[];
  readonly sizes: readonly ShowcaseSizeOption[];
  readonly angles: readonly ShowcaseAngleView[];
  readonly sellerName: string;
  readonly campusHall: string;
  readonly conditionNote: string;
}
