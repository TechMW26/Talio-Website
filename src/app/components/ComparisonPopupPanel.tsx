import logoImage from '@/assets/2090cd551224404a5a02329a4590597a32d19a1f.png';

const comparisonCompetitors = [
  { name: 'Talio', icon: logoImage, isTalio: true },
  { name: 'Jira', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968875.png', isTalio: false },
  { name: 'Asana', icon: 'https://cdn-icons-png.flaticon.com/512/15466/15466163.png', isTalio: false },
  { name: 'Slack', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111615.png', isTalio: false },
];

const comparisonFeatures = [
  { name: 'Unified workspace', values: [true, false, false, false] },
  { name: 'AI-powered automation', values: [true, false, false, false] },
  { name: 'Built-in team chat', values: [true, false, false, true] },
  { name: 'Project management', values: [true, true, true, false] },
  { name: 'HR & Payroll', values: [true, false, false, false] },
];

interface ComparisonPopupPanelProps {
  className?: string;
}

export function ComparisonPopupPanel({ className = '' }: ComparisonPopupPanelProps) {
  return (
    <div className={`relative w-full rounded-[2rem] border border-white/10 bg-zinc-900/90 p-4 shadow-[0_0_40px_rgba(76,29,149,0.12)] backdrop-blur-xl ${className}`.trim()}>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="text-center">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Comparison</span>
        <span className="mt-2 block text-2xl font-bold tracking-tighter text-white">1 tool to do it all</span>
        <span className="mt-1 block text-sm text-gray-400">Save time and money. Just get Talio.</span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[310px]">
          <thead>
            <tr>
              <th className="w-[40%] px-2 py-3 text-left text-[11px] font-normal uppercase tracking-[0.14em] text-gray-500" />
              {comparisonCompetitors.map((competitor) => (
                <th key={competitor.name} className="px-2 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <img
                      src={competitor.icon}
                      alt={competitor.name}
                      className={`h-7 w-7 object-contain ${competitor.isTalio ? '' : 'opacity-60'}`}
                      loading="lazy"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature) => (
              <tr key={feature.name} className="border-t border-white/6">
                <td className="px-2 py-3 text-sm text-gray-300">{feature.name}</td>
                {feature.values.map((value, index) => (
                  <td key={`${feature.name}-${index}`} className="px-2 py-3 text-center">
                    {value ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">✓</span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-sm font-bold text-red-400/80">✗</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}