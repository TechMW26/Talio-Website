import { motion } from 'motion/react';
import { useRef } from 'react';
import { ScrollRevealText, ScrollRevealHeading } from '@/app/components/ScrollRevealText';

export function OKRSection() {
  const containerRef = useRef(null);

  const cards = [
    {
      type: 'stat',
      value: '63%',
      label: 'Avg Progress',
      trend: '↑ 12%',
      color: 'bg-black text-white dark:bg-white dark:text-black',
      direction: 'down' // Comes from below
    },
    {
      type: 'goal',
      title: 'Increase Customer Satisfaction',
      progress: 85,
      priority: 'High',
      direction: 'up' // Drops from above
    },
    {
      type: 'stat',
      value: '12',
      label: 'Active Goals',
      trend: 'On Track',
      color: 'bg-purple-600 text-white',
      direction: 'down'
    },
    {
      type: 'goal',
      title: 'Launch 5 New Features',
      progress: 60,
      priority: 'Medium',
      direction: 'up'
    },
    {
      type: 'goal',
      title: 'Reduce Churn Rate',
      progress: 45,
      priority: 'Critical',
      direction: 'down'
    },
    {
      type: 'stat',
      value: '8',
      label: 'Completed',
      trend: 'Q1 2025',
      color: 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white',
      direction: 'up'
    }
  ];

  return (
    <section ref={containerRef} className="relative py-32 bg-black overflow-hidden perspective-1000" style={{ position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-sm font-medium text-purple-400 uppercase tracking-widest">
              OKRs & Goals
            </span>
          </motion.div>
          
          <ScrollRevealHeading className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center">
            Set Ambitious Goals
          </ScrollRevealHeading>
          
          <ScrollRevealText className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-2xl text-center">
            Align your team with cascading goals and track progress in real-time.
            Watch your organization move as one.
          </ScrollRevealText>
        </div>

        {/* Dynamic Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <ScrollRevealCard key={index} data={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScrollRevealCard({ data, index }: { data: any, index: number }) {
  const isUp = data.direction === 'up'; // If 'up', it drops from above (starts at -y)
  
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: isUp ? -100 : 100,
        rotateX: isUp ? 15 : -15,
        scale: 0.9
      }}
      whileInView={{ 
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: index * 0.1
      }}
      className="h-full"
    >
      {data.type === 'stat' ? (
        <div className={`h-full rounded-3xl p-10 flex flex-col justify-between shadow-xl ${data.color} min-h-[300px] group hover:scale-[1.02] transition-transform duration-500`}>
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium uppercase tracking-widest opacity-80">{data.label}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              {data.trend}
            </span>
          </div>
          <div>
            <div className="text-7xl font-bold mb-2 tracking-tighter">{data.value}</div>
          </div>
        </div>
      ) : (
        <div className="h-full bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-xl min-h-[300px] flex flex-col justify-between group hover:border-purple-500/30 transition-colors duration-500">
          <div>
            <div className="flex justify-between items-start mb-8">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                data.priority === 'High' ? 'bg-black text-white dark:bg-white dark:text-black' :
                data.priority === 'Critical' ? 'bg-red-500 text-white' :
                'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {data.priority}
              </span>
              <span className="text-3xl font-bold text-black dark:text-white">{data.progress}%</span>
            </div>
            <h4 className="text-2xl font-bold text-black dark:text-white leading-tight mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {data.title}
            </h4>
          </div>
          
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${data.progress}%` }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-black dark:bg-white"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}