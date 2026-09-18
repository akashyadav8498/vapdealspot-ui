import type { EmailDocument, EmailBlock, ProductDisplayOptions } from './builderTypes';
import type { Product } from '../types';
import { resolvePersonalization } from './personalization';
import type { SampleCustomer } from './personalization';
import { evaluateCondition } from './conditions';

export function renderEmailDocumentToHtml(doc: EmailDocument, products: Product[] = [], sampleCustomer: SampleCustomer): string {
  if (!doc || !doc.blocks || doc.blocks.length === 0) return '';

  const renderProductCardHtml = (p: Product, options: ProductDisplayOptions): string => {
    const activePrice = p.offers?.[0]?.price || p.variants?.[0]?.price || 0;
    const comparePrice = p.offers?.[0]?.originalPrice || null;

    return `
      <div style="border: 1px solid #e5e5e5; border-radius: 6px; padding: 16px; margin-bottom: 16px; background-color: #ffffff; text-align: center; font-family: sans-serif;">
        ${options.showImage && p.featuredImage ? `<img src="${p.featuredImage}" alt="${p.name}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 12px;" />` : ''}
        ${options.showTitle ? `<h4 style="margin: 0 0 8px 0; font-size: 16px; color: #111827;">${p.name}</h4>` : ''}
        
        <div style="margin-bottom: 12px;">
          ${options.showPrice ? `<span style="font-weight: bold; font-size: 18px; color: #111827;">$${activePrice.toFixed(2)}</span>` : ''}
          ${options.showCompareAtPrice && comparePrice ? `<span style="text-decoration: line-through; color: #6b7280; font-size: 14px; margin-left: 8px;">$${comparePrice.toFixed(2)}</span>` : ''}
        </div>

        ${options.showDescription && p.shortDescription ? `<p style="color: #4b5563; font-size: 14px; line-height: 1.4; margin: 0 0 16px 0;">${p.shortDescription}</p>` : ''}

        <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px;">
          ${options.ctaLabel || 'Shop Now'}
        </a>
      </div>
    `;
  };

  const renderBlock = (block: EmailBlock): string => {
    // If a condition exists, evaluate it. If false, return empty string.
    if (!evaluateCondition(block.condition, sampleCustomer)) {
      return '';
    }

    const alignStyle = ('align' in block.properties && block.properties.align) 
      ? `text-align: ${block.properties.align};` 
      : '';

    switch (block.type) {
      case 'text':
        const textContent = resolvePersonalization(block.properties.content, sampleCustomer);
        return `<div style="${alignStyle} font-size: ${block.properties.fontSize};">${textContent}</div>`;
      case 'heading':
        const H = `h${block.properties.level}`;
        const headingText = resolvePersonalization(block.properties.text, sampleCustomer);
        return `<${H} style="${alignStyle} margin-top: 0; margin-bottom: 16px;">${headingText}</${H}>`;
      case 'image':
        if (!block.properties.url) return '';
        const imgHtml = `<img src="${block.properties.url}" alt="${block.properties.altText || ''}" style="max-width: 100%; height: auto; display: inline-block;" />`;
        return `<div style="${alignStyle}">${block.properties.linkUrl ? `<a href="${block.properties.linkUrl}">${imgHtml}</a>` : imgHtml}</div>`;
      case 'button':
        return `<div style="${alignStyle} padding: 10px 0;"><a href="${block.properties.linkUrl || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${block.properties.backgroundColor}; color: ${block.properties.textColor}; text-decoration: none; border-radius: 4px; font-weight: bold;">${block.properties.label}</a></div>`;
      case 'divider':
        return `<div style="padding: ${block.properties.spacing}px 0;"><div style="height: ${block.properties.thickness}px; background-color: ${block.properties.color};"></div></div>`;
      case 'spacer':
        return `<div style="height: ${block.properties.height}px;"></div>`;
      case 'product': {
        const p = products.find(prod => prod.id === block.properties.productId);
        if (!p) return '';
        return `<div style="${alignStyle} max-width: 320px; margin: 0 auto;">${renderProductCardHtml(p, block.properties)}</div>`;
      }
      case 'productGrid': {
        const pList = block.properties.productIds.map(id => products.find(prod => prod.id === id)).filter(Boolean) as Product[];
        if (pList.length === 0) return '';
        
        const colsHtml = pList.map(p => `
          <td style="width: ${100 / block.properties.columns}%; vertical-align: top; padding: 0 8px;">
            ${renderProductCardHtml(p, block.properties)}
          </td>
        `).join('');

        return `
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 0 -8px;">
            <tr>${colsHtml}</tr>
          </table>
        `;
      }
      case 'productListing': {
        const pList = block.properties.productIds.map(id => products.find(prod => prod.id === id)).filter(Boolean) as Product[];
        if (pList.length === 0) return '';
        
        return pList.map(p => renderProductCardHtml(p, block.properties)).join('');
      }
      default:
        return '';
    }
  };

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif; color: #333333; line-height: 1.5;">
      ${doc.blocks.map(renderBlock).join('\n')}
    </div>
  `;
}
