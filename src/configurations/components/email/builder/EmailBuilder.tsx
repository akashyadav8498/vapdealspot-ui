import { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { EmailDocument, EmailBlock } from '@/configurations/lib/email/builderTypes';

import { EmailBlockSidebar } from './EmailBlockSidebar';
import { EmailBuilderCanvas } from './EmailBuilderCanvas';
import { EmailBlockProperties } from './EmailBlockProperties';
import { saveBlock, getSavedBlocks, cloneBlockForInsertion } from '@/configurations/lib/email/savedBlocksStore';
import { Button } from '@/configurations/components/ui/button';
import { Input } from '@/configurations/components/ui/input';

interface EmailBuilderProps {
  document: EmailDocument;
  onChange: (doc: EmailDocument) => void;
}

export function EmailBuilder({ document, onChange }: EmailBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [savingBlockId, setSavingBlockId] = useState<string | null>(null);
  const [saveBlockName, setSaveBlockName] = useState('');
  const [saveBlockDesc, setSaveBlockDesc] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance to activate, allows clicking without dragging
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Determine if we're dragging from the sidebar (new block) or reordering
      if ((active.id as string).startsWith('sidebar-')) {
        const blockType = (active.id as string).replace('sidebar-', '');
        const newBlock = createNewBlock(blockType);
        
        if (newBlock) {
          const overIndex = document.blocks.findIndex(b => b.id === over.id);
          const insertIndex = overIndex >= 0 ? overIndex : document.blocks.length;
          
          const newBlocks = [...document.blocks];
          newBlocks.splice(insertIndex, 0, newBlock);
          onChange({ ...document, blocks: newBlocks });
          setSelectedBlockId(newBlock.id);
        }
      } else {
        // Reorder existing
        const oldIndex = document.blocks.findIndex(b => b.id === active.id);
        const newIndex = document.blocks.findIndex(b => b.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          onChange({
            ...document,
            blocks: arrayMove(document.blocks, oldIndex, newIndex),
          });
        }
      }
    } else if (!over && (active.id as string).startsWith('sidebar-')) {
      // Dropped on empty canvas
      const blockType = (active.id as string).replace('sidebar-', '');
      const newBlock = createNewBlock(blockType);
      if (newBlock) {
        onChange({ ...document, blocks: [...document.blocks, newBlock] });
        setSelectedBlockId(newBlock.id);
      }
    }
  };

  const createNewBlock = (type: string): EmailBlock | null => {
    const id = crypto.randomUUID();
    switch (type) {
      case 'text':
        return { type: 'text', id, properties: { content: '<p>New Text Block</p>', align: 'left', fontSize: '16px' } };
      case 'heading':
        return { type: 'heading', id, properties: { text: 'New Heading', level: 2, align: 'left' } };
      case 'image':
        return { type: 'image', id, properties: { url: '', altText: '', linkUrl: '', align: 'center' } };
      case 'button':
        return { type: 'button', id, properties: { label: 'Click Me', linkUrl: '', align: 'center', backgroundColor: '#000000', textColor: '#ffffff' } };
      case 'divider':
        return { type: 'divider', id, properties: { thickness: 1, spacing: 20, color: '#e5e5e5' } };
      case 'spacer':
        return { type: 'spacer', id, properties: { height: 40 } };
      case 'product':
        return { type: 'product', id, properties: { productId: '', align: 'center', showImage: true, showTitle: true, showPrice: true, showCompareAtPrice: true, showDiscount: true, showDescription: false, showRating: true, ctaLabel: 'Shop Now' } };
      case 'productGrid':
        return { type: 'productGrid', id, properties: { productIds: [], columns: 2, showImage: true, showTitle: true, showPrice: true, showCompareAtPrice: true, showDiscount: true, showDescription: false, showRating: true, ctaLabel: 'Shop Now' } };
      case 'productListing':
        return { type: 'productListing', id, properties: { productIds: [], showImage: true, showTitle: true, showPrice: true, showCompareAtPrice: true, showDiscount: true, showDescription: true, showRating: true, ctaLabel: 'Shop Now' } };
      default: {
        if (type.startsWith('saved-')) {
          const savedBlockId = type.replace('saved-', '');
          const savedBlocks = getSavedBlocks();
          const saved = savedBlocks.find(b => b.id === savedBlockId);
          if (saved) {
            return cloneBlockForInsertion(saved.blockData);
          }
        }
        return null;
      }
    }
  };

  const activeBlock = activeId ? document.blocks.find(b => b.id === activeId) : null;
  const selectedBlock = selectedBlockId ? document.blocks.find(b => b.id === selectedBlockId) : null;

  const updateSelectedBlock = (updatedBlock: EmailBlock) => {
    onChange({
      ...document,
      blocks: document.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
    });
  };

  const deleteBlock = (id: string) => {
    onChange({
      ...document,
      blocks: document.blocks.filter(b => b.id !== id)
    });
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const confirmSaveBlock = () => {
    if (!savingBlockId || !saveBlockName.trim()) return;
    const blockToSave = document.blocks.find(b => b.id === savingBlockId);
    if (blockToSave) {
      saveBlock(blockToSave, saveBlockName, saveBlockDesc);
      // Trigger a re-render of sidebar by dispatching a custom event or relying on local storage listener
      window.dispatchEvent(new Event('saved-blocks-updated'));
    }
    setSavingBlockId(null);
    setSaveBlockName('');
    setSaveBlockDesc('');
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[800px] border rounded-lg overflow-hidden bg-background">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-muted/20 flex flex-col">
          <EmailBlockSidebar />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 bg-secondary/50 overflow-y-auto p-8 relative">
          <div className="max-w-2xl mx-auto bg-card shadow-sm min-h-[600px] pb-32">
            <SortableContext 
              items={document.blocks.map(b => b.id)} 
              strategy={verticalListSortingStrategy}
            >
              <EmailBuilderCanvas 
                blocks={document.blocks} 
                selectedBlockId={selectedBlockId}
                onSelect={setSelectedBlockId}
                onDelete={deleteBlock}
                onSaveBlock={setSavingBlockId}
              />
            </SortableContext>
            
            {document.blocks.length === 0 && (
              <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed mx-4 mt-4">
                Drag and drop blocks here
              </div>
            )}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 border-l bg-card flex flex-col overflow-y-auto">
          {selectedBlock ? (
            <EmailBlockProperties 
              block={selectedBlock} 
              onChange={updateSelectedBlock} 
            />
          ) : (
            <div className="p-6 text-center text-muted-foreground mt-20">
              Select a block to edit its properties
            </div>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
        {activeBlock ? (
          <div className="p-4 bg-background border shadow-lg rounded-md opacity-80">
            {activeBlock.type} block
          </div>
        ) : activeId?.startsWith('sidebar-') ? (
          <div className="p-4 bg-background border shadow-lg rounded-md opacity-80">
            New {activeId.replace('sidebar-', '')} block
          </div>
        ) : null}
      </DragOverlay>

      {savingBlockId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border shadow-lg rounded-lg p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-lg">Save as Block</h3>
            <p className="text-sm text-muted-foreground">Save this block to reuse it in other campaigns.</p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
              <Input 
                value={saveBlockName} 
                onChange={e => setSaveBlockName(e.target.value)} 
                placeholder="e.g. Hero Header"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input 
                value={saveBlockDesc} 
                onChange={e => setSaveBlockDesc(e.target.value)} 
                placeholder="e.g. Standard hero with logo and CTA"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSavingBlockId(null)}>Cancel</Button>
              <Button onClick={confirmSaveBlock} disabled={!saveBlockName.trim()}>Save Block</Button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
