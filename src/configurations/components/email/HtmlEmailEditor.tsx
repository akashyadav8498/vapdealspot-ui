import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface HtmlEmailEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function HtmlEmailEditor({ value, onChange, disabled }: HtmlEmailEditorProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    onChange(val);
    validateHtml(val);
  };

  const validateHtml = (html: string) => {
    if (!html || html.trim() === '') {
      setValidationError('HTML content is empty.');
      return;
    }

    // Basic heuristic checks for missing common tags without full parsing
    const hasHtmlTag = /<html[^>]*>/i.test(html);
    const hasBodyTag = /<body[^>]*>/i.test(html);

    if (hasHtmlTag && !/<\/html>/i.test(html)) {
      setValidationError('Found opening <html> tag but no closing </html> tag.');
      return;
    }

    if (hasBodyTag && !/<\/body>/i.test(html)) {
      setValidationError('Found opening <body> tag but no closing </body> tag.');
      return;
    }

    setValidationError(null);
  };

  const formatHtml = () => {
    // Very basic indentation format for readability
    let formatted = '';
    let indent = 0;
    
    // Simplistic regex approach, assumes reasonably formed HTML
    const tokens = internalValue.split(/(<\/?[^>]+>)/g).filter(t => t.trim() !== '');
    
    for (const token of tokens) {
      if (token.match(/^<\/[^>]+>$/)) {
        indent = Math.max(0, indent - 1);
        formatted += '\n' + '  '.repeat(indent) + token;
      } else if (token.match(/^<[^>]+\/>$/) || token.match(/^<![^>]+>$/)) {
        formatted += '\n' + '  '.repeat(indent) + token;
      } else if (token.match(/^<[^>]+>$/)) {
        formatted += '\n' + '  '.repeat(indent) + token;
        // Don't indent for tags we know don't typically wrap large blocks in email
        if (!token.match(/^<(br|img|hr|meta|link|input)/i)) {
          indent++;
        }
      } else {
        formatted += '\n' + '  '.repeat(indent) + token.trim();
      }
    }
    
    const finalFormatted = formatted.trim().replace(/\n\s*\n/g, '\n');
    setInternalValue(finalFormatted);
    onChange(finalFormatted);
    validateHtml(finalFormatted);
  };

  return (
    <div className={`flex flex-col h-[600px] border rounded-lg overflow-hidden bg-background ${disabled ? 'opacity-70 pointer-events-none' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/20">
        <div className="flex items-center gap-2 px-2">
          {validationError ? (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span>{validationError}</span>
            </div>
          ) : internalValue.trim() !== '' ? (
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>No major issues detected</span>
            </div>
          ) : null}
        </div>
        <div>
          <button
            type="button"
            onClick={formatHtml}
            className="text-xs px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors"
          >
            Format (Beautify)
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={internalValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Paste your raw HTML here..."
          className="w-full h-full p-4 font-mono text-sm leading-relaxed resize-none bg-[#1e1e1e] text-[#d4d4d4] focus:outline-none placeholder:text-muted-foreground/50"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
