// Basic alignment & typography
import type { BlockCondition } from './conditions';

export type Alignment = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold';
export type FontStyle = 'normal' | 'italic';
export type EmailBlockType = 'text' | 'image' | 'button' | 'spacer' | 'divider' | 'heading' | 'product' | 'productGrid' | 'productListing';

// 1. Text Block
export interface TextBlockProperties {
  content: string; // HTML from TipTap
  align: Alignment;
  fontSize: string;
}

export interface EmailTextBlock {
  type: 'text';
  id: string;
  properties: TextBlockProperties;
}

// 2. Heading Block
export interface HeadingBlockProperties {
  text: string;
  level: 1 | 2 | 3;
  align: Alignment;
}

export interface EmailHeadingBlock {
  type: 'heading';
  id: string;
  properties: HeadingBlockProperties;
}

// 3. Image Block
export interface ImageBlockProperties {
  url: string;
  altText: string;
  linkUrl: string;
  align: Alignment;
}

export interface EmailImageBlock {
  type: 'image';
  id: string;
  properties: ImageBlockProperties;
}

// 4. Button Block
export interface ButtonBlockProperties {
  label: string;
  linkUrl: string;
  align: Alignment;
  backgroundColor: string;
  textColor: string;
}

export interface EmailButtonBlock {
  type: 'button';
  id: string;
  properties: ButtonBlockProperties;
}

// 5. Divider Block
export interface DividerBlockProperties {
  thickness: number;
  spacing: number;
  color: string;
}

export interface EmailDividerBlock {
  type: 'divider';
  id: string;
  properties: DividerBlockProperties;
}

// 6. Spacer Block
export interface SpacerBlockProperties {
  height: number;
}

export interface EmailSpacerBlock {
  type: 'spacer';
  id: string;
  properties: SpacerBlockProperties;
}

// 7. Product Block (Single Product)
export interface ProductDisplayOptions {
  showImage: boolean;
  showTitle: boolean;
  showPrice: boolean;
  showCompareAtPrice: boolean;
  showDiscount: boolean;
  showDescription: boolean;
  showRating: boolean;
  ctaLabel: string;
}

export interface ProductBlockProperties extends ProductDisplayOptions {
  productId: string;
  align: Alignment;
}

export interface EmailProductBlock {
  type: 'product';
  id: string;
  properties: ProductBlockProperties;
}

// 8. Product Grid Block
export interface ProductGridBlockProperties extends ProductDisplayOptions {
  productIds: string[];
  columns: 2 | 3;
}

export interface EmailProductGridBlock {
  type: 'productGrid';
  id: string;
  properties: ProductGridBlockProperties;
}

// 9. Product Listing Block
export interface ProductListingBlockProperties extends ProductDisplayOptions {
  productIds: string[];
}

export interface EmailProductListingBlock {
  type: 'productListing';
  id: string;
  properties: ProductListingBlockProperties;
}

// The union of all block types
export type EmailBlock = (
  | EmailTextBlock
  | EmailImageBlock
  | EmailButtonBlock
  | EmailSpacerBlock
  | EmailDividerBlock
  | EmailHeadingBlock
  | EmailProductBlock
  | EmailProductGridBlock
  | EmailProductListingBlock
) & {
  condition?: BlockCondition;
};

// The document model
export interface EmailDocument {
  version: number;
  blocks: EmailBlock[];
}
