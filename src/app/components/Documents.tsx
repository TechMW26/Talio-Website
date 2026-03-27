import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Book, Code, Terminal, Copy, Check, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';

/* ─── Code Block with Copy ─── */
function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-800/60">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/60 border-b border-gray-800/60">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-gray-950/80 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export function Documents() {
  usePageMeta('API Documentation', 'Talio REST API documentation. Explore endpoints, authentication, rate limits, and code examples for integrating with your workforce data.');

  const heroRef = useRef(null);
  const docsRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const docsInView = useInView(docsRef, { once: true, margin: "-100px" });

  const endpoints = [
    { method: 'GET', path: '/employees', desc: 'Retrieve a list of all employees in your organization.' },
    { method: 'POST', path: '/attendance/check-in', desc: 'Record an employee check-in with GPS coordinates.' },
    { method: 'GET', path: '/leave/balance/:employeeId', desc: 'Get leave balance for a specific employee.' },
    { method: 'POST', path: '/payroll/generate', desc: 'Generate payroll for a specific month.' },
  ];

  const rateLimits = [
    { plan: 'Free', limit: '100 requests/min' },
    { plan: 'Professional', limit: '1,000 requests/min' },
    { plan: 'Enterprise', limit: '10,000 requests/min (customizable)' },
  ];

  const errorCodes = [
    { code: '200', desc: 'Success' },
    { code: '400', desc: 'Bad Request (invalid parameters)' },
    { code: '401', desc: 'Unauthorized (missing or invalid API key)' },
    { code: '403', desc: 'Forbidden (insufficient permissions)' },
    { code: '404', desc: 'Not Found' },
    { code: '429', desc: 'Rate Limit Exceeded' },
    { code: '500', desc: 'Internal Server Error' },
  ];

  return (
    <div className="bg-gray-950 min-h-screen relative">
      {/* Hero */}
      <section ref={heroRef} className="relative pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-blue-400 uppercase tracking-widest mb-10">
            ✦ DEVELOPER DOCUMENTATION
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center">
            Build with Talio API
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto text-center">
            Everything you need to integrate and extend Talio for your organization.
          </p>
        </motion.div>
      </section>

      {/* Docs Content */}
      <section ref={docsRef} className="pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={docsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4 mb-12"
          >
            <Terminal className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-1">Base URL</p>
              <p className="text-gray-400 text-sm">All API requests should be made to: <code className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">https://api.talio.app/v1</code></p>
            </div>
          </motion.div>

          {/* Key Features + Authentication Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={docsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-gray-900/60 border border-gray-800/60 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  <Book className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Key Features</h3>
              </div>
              <ul className="space-y-3">
                {['RESTful JSON API', 'OAuth 2.0 Authentication', 'Real-time Webhooks', 'Comprehensive SDKs', 'Rate limiting with generous quotas'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={docsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900/60 border border-gray-800/60 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                  <Code className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Authentication</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5">Include your API key in all requests using OAuth 2.0 Bearer Token:</p>
              <CodeBlock label="HTTP Header" code="Authorization: Bearer YOUR_API_KEY" />
              <div className="mt-5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-300 text-xs font-semibold mb-1">⚠ Keep Your Keys Secure</p>
                <p className="text-gray-400 text-xs">Never expose your API keys in client-side code or public repositories.</p>
              </div>
            </motion.div>
          </div>

          {/* Quick Start Code Blocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={docsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Quick Start</h3>
            <div className="grid lg:grid-cols-3 gap-6">
              <CodeBlock
                label="cURL"
                code={`curl -X GET "https://api.talio.app/v1/employees" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              />
              <CodeBlock
                label="JavaScript"
                code={`const response = await fetch(
  'https://api.talio.app/v1/employees',
  {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  }
);
const employees = await response.json();`}
              />
              <CodeBlock
                label="Python"
                code={`import os, requests

response = requests.get(
    'https://api.talio.app/v1/employees',
    headers={
        'Authorization': f'Bearer {os.environ["TALIO_API_KEY"]}',
        'Content-Type': 'application/json'
    }
)
employees = response.json()`}
              />
            </div>
          </motion.div>

          {/* API Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={docsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white mb-8">API Endpoints</h3>
            <div className="space-y-3">
              {endpoints.map((ep) => (
                <div key={ep.path} className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shrink-0 ${
                    ep.method === 'GET'
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-white font-mono text-sm">{ep.path}</code>
                  <span className="text-gray-500 text-sm sm:ml-auto">{ep.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rate Limits + Error Codes */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={docsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-gray-900/60 border border-gray-800/60 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Rate Limits</h3>
              <div className="space-y-4">
                {rateLimits.map((rl) => (
                  <div key={rl.plan} className="flex items-center justify-between py-3 border-b border-gray-800/40 last:border-0">
                    <span className="text-white font-medium">{rl.plan}</span>
                    <span className="text-gray-400 text-sm">{rl.limit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={docsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900/60 border border-gray-800/60 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Error Codes</h3>
              <div className="space-y-3">
                {errorCodes.map((ec) => (
                  <div key={ec.code} className="flex items-center gap-3">
                    <code className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      ec.code === '200' ? 'bg-green-500/15 text-green-400' :
                      ec.code.startsWith('4') ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>{ec.code}</code>
                    <span className="text-gray-400 text-sm">{ec.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
