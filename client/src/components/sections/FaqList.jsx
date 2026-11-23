import React, { useId, useState } from 'react';
import { Plus } from 'lucide-react';

export default function FaqList({ items }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  return (
    <div className="divide-y divide-ink-100 border-y border-ink-100">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.q}>
            <h3 className="font-sans">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-ink-900 transition hover:text-brand-600"
              >
                {item.q}
                <Plus className={`h-5 w-5 shrink-0 text-ink-400 transition-transform duration-300 ${isOpen ? 'rotate-45 text-brand-600' : ''}`} aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-hidden={!isOpen} className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <p className="overflow-hidden pr-10 leading-relaxed text-ink-500">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
