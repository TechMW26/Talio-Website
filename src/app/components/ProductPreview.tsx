import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Circle, LayoutGrid, MessageSquare, Sparkles } from 'lucide-react';
import type { ProductFeature } from '@/app/content/productFeatures';

export function ProductPreview({ feature }: { feature: ProductFeature }) {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();

  return (
    <div className="product-preview">
      <div className="preview-toolbar">
        <span className="preview-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>Talio / {feature.name}</span>
        <span>Preview</span>
      </div>
      <div className="preview-body">
        <div className="preview-rail" aria-hidden="true"><LayoutGrid /><MessageSquare /><Sparkles /></div>
        <div className="preview-content">
          <div className="preview-heading">
            <h3>{feature.name}</h3>
            <span className="preview-avatar" aria-hidden="true">T</span>
          </div>
          {feature.preview === 'board' && (
            <div className="preview-board">
              {feature.rows.map(([title, status, detail], index) => (
                <button
                  key={title}
                  className="preview-lane"
                  type="button"
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  <span className="preview-lane-label"><i />{status}</span>
                  <span className="preview-task">
                    <strong>{title}</strong><small>{detail}</small>
                    <span className="preview-task-footer" aria-hidden="true">
                      <Circle size="1em" /><span className="preview-mini-avatar">T</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {feature.preview === 'conversation' && (
            <div className="preview-conversation">
              {feature.rows.map(([person, message], index) => (
                <button key={message} className="preview-message" type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                  <span className="preview-mini-avatar" aria-hidden="true">{person.charAt(0)}</span>
                  <span><small>{person}</small><strong>{message}</strong></span>
                </button>
              ))}
            </div>
          )}
          {feature.preview === 'records' && (
            <div className="preview-records">
              {feature.rows.map(([title, detail, status], index) => (
                <button key={title} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                  <span className="preview-record-icon" aria-hidden="true">
                    {index === 2 ? <Check size="1em" /> : <Circle size="1em" />}
                  </span>
                  <span><strong>{title}</strong><small>{detail}</small></span>
                  <span className="preview-status">{status}</span>
                </button>
              ))}
            </div>
          )}
          <div className="preview-inspector" aria-live="polite">
            <span className="preview-inspector-icon"><feature.icon size="1.125em" /></span>
            <motion.div
              key={selected}
              initial={reduced ? false : { opacity: .5, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : .22 }}
            >
              <strong>{feature.flow[selected][0]}</strong>
              <span>{feature.flow[selected][1]}</span>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="preview-caption"><span><i /> Illustrative workspace</span><span>Select an item to explore</span></div>
    </div>
  );
}
