import { useState } from 'react';
import { Check, ChevronRight, Circle, LayoutGrid, MessageSquare, MoreHorizontal, Sparkles } from 'lucide-react';
import type { ProductFeature } from '@/app/content/productFeatures';

export function ProductPreview({ feature }: { feature: ProductFeature }) {
  const [selected, setSelected] = useState(0);
  const row = feature.rows[selected];
  return <div className={`product-preview product-preview-${feature.preview}`}>
    <div className="preview-toolbar"><span className="preview-dots"><i /><i /><i /></span><span>talio / {feature.name.toLowerCase()}</span><MoreHorizontal size={18} /></div>
    <div className="preview-body">
      <div className="preview-rail" aria-hidden="true"><LayoutGrid /><MessageSquare /><Sparkles /></div>
      <div className="preview-content">
        <div className="preview-heading"><div><span className="product-eyebrow">YOUR WORKSPACE</span><h3>{feature.name}</h3></div><span className="preview-avatar">T</span></div>
        {feature.preview === 'board' ? <div className="preview-board">
          {feature.rows.map(([title, status, detail], index) => <button key={title} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`preview-lane ${selected === index ? 'is-selected' : ''}`}><span className="preview-lane-label"><i />{status}</span><div className="preview-task"><span className="preview-task-code">{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><span>{detail}</span><div className="preview-task-footer"><Circle size={13} /><span className="preview-mini-avatar">T</span></div></div></button>)}
        </div> : feature.preview === 'conversation' ? <div className="preview-conversation">
          {feature.rows.map(([person, text], index) => <button key={index} onClick={() => setSelected(index)} aria-pressed={selected === index} className={`preview-message ${selected === index ? 'is-selected' : ''}`}><span className="preview-mini-avatar">{person.charAt(0)}</span><span><small>{person}</small><strong>{text}</strong></span></button>)}
        </div> : <div className="preview-records">
          <div className="preview-record-head"><span>IN YOUR WORKSPACE</span><span>STATUS</span></div>
          {feature.rows.map(([title, detail, status], index) => <button key={title} onClick={() => setSelected(index)} aria-pressed={selected === index} className={selected === index ? 'is-selected' : ''}><span className="preview-record-icon">{index === 2 ? <Check size={16} /> : <Circle size={16} />}</span><span><strong>{title}</strong><small>{detail}</small></span><span className="preview-status">{status}</span></button>)}
        </div>}
        <div className="preview-inspector" aria-live="polite"><span className="preview-inspector-icon"><feature.icon size={18} /></span><div><strong>{row[0]}</strong><span>{feature.flow[selected][1]}</span></div><ChevronRight size={16} /></div>
      </div>
    </div>
    <div className="preview-caption"><span><i /> Illustrative workspace</span><span>Select an item to explore</span></div>
  </div>;
}
