import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Filter, Save } from 'lucide-react';
import type { EmailBlock, ProductDisplayOptions } from '@/configurations/lib/email/builderTypes';
import { useProducts } from '@/configurations/lib/ProductContext';
import type { Product } from '@/configurations/lib/types';

function SortableBlockItem({ 
  block, 
  isSelected, 
  onSelect, 
  onDelete,
  onSave
}: { 
  block: EmailBlock; 
  isSelected: boolean; 
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const alignClass = {
    left: 'text-left justify-start',
    center: 'text-center justify-center mx-auto',
    right: 'text-right justify-end ml-auto'
  }[('align' in block.properties ? block.properties.align : '') || 'left'];

  const { products } = useProducts();

  const renderProductCard = (p: Product, options: ProductDisplayOptions) => {
    // Determine the price to show from variants/offers
    const activePrice = p.offers?.[0]?.price || p.variants?.[0]?.price || 0;
    const comparePrice = p.offers?.[0]?.originalPrice || null;

    return (
      <div key={p.id} className="flex flex-col gap-3 bg-card border rounded p-4 h-full">
        {options.showImage && p.featuredImage && (
          <div className="aspect-square bg-muted rounded overflow-hidden">
            <img src={p.featuredImage} alt={p.name} className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex flex-col flex-1 space-y-2">
          {options.showTitle && (
            <h4 className="font-semibold text-foreground text-sm line-clamp-2">{p.name}</h4>
          )}
          
          {options.showRating && p.rating > 0 && (
            <div className="flex items-center text-yellow-400 text-xs">
              {'★'.repeat(Math.round(p.rating))}
              {'☆'.repeat(5 - Math.round(p.rating))}
            </div>
          )}
          
          <div className="flex items-baseline gap-2">
            {options.showPrice && (
              <span className="font-bold text-lg">${activePrice.toFixed(2)}</span>
            )}
            {options.showCompareAtPrice && comparePrice && (
              <span className="text-muted-foreground line-through text-sm">${comparePrice.toFixed(2)}</span>
            )}
            {options.showDiscount && comparePrice && comparePrice > activePrice && (
              <span className="text-green-600 text-xs font-semibold">
                {Math.round(((comparePrice - activePrice) / comparePrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          {options.showDescription && p.shortDescription && (
            <p className="text-muted-foreground text-xs line-clamp-2">{p.shortDescription}</p>
          )}
          
          <div className="mt-auto pt-4">
            <button className="w-full py-2 px-4 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-primary/90">
              {options.ctaLabel || 'Shop Now'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: block.properties.content }} />
        );
      case 'heading':
        const H = `h${block.properties.level}` as any;
        return (
          <H className={`font-bold ${block.properties.level === 1 ? 'text-2xl' : block.properties.level === 2 ? 'text-xl' : 'text-lg'} ${alignClass}`}>
            {block.properties.text}
          </H>
        );
      case 'image':
        return block.properties.url ? (
          <div className={`flex ${alignClass}`}>
            <img src={block.properties.url} alt={block.properties.altText} className="max-w-full h-auto" />
          </div>
        ) : (
          <div className="bg-muted w-full h-32 flex items-center justify-center text-muted-foreground border border-dashed rounded">
            Image Placeholder
          </div>
        );
      case 'button':
        return (
          <div className={`flex ${alignClass}`}>
            <a 
              href={block.properties.linkUrl || '#'} 
              className="inline-block px-4 py-2 rounded font-medium"
              style={{ backgroundColor: block.properties.backgroundColor, color: block.properties.textColor }}
              onClick={e => e.preventDefault()}
            >
              {block.properties.label}
            </a>
          </div>
        );
      case 'divider':
        return (
          <div style={{ padding: `${block.properties.spacing}px 0` }}>
            <div style={{ height: `${block.properties.thickness}px`, backgroundColor: block.properties.color }} />
          </div>
        );
      case 'spacer':
        return <div style={{ height: `${block.properties.height}px` }} />;
      
      case 'product': {
        const prod = products.find(p => p.id === block.properties.productId);
        if (!prod) return <div className="p-8 text-center text-muted-foreground border border-dashed bg-muted/50 rounded">Select a product to display</div>;
        return (
          <div className={`flex ${alignClass} w-full`}>
            <div className="max-w-sm w-full">
              {renderProductCard(prod, block.properties)}
            </div>
          </div>
        );
      }

      case 'productGrid': {
        const gridProducts = block.properties.productIds.map((id: string) => products.find((p: Product) => p.id === id)).filter(Boolean) as Product[];
        if (gridProducts.length === 0) return <div className="p-8 text-center text-muted-foreground border border-dashed bg-muted/50 rounded">Select products for the grid</div>;
        
        return (
          <div 
            className="grid gap-4 w-full"
            style={{ gridTemplateColumns: `repeat(${block.properties.columns}, minmax(0, 1fr))` }}
          >
            {gridProducts.map(prod => renderProductCard(prod, block.properties))}
          </div>
        );
      }

      case 'productListing': {
        const listProducts = block.properties.productIds.map((id: string) => products.find((p: Product) => p.id === id)).filter(Boolean) as Product[];
        if (listProducts.length === 0) return <div className="p-8 text-center text-muted-foreground border border-dashed bg-muted/50 rounded">Select products for the listing</div>;
        
        return (
          <div className="flex flex-col gap-4 w-full">
            {listProducts.map(prod => (
              <div key={prod.id} className="w-full">
                {renderProductCard(prod, block.properties)}
              </div>
            ))}
          </div>
        );
      }

      default:
        return <div>Unknown Block</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group mb-1 bg-white border-2 rounded ${
        isSelected ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onSelect(block.id)}
    >
      {/* Editor Controls Overlay */}
      <div className={`absolute -top-3 -right-3 flex items-center bg-background border shadow-sm rounded-md overflow-hidden z-20 ${isSelected || 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
        <div 
          className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <button 
          className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          title="Save as Block"
          onClick={(e) => {
            e.stopPropagation();
            onSave(block.id);
          }}
        >
          <Save className="w-4 h-4" />
        </button>
        <button 
          className="p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
          title="Delete Block"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {block.condition && (
        <div className="absolute -top-3 left-4 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm shadow-sm z-20 pointer-events-none">
          <Filter className="w-3 h-3" /> Conditional
        </div>
      )}

      <div className="p-4 cursor-default">
        {renderContent()}
      </div>
    </div>
  );
}

export function EmailBuilderCanvas({ 
  blocks, 
  selectedBlockId, 
  onSelect,
  onDelete,
  onSaveBlock
}: { 
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveBlock: (id: string) => void;
}) {
  return (
    <div className="flex flex-col min-h-full py-4 px-2">
      {blocks.map(block => (
        <SortableBlockItem 
          key={block.id} 
          block={block} 
          isSelected={block.id === selectedBlockId}
          onSelect={onSelect}
          onDelete={onDelete}
          onSave={onSaveBlock}
        />
      ))}
    </div>
  );
}
