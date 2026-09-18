import { Input } from "@/configurations/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/configurations/components/ui/select";
import type { EmailBlock, Alignment, ProductDisplayOptions } from '@/configurations/lib/email/builderTypes';
import { EmailEditor } from '../EmailEditor'; // TipTap wrapper
import { useProducts } from '@/configurations/lib/ProductContext';
import { CONDITION_FIELDS, CONDITION_OPERATORS } from '@/configurations/lib/email/conditions';
import type { ConditionField, ConditionOperator } from '@/configurations/lib/email/conditions';
import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface EmailBlockPropertiesProps {
  block: EmailBlock;
  onChange: (block: EmailBlock) => void;
}

export function EmailBlockProperties({ block, onChange }: EmailBlockPropertiesProps) {
  const updateProperty = (key: string, value: any) => {
    onChange({
      ...block,
      properties: {
        ...block.properties,
        [key]: value
      }
    } as EmailBlock);
  };

  const renderAlignmentControl = (current: string) => (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none mb-2 block">Alignment</label>
      <Select value={current} onValueChange={(v) => updateProperty('align', v as Alignment)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
          <SelectItem value="right">Right</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderProductDisplayOptions = (props: ProductDisplayOptions) => (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-foreground">Display Settings</h4>
      <div className="grid grid-cols-2 gap-3">
        {(['showImage', 'showTitle', 'showPrice', 'showCompareAtPrice', 'showDiscount', 'showDescription', 'showRating'] as const).map(key => (
          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={props[key]}
              onChange={e => updateProperty(key, e.target.checked)}
              className="accent-primary"
            />
            {key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none mb-2 block">CTA Button Label</label>
        <Input 
          value={props.ctaLabel} 
          onChange={e => updateProperty('ctaLabel', e.target.value)} 
        />
      </div>
    </div>
  );

  const { products } = useProducts();
  const [productSearch, setProductSearch] = useState('');

  const renderProductPicker = (selectedIds: string[], onSelect: (id: string) => void, onRemove: (id: string) => void, maxSelect = 100) => {
    const selectedProducts = selectedIds.map(id => products.find(p => p.id === id)).filter(Boolean);
    const searchResults = productSearch ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && !selectedIds.includes(p.id)) : [];

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-foreground">Selected Products</h4>
        
        {selectedProducts.length > 0 ? (
          <div className="space-y-2 border rounded p-2">
            {selectedProducts.map((p, i) => (
              <div key={p!.id} className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                  <div className="w-8 h-8 rounded bg-background border overflow-hidden shrink-0">
                    {p!.featuredImage && <img src={p!.featuredImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="truncate">{p!.name}</span>
                </div>
                <button type="button" onClick={() => onRemove(p!.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No products selected.</p>
        )}

        {selectedIds.length < maxSelect && (
          <div className="space-y-2 relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input 
                placeholder="Search products to add..." 
                className="pl-8"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
              />
            </div>
            
            {productSearch && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border shadow-md rounded-md max-h-[200px] overflow-y-auto">
                {searchResults.map(p => (
                  <button 
                    key={p.id}
                    type="button"
                    className="w-full text-left p-2 text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => {
                      onSelect(p.id);
                      setProductSearch('');
                    }}
                  >
                    <div className="w-6 h-6 rounded bg-background border overflow-hidden shrink-0">
                      {p.featuredImage && <img src={p.featuredImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            {productSearch && searchResults.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border shadow-md rounded-md p-3 text-center text-sm text-muted-foreground">
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderConditionEditor = () => {
    const condition = block.condition;
    const hasCondition = !!condition;

    return (
      <div className="p-4 space-y-4 bg-muted/10 border-t">
        <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-2">Display Conditions</h3>
        <label className="flex items-center gap-2 text-sm cursor-pointer mb-4">
          <input 
            type="checkbox" 
            checked={hasCondition}
            onChange={e => {
              if (e.target.checked) {
                onChange({ ...block, condition: { field: 'segment', operator: 'equals', value: '' } });
              } else {
                const newBlock = { ...block };
                delete newBlock.condition;
                onChange(newBlock);
              }
            }}
            className="accent-primary"
          />
          Only show when...
        </label>

        {hasCondition && (
          <div className="space-y-4 border-l-2 border-primary pl-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Field</label>
              <Select 
                value={condition.field} 
                onValueChange={v => onChange({ ...block, condition: { ...condition, field: v as ConditionField } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONDITION_FIELDS.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Operator</label>
              <Select 
                value={condition.operator} 
                onValueChange={v => onChange({ ...block, condition: { ...condition, operator: v as ConditionOperator } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONDITION_OPERATORS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!['exists', 'notExists'].includes(condition.operator) && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Value</label>
                <Input 
                  value={condition.value || ''} 
                  onChange={e => onChange({ ...block, condition: { ...condition, value: e.target.value } })}
                  placeholder="e.g. VIP, Delhi, 100"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBlockSpecificProperties = () => {
    switch (block.type) {
    case 'text':
      return (
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-4">Text Properties</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Content</label>
            <div className="bg-background border rounded">
              {/* Reuse TipTap for rich text editing inside the block properties */}
              <EmailEditor 
                value={block.properties.content}
                onChange={(val) => updateProperty('content', val)}
              />
            </div>
          </div>
          {renderAlignmentControl(block.properties.align)}
        </div>
      );

    case 'heading':
      return (
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-4">Heading Properties</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Text</label>
            <Input 
              value={block.properties.text} 
              onChange={e => updateProperty('text', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Heading Level</label>
            <Select 
              value={block.properties.level.toString()} 
              onValueChange={v => updateProperty('level', parseInt(v))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Heading 1 (H1)</SelectItem>
                <SelectItem value="2">Heading 2 (H2)</SelectItem>
                <SelectItem value="3">Heading 3 (H3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderAlignmentControl(block.properties.align)}
        </div>
      );

    case 'image':
      return (
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-4">Image Properties</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Image URL</label>
            <Input 
              type="url"
              value={block.properties.url} 
              onChange={e => updateProperty('url', e.target.value)} 
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Alt Text</label>
            <Input 
              value={block.properties.altText} 
              onChange={e => updateProperty('altText', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Link URL (Optional)</label>
            <Input 
              type="url"
              value={block.properties.linkUrl} 
              onChange={e => updateProperty('linkUrl', e.target.value)} 
            />
          </div>
          {renderAlignmentControl(block.properties.align)}
        </div>
      );

    case 'button':
      return (
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-4">Button Properties</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Label</label>
            <Input 
              value={block.properties.label} 
              onChange={e => updateProperty('label', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Link URL</label>
            <Input 
              type="url"
              value={block.properties.linkUrl} 
              onChange={e => updateProperty('linkUrl', e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none mb-2 block">Background Color</label>
              <Input 
                type="color"
                className="h-10 p-1"
                value={block.properties.backgroundColor} 
                onChange={e => updateProperty('backgroundColor', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none mb-2 block">Text Color</label>
              <Input 
                type="color"
                className="h-10 p-1"
                value={block.properties.textColor} 
                onChange={e => updateProperty('textColor', e.target.value)} 
              />
            </div>
          </div>
          {renderAlignmentControl(block.properties.align)}
        </div>
      );

    case 'divider':
      return (
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-4">Divider Properties</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Thickness (px)</label>
            <Input 
              type="number" min="1" max="20"
              value={block.properties.thickness} 
              onChange={e => updateProperty('thickness', parseInt(e.target.value) || 1)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Vertical Spacing (px)</label>
            <Input 
              type="number" min="0" max="100"
              value={block.properties.spacing} 
              onChange={e => updateProperty('spacing', parseInt(e.target.value) || 0)} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Color</label>
            <Input 
              type="color"
              className="h-10 p-1"
              value={block.properties.color} 
              onChange={e => updateProperty('color', e.target.value)} 
            />
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-4">Spacer Properties</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Height (px)</label>
            <Input 
              type="number" min="10" max="200"
              value={block.properties.height} 
              onChange={e => updateProperty('height', parseInt(e.target.value) || 10)} 
            />
          </div>
        </div>
      );

    case 'product':
      return (
        <div className="p-4 space-y-6">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-2">Product Block</h3>
          
          {renderProductPicker(
            block.properties.productId ? [block.properties.productId] : [],
            (id) => updateProperty('productId', id),
            () => updateProperty('productId', ''),
            1
          )}

          <hr />
          {renderProductDisplayOptions(block.properties)}
          <hr />
          {renderAlignmentControl(block.properties.align)}
        </div>
      );

    case 'productGrid':
      return (
        <div className="p-4 space-y-6">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-2">Product Grid Block</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">Grid Columns</label>
            <Select 
              value={block.properties.columns.toString()} 
              onValueChange={v => updateProperty('columns', parseInt(v))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <hr />

          {renderProductPicker(
            block.properties.productIds,
            (id) => updateProperty('productIds', [...block.properties.productIds, id]),
            (id) => updateProperty('productIds', block.properties.productIds.filter((p: string) => p !== id)),
            12
          )}

          <hr />
          {renderProductDisplayOptions(block.properties)}
        </div>
      );

    case 'productListing':
      return (
        <div className="p-4 space-y-6">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-2">Product Listing Block</h3>
          
          {renderProductPicker(
            block.properties.productIds,
            (id) => updateProperty('productIds', [...block.properties.productIds, id]),
            (id) => updateProperty('productIds', block.properties.productIds.filter((p: string) => p !== id)),
            12
          )}

          <hr />
          {renderProductDisplayOptions(block.properties)}
        </div>
      );

      default:
        return (
          <div className="p-4 text-muted-foreground">
            Properties for this block type are not implemented yet.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {renderBlockSpecificProperties()}
      {renderConditionEditor()}
    </div>
  );
}
