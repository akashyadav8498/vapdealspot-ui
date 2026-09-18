import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Heading1, Image as ImageIcon, Link as LinkIcon, Minus, Square, ShoppingBag, LayoutGrid, List, Save, Trash2 } from 'lucide-react';
import { getSavedBlocks, deleteSavedBlock } from '@/configurations/lib/email/savedBlocksStore';
import type { SavedBlock } from '@/configurations/lib/email/savedBlocksStore';

function DraggableSidebarItem({ id, label, icon: Icon }: { id: string; label: string; icon: React.ElementType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${id}`,
    data: {
      type: 'sidebar-item',
      blockType: id
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 mb-2 bg-card border rounded-md cursor-grab active:cursor-grabbing hover:border-primary transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="bg-muted p-1.5 rounded text-muted-foreground">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function EmailBlockSidebar() {
  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Content Blocks
      </h3>
      
      <div className="space-y-1">
        <DraggableSidebarItem id="text" label="Text" icon={Type} />
        <DraggableSidebarItem id="heading" label="Heading" icon={Heading1} />
        <DraggableSidebarItem id="image" label="Image" icon={ImageIcon} />
        <DraggableSidebarItem id="button" label="Button" icon={LinkIcon} />
        <DraggableSidebarItem id="divider" label="Divider" icon={Minus} />
        <DraggableSidebarItem id="spacer" label="Spacer" icon={Square} />
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 mt-8">
        E-Commerce Blocks
      </h3>
      
      <div className="space-y-1">
        <DraggableSidebarItem id="product" label="Product" icon={ShoppingBag} />
        <DraggableSidebarItem id="productGrid" label="Product Grid" icon={LayoutGrid} />
        <DraggableSidebarItem id="productListing" label="Product Listing" icon={List} />
      </div>

      <SavedBlocksList />
    </div>
  );
}

function SavedBlocksList() {
  const [savedBlocks, setSavedBlocks] = useState<SavedBlock[]>([]);

  const loadSavedBlocks = () => {
    setSavedBlocks(getSavedBlocks());
  };

  useEffect(() => {
    loadSavedBlocks();
    window.addEventListener('saved-blocks-updated', loadSavedBlocks);
    return () => window.removeEventListener('saved-blocks-updated', loadSavedBlocks);
  }, []);

  if (savedBlocks.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Saved Blocks
      </h3>
      <div className="space-y-2">
        {savedBlocks.map(block => (
          <div key={block.id} className="relative group">
            <DraggableSidebarItem id={`saved-${block.id}`} label={block.name} icon={Save} />
            <button
              className="absolute right-2 top-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                deleteSavedBlock(block.id);
                loadSavedBlocks();
              }}
              title="Delete Saved Block"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
