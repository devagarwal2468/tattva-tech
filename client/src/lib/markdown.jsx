import React from 'react';

/**
 * Minimal, safe Markdown-ish renderer for CMS article bodies.
 * Supports: ## / ### headings, "- " bullet lists, **bold**, and paragraphs.
 * Never injects raw HTML.
 */
const inline = (text, keyBase) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={`${keyBase}-${i}`} className="font-semibold text-ink-800">{part.slice(2, -2)}</strong> : part,
  );

export function renderArticle(content = '') {
  const blocks = content.replace(/\r\n/g, '\n').split(/\n{2,}/);
  const out = [];
  blocks.forEach((block, bi) => {
    const lines = block.split('\n').filter((l) => l.trim() !== '');
    let para = [];
    let list = [];
    const flushPara = () => {
      if (para.length) out.push(<p key={`p-${bi}-${out.length}`}>{inline(para.join(' '), `p${bi}`)}</p>);
      para = [];
    };
    const flushList = () => {
      if (list.length) out.push(<ul key={`ul-${bi}-${out.length}`}>{list.map((li, i) => <li key={i}>{inline(li, `li${bi}${i}`)}</li>)}</ul>);
      list = [];
    };
    lines.forEach((line) => {
      const h = line.match(/^#{2,4}\s+(.*)$/);
      const li = line.match(/^\s*[-*•]\s+(.*)$/);
      if (h) {
        flushPara();
        flushList();
        out.push(<h2 key={`h-${bi}-${out.length}`}>{h[1]}</h2>);
      } else if (li) {
        flushPara();
        list.push(li[1]);
      } else {
        flushList();
        para.push(line.trim());
      }
    });
    flushPara();
    flushList();
  });
  return out;
}
