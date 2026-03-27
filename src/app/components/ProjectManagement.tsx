import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sparkles, Plus, MoreHorizontal, Layout, Settings, Share2, ZoomIn, ZoomOut } from 'lucide-react';

const ItemType = 'CARD';

interface Card {
  id: string;
  task: string;
  label: string;
  assignee: string;
}

interface Column {
  title: string;
  count: number;
  cards: Card[];
}

// Column color scheme
const COLUMN_COLORS = [
  { bg: '#1e2a4a', border: '#2d4a8a', accent: '#3b82f6', dot: 'bg-blue-500', strip: 'from-blue-500 to-blue-400' },
  { bg: '#3b2a10', border: '#6b4a1a', accent: '#f59e0b', dot: 'bg-amber-500', strip: 'from-amber-500 to-amber-400' },
  { bg: '#2d1a4a', border: '#5a2d8a', accent: '#a855f7', dot: 'bg-purple-500', strip: 'from-purple-500 to-purple-400' },
  { bg: '#0a2e24', border: '#1a5a42', accent: '#10b981', dot: 'bg-emerald-500', strip: 'from-emerald-500 to-emerald-400' },
];

// Minimalist Card Component with column-based color coding
function DraggableCard({ 
  card, 
  columnIndex, 
  cardIndex, 
  column,
  moveCard,
  isAnimating,
}: { 
  card: Card;
  columnIndex: number;
  cardIndex: number;
  column: Column;
  moveCard: (draggedCard: Card, fromColumn: number, fromIndex: number, toColumn: number, toIndex: number) => void;
  isAnimating: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const colors = COLUMN_COLORS[columnIndex] || COLUMN_COLORS[0];
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { card, columnIndex, cardIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card, columnIndex, cardIndex]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { card: Card; columnIndex: number; cardIndex: number }) => {
      if (item.columnIndex !== columnIndex || item.cardIndex !== cardIndex) {
        moveCard(item.card, item.columnIndex, item.cardIndex, columnIndex, cardIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [columnIndex, cardIndex, moveCard]);

  useEffect(() => {
    if (cardRef.current) {
      drag(drop(cardRef.current));
    }
  }, [drag, drop]);

  return (
    <motion.div
      ref={cardRef}
      layoutId={card.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDragging ? 0.4 : 1, 
        y: 0,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        boxShadow: isAnimating 
          ? `0 20px 60px -10px ${colors.accent}40, 0 8px 20px -6px rgba(0,0,0,0.5)` 
          : `0 1px 3px rgba(0,0,0,0.2)`,
        scale: isAnimating ? 1.05 : 1,
        zIndex: isAnimating ? 50 : 0,
      }}
      transition={{
        layout: { type: "spring", stiffness: 100, damping: 18, mass: 0.8 },
        backgroundColor: { duration: 0.6, ease: "easeInOut" },
        borderColor: { duration: 0.6, ease: "easeInOut" },
        boxShadow: { duration: 0.4 },
        scale: { duration: 0.3 },
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative p-4 mb-3 rounded-xl 
        border
        cursor-grab active:cursor-grabbing
        group overflow-hidden
        ${isOver ? 'ring-2 ring-blue-500/50 scale-[1.02]' : ''}
      `}
    >
      {/* Top color strip */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${colors.strip} transition-all duration-700`} />

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <motion.div 
            className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}
            animate={{ backgroundColor: colors.accent }}
            transition={{ duration: 0.6 }}
          />
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500">
            {card.label}
          </span>
        </div>
        <button className="text-zinc-600 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-sm font-medium text-zinc-200 leading-snug mb-3">
        {card.task}
      </h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 border border-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400">
          {card.assignee}
        </div>
        <div className="text-[10px] font-medium text-zinc-600">
          {card.id.split('-')[1]}
        </div>
      </div>
    </motion.div>
  );
}

// Droppable column zone — accepts drops on the entire column area including empty space
function DroppableColumn({ 
  colIndex, 
  colColors, 
  column, 
  moveCard, 
  animatingCardId, 
}: { 
  colIndex: number; 
  colColors: typeof COLUMN_COLORS[0]; 
  column: Column; 
  moveCard: (draggedCard: Card, fromColumn: number, fromIndex: number, toColumn: number, toIndex: number) => void;
  animatingCardId: string | null;
}) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { card: Card; columnIndex: number; cardIndex: number }) => {
      if (item.columnIndex !== colIndex) {
        moveCard(item.card, item.columnIndex, item.cardIndex, colIndex, column.cards.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [colIndex, column.cards.length, moveCard]);

  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [drop]);

  return (
    <div
      ref={dropRef}
      className={`flex flex-col h-full bg-zinc-900/50 rounded-2xl p-2 border backdrop-blur-[2px] transition-colors duration-200 ${
        isOver ? 'border-white/20 bg-zinc-800/60' : 'border-zinc-800/50'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 p-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colColors.dot}`} />
          <h3 className="text-sm font-bold text-zinc-200">
            {column.title}
          </h3>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-gray-500">
            {column.cards.length}
          </span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </div>

      {/* Drop Zone */}
      <div className={`flex-1 min-h-[300px] rounded-xl transition-colors duration-200 ${
        isOver ? 'bg-white/5' : ''
      }`}>
        <AnimatePresence mode="popLayout">
        {column.cards.map((card, cardIndex) => (
          <DraggableCard
            key={card.id}
            card={card}
            columnIndex={colIndex}
            cardIndex={cardIndex}
            column={column}
            moveCard={moveCard}
            isAnimating={animatingCardId === card.id}
          />
        ))}
        </AnimatePresence>
        
        <button
          className="w-full py-2.5 mt-1 rounded-lg border border-transparent hover:bg-white/5 text-zinc-500 hover:text-zinc-300 text-xs font-medium flex items-center gap-2 px-3 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Handwritten SVG stroke-drawing text ─── */
function HandwrittenText({ text, active }: { text: string; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (active && !revealed) {
      // Small delay so the board finishes expanding first
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
    if (!active) setRevealed(false);
  }, [active]);

  const words = text.split(' ');
  const charDelay = 0.045; // seconds per character
  let globalIdx = 0;

  return (
    <div ref={containerRef} className="relative w-[85%] md:w-[82%] mx-auto flex justify-center pb-2">
      <p
        className="text-center leading-[1.15]"
        style={{
          fontFamily: "'Indie Flower', cursive",
          fontWeight: 400,
          fontSize: 'clamp(2.8rem, 8vw, 7rem)',
          filter: 'drop-shadow(0 0 40px rgba(168, 85, 247, 0.45)) drop-shadow(0 0 80px rgba(96, 165, 250, 0.2))',
        }}
      >
        {words.map((word, wi) => {
          const chars = word.split('');
          const wordSpan = (
            <span key={wi} className="inline-block whitespace-nowrap">
              {chars.map((ch) => {
                const idx = globalIdx++;
                return (
                  <motion.span
                    key={`${wi}-${idx}`}
                    className="inline-block bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
                      backgroundSize: `${text.length * 0.6}em`,
                      backgroundPosition: `${idx * 0.6}em`,
                    }}
                    initial={{ opacity: 0, y: 30, scale: 0.6, rotateZ: -8 }}
                    animate={
                      revealed
                        ? { opacity: 1, y: 0, scale: 1, rotateZ: 0 }
                        : { opacity: 0, y: 30, scale: 0.6, rotateZ: -8 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: revealed ? idx * charDelay : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          );
          // Add space between words (not after last)
          if (wi < words.length - 1) {
            globalIdx++; // count the space
            return (
              <span key={`w${wi}`}>
                {wordSpan}
                <span className="inline-block w-[0.3em]" />
              </span>
            );
          }
          return wordSpan;
        })}
      </p>


    </div>
  );
}

function ProjectManagementContent() {
  const containerRef = useRef(null);
  
  // Track scroll within this 300vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Zoom Effect Logic
  // 0 to 0.3 scroll progress triggers the expansion
  
  // Start width at 85%, expand to 100%
  const width = useTransform(scrollYProgress, [0, 0.3], ["85%", "100%"]);
  
  // Start height at 60vh, expand to 100vh
  const height = useTransform(scrollYProgress, [0, 0.3], ["60vh", "100vh"]);
  
  // Start position: Push down by 35vh to leave room for header
  // End position: 0vh (top of screen)
  const top = useTransform(scrollYProgress, [0, 0.3], ["35vh", "0vh"]);
  
  // Border radius change
  const borderRadius = useTransform(scrollYProgress, [0, 0.3], [32, 0]);
  
  const innerRadius = useTransform(borderRadius, r => Math.max(0, r - 8));

  const initialKanbanData: Column[] = [
    {
      title: 'To Do',
      count: 8,
      cards: [
        { id: 'todo-1', task: 'Update user documentation', label: 'Documentation', assignee: 'JD' },
        { id: 'todo-2', task: 'Design new landing page', label: 'Design', assignee: 'SM' }
      ]
    },
    {
      title: 'In Progress',
      count: 5,
      cards: [
        { id: 'progress-1', task: 'Build payment integration', label: 'Development', assignee: 'RK' },
        { id: 'progress-2', task: 'Create marketing assets', label: 'Marketing', assignee: 'AL' }
      ]
    },
    {
      title: 'Review',
      count: 3,
      cards: [
        { id: 'review-1', task: 'Code review for API endpoints', label: 'Development', assignee: 'TH' },
        { id: 'review-2', task: 'UX testing for mobile app', label: 'QA', assignee: 'MJ' }
      ]
    },
    {
      title: 'Done',
      count: 12,
      cards: [
        { id: 'done-1', task: 'Launch email campaign', label: 'Marketing', assignee: 'NK' },
        { id: 'done-2', task: 'Database optimization', label: 'Backend', assignee: 'PL' }
      ]
    }
  ];

  const [kanbanData, setKanbanData] = useState<Column[]>(initialKanbanData);

  // Track which card is currently flying (for shadow/scale boost)
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  const hasAnimated = useRef(false);

  // Track when board is fully expanded to trigger tagline animation
  const [boardFullscreen, setBoardFullscreen] = useState(false);

  // Single scroll-triggered animation: pick a random card, move it to the next column
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Track fullscreen state for tagline animation
    if (latest >= 0.32 && !boardFullscreen) setBoardFullscreen(true);
    if (latest < 0.25 && boardFullscreen) setBoardFullscreen(false);

    // Trigger once when the board is fully expanded (~40% scroll)
    if (latest > 0.4 && !hasAnimated.current) {
      hasAnimated.current = true;
      
      // Pick a random card from a random non-last, non-empty column
      const eligibleColumns: number[] = [];
      kanbanData.forEach((col, i) => {
        if (i < kanbanData.length - 1 && col.cards.length > 0) {
          eligibleColumns.push(i);
        }
      });
      
      if (eligibleColumns.length === 0) return;
      
      const sourceCol = eligibleColumns[Math.floor(Math.random() * eligibleColumns.length)];
      const sourceCards = kanbanData[sourceCol].cards;
      const cardIdx = Math.floor(Math.random() * sourceCards.length);
      const card = sourceCards[cardIdx];
      
      // Set the animating card for the float-up effect
      setAnimatingCardId(card.id);
      
      // Move the card in state after a tiny delay so layoutId picks up the animation
      requestAnimationFrame(() => {
        setKanbanData(prev => {
          const newData = prev.map(col => ({ ...col, cards: [...col.cards] }));
          const [movedCard] = newData[sourceCol].cards.splice(cardIdx, 1);
          newData[sourceCol + 1].cards.push(movedCard);
          return newData;
        });
      });
      
      // Clear the animating state after the layout animation settles
      setTimeout(() => {
        setAnimatingCardId(null);
      }, 1200);
    }
  });

  const moveCard = (
    draggedCard: Card,
    fromColumnIndex: number,
    fromCardIndex: number,
    toColumnIndex: number,
    toCardIndex: number
  ) => {
    setKanbanData(prevData => {
      const newData = [...prevData];
      const sourceColumn = { ...newData[fromColumnIndex] };
      const sourceCards = [...sourceColumn.cards];
      sourceCards.splice(fromCardIndex, 1);
      sourceColumn.cards = sourceCards;
      newData[fromColumnIndex] = sourceColumn;
      
      const destColumn = { ...newData[toColumnIndex] };
      const destCards = [...destColumn.cards];
      destCards.splice(toCardIndex, 0, draggedCard);
      destColumn.cards = destCards;
      newData[toColumnIndex] = destColumn;
      
      return newData;
    });
  };

  return (
    <section ref={containerRef} className="relative h-[140vh] bg-black z-[60]" style={{ position: 'relative' }}>
      
      {/* Sticky Container — z-[60] on section ensures it overlays the fixed navbar (z-50) when the board expands fullscreen */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Decorative Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Section - Fixed in the top 35% of the screen */}
        <div className="absolute top-0 left-0 right-0 h-[35vh] flex flex-col items-center justify-center z-10 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400">Smart Workflow</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-white leading-[1.05] tracking-tighter mb-8"
          >
            Visual Boards <br />
            <span className="text-zinc-700">For Every Team</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 font-light text-center max-w-2xl hidden md:block leading-relaxed"
          >
            Experience a fluid workflow on our intelligent canvas.
          </motion.p>
        </div>

        {/* Expanding Smart Board */}
        {/* z-[60] ensures it covers the navbar (z-50) when expanded */}
        <motion.div 
          style={{ 
            width, 
            height,
            top, // Controlled by scroll
            borderRadius: borderRadius,
            left: 0, 
            right: 0,
            margin: '0 auto', // Center horizontally
            position: 'absolute', // Absolute positioning for precise 'top' control
          }}
          className="z-[60] shadow-2xl overflow-hidden" 
        >
          {/* Board Frame / Bezel */}
          <div className="relative w-full h-full p-2 bg-gradient-to-b from-zinc-800 to-zinc-900 flex flex-col">
            
            {/* Camera/Sensor indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/30 rounded-b-lg z-30" />
            
            {/* Screen Area */}
            <motion.div 
              style={{ borderRadius: innerRadius }}
              className="bg-zinc-950 flex-1 overflow-hidden relative border border-white/5 shadow-inner flex flex-col"
            >
              
              {/* Screen Header / Toolbar */}
              <motion.div
                style={{ borderTopLeftRadius: innerRadius, borderTopRightRadius: innerRadius }}
                className="flex items-center justify-between px-8 py-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  <div className="h-6 w-px bg-zinc-700 mx-2" />
                  <h3 className="text-sm font-semibold text-zinc-300">Product Roadmap</h3>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex -space-x-2 mr-4">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                     ))}
                  </div>
                  <Settings className="w-5 h-5 hover:text-zinc-300 transition-colors cursor-pointer" />
                  <Share2 className="w-5 h-5 hover:text-zinc-300 transition-colors cursor-pointer" />
                  <div className="w-px h-6 bg-zinc-700" />
                  <ZoomOut className="w-4 h-4 cursor-pointer" />
                  <span className="text-xs font-mono">100%</span>
                  <ZoomIn className="w-4 h-4 cursor-pointer" />
                </div>
              </motion.div>

              {/* Board Content Grid */}
              <div className="p-8 flex-1 overflow-y-auto flex flex-col">
                {/* Subtle Dot Grid Background */}
                <div className="absolute inset-0 top-[80px] opacity-[0.4] bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-0">
                  {kanbanData.map((column, colIndex) => {
                    const colColors = COLUMN_COLORS[colIndex] || COLUMN_COLORS[0];
                    return (
                      <DroppableColumn
                        key={column.title}
                        colIndex={colIndex}
                        colColors={colColors}
                        column={column}
                        moveCard={moveCard}
                        animatingCardId={animatingCardId}
                      />
                    );
                  })}
                </div>

                {/* Handwriting tagline — only animates when board is fullscreen */}
                <div className="relative flex flex-1 items-center justify-center min-h-[140px] md:min-h-[200px] lg:min-h-[260px] w-full">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={boardFullscreen ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative select-none flex flex-col items-center w-full"
                  >
                    {/* Glow backdrop */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={boardFullscreen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                      className="absolute inset-0 -inset-x-12 -inset-y-8 bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none"
                    />

                    {/* SVG handwriting stroke animation */}
                    <HandwrittenText
                      text="Drag. Drop. Done."
                      active={boardFullscreen}
                    />

                    {/* Subheading */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={boardFullscreen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.8, delay: boardFullscreen ? 1.2 : 0, ease: [0.16, 1, 0.3, 1] }}
                      className="text-base md:text-xl lg:text-2xl text-zinc-400 font-light text-center tracking-wide max-w-2xl"
                      style={{ marginTop: '1.5em' }}
                    >
                      Organize anything — ship everything, on time
                    </motion.p>
                  </motion.div>
                </div>
              </div>
              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ProjectManagement() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ProjectManagementContent />
    </DndProvider>
  );
}