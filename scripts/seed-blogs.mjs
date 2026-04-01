const DB_URL = 'https://talio-b936d-default-rtdb.asia-southeast1.firebasedatabase.app';

const AUTHOR_EMAIL = 'avi2001raj@gmail.com';
const AUTHOR_NAME = 'Aviraj';

function estimateReadTime(html) {
  const text = html.replace(/<[^>]*>/g, '').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const posts = [
  {
    title: 'How Talio Transforms Attendance Tracking with GPS, Geofencing & Facial Recognition',
    slug: 'talio-transforms-attendance-tracking-gps-geofencing-facial-recognition',
    metaDescription: 'Discover how Talio\'s smart attendance system uses GPS check-ins, geofencing, and AI-powered facial recognition to eliminate buddy punching, reduce errors, and automate workforce tracking for modern teams.',
    featuredImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&auto=format',
    tags: ['Attendance', 'GPS Tracking', 'AI', 'Workforce Management'],
    content: `
<p>Attendance tracking has come a long way from paper registers and manual punch cards. In today's fast-paced work environment — with hybrid teams, field staff, and multi-location operations — businesses need something far more intelligent. That's where <strong>Talio's Smart Attendance</strong> system steps in.</p>

<h2>The Problem with Traditional Attendance Systems</h2>

<p>Manual attendance tracking is plagued by inaccuracies. Buddy punching, forgotten check-ins, and human error lead to payroll discrepancies and lost productivity. According to the American Payroll Association, buddy punching alone costs employers an estimated 2.2% of gross payroll annually.</p>

<p>For companies with field workers or multiple offices, the problem compounds — there's simply no reliable way to verify that employees are where they claim to be, when they claim to be there.</p>

<h2>GPS Check-ins: Know Where Your Team Is, Always</h2>

<p>Talio's GPS-based attendance captures <strong>real-time location data</strong> every time an employee clocks in or out. This includes:</p>

<ul>
<li><strong>Automatic address detection</strong> — no manual entry needed</li>
<li><strong>Complete location history</strong> — review routes and visit timelines for field staff</li>
<li><strong>Real-time team map</strong> — see all active employees on a live dashboard</li>
</ul>

<p>For businesses with delivery fleets, sales teams, or service technicians, this is a game-changer. Managers get full visibility without micromanaging, and employees can check in with a single tap on their phone.</p>

<h2>Geofencing: Automated Clock-In Within Virtual Boundaries</h2>

<p>Talio allows you to draw <strong>custom geofences</strong> — virtual perimeters around your offices, warehouses, or client sites. Once an employee enters (or exits) these zones, attendance is logged automatically.</p>

<blockquote>
<p>"With Talio's geofencing, our warehouse team doesn't even think about clocking in anymore. It just happens when they walk through the door." — Operations Manager, Logistics Company</p>
</blockquote>

<p>Key capabilities include:</p>

<ul>
<li><strong>Multi-location geofences</strong> — perfect for franchises and distributed teams</li>
<li><strong>Configurable radius</strong> — set zones as tight as a single floor or as wide as a campus</li>
<li><strong>Auto clock-in/out</strong> — zero friction for employees, zero gaps for managers</li>
</ul>

<h2>AI-Powered Facial Recognition: End Buddy Punching Forever</h2>

<p>Talio's facial recognition technology uses <strong>advanced AI with anti-spoofing measures</strong> to verify identity at the point of check-in. It works instantly on any smartphone camera — no special hardware required.</p>

<ul>
<li><strong>Liveness detection</strong> — prevents photo or video spoofing attempts</li>
<li><strong>Privacy-first design</strong> — biometric data is encrypted and never shared</li>
<li><strong>Works offline</strong> — captures verification locally and syncs when connected</li>
</ul>

<p>The result? <strong>98% accuracy</strong> in attendance records and complete elimination of time theft.</p>

<h2>The Real-Time Dashboard That Ties It All Together</h2>

<p>All of this feeds into Talio's <strong>live attendance dashboard</strong>, where HR teams and managers can see:</p>

<ul>
<li>Who's checked in, who's late, who's absent — updated in real time</li>
<li>Department-wise and location-wise attendance breakdowns</li>
<li>Automated reports ready for payroll integration</li>
<li>Instant alerts for anomalies (unexpected absences, unusual check-in patterns)</li>
</ul>

<h2>Setup in 5 Minutes, Savings from Day One</h2>

<p>Unlike legacy attendance systems that require months of implementation, Talio's smart attendance deploys in under 5 minutes. Import your team, set your policies, and go live. Businesses report saving <strong>50% of time</strong> previously spent on attendance administration — time that can be redirected to strategic HR initiatives.</p>

<h2>Who Benefits Most?</h2>

<p>Talio's attendance system is designed for:</p>

<ul>
<li><strong>Small businesses</strong> — simple, mobile-first setup with no IT overhead</li>
<li><strong>Enterprise organizations</strong> — multi-location support, role-based access, audit trails</li>
<li><strong>Remote & hybrid teams</strong> — timezone-aware tracking with flexible policies</li>
<li><strong>Field operations</strong> — GPS verification for delivery, sales, and service teams</li>
</ul>

<p>If your organization still relies on honor systems or outdated punch machines, it's time for an upgrade. <strong>Talio makes attendance invisible for employees and insightful for managers.</strong></p>
`,
  },
  {
    title: 'Automating Payroll with Talio: Zero Errors, One-Click Payslips, and Full Compliance',
    slug: 'automating-payroll-talio-zero-errors-one-click-payslips-compliance',
    metaDescription: 'Learn how Talio\'s automated payroll system eliminates manual calculations, ensures tax compliance with TDS and PF/ESI, generates one-click payslips, and saves HR teams 80% of processing time.',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format',
    tags: ['Payroll', 'Automation', 'HR Tech', 'Compliance'],
    content: `
<p>Payroll is the backbone of employee trust. Get it wrong, and you erode confidence faster than any policy change ever could. Yet for many companies, payroll day is still a stressful marathon of spreadsheets, manual calculations, and last-minute corrections. <strong>Talio's Auto Payroll</strong> changes all of that.</p>

<h2>Why Manual Payroll Is a Business Risk</h2>

<p>A single payroll error doesn't just cost money — it costs trust. Studies show that 49% of employees will start looking for a new job after experiencing just two payroll errors. Beyond employee satisfaction, manual payroll creates:</p>

<ul>
<li><strong>Compliance risks</strong> — miscalculated taxes can lead to penalties</li>
<li><strong>Time drain</strong> — HR teams spend 5-10 days per month on payroll processing</li>
<li><strong>Audit vulnerabilities</strong> — inconsistent records make audits painful</li>
</ul>

<h2>How Talio Automates End-to-End Payroll</h2>

<p>Talio's payroll engine connects directly to your <strong>attendance data, leave records, and overtime calculations</strong> — so salaries are computed automatically based on actual working hours and company policies.</p>

<h3>Intelligent Salary Calculations</h3>

<p>Every pay cycle, Talio automatically:</p>

<ul>
<li>Pulls attendance and leave data for each employee</li>
<li>Applies overtime rules, shift differentials, and bonus structures</li>
<li>Calculates deductions based on your configured salary components</li>
<li>Handles pro-rated salaries for new joiners and exits</li>
</ul>

<p>The entire process runs with <strong>99.9% accuracy</strong> — verified against your company's custom salary structure, grade-wise settings, and CTC breakdown.</p>

<h3>Built-In Tax Compliance</h3>

<p>Talio handles the compliance complexity so you don't have to:</p>

<ul>
<li><strong>Automatic TDS calculation</strong> — based on declared investments and income slabs</li>
<li><strong>PF & ESI deductions</strong> — configured once, applied consistently every month</li>
<li><strong>Form 16 generation</strong> — annual tax certificates generated with one click</li>
<li><strong>Statutory reporting</strong> — ready-made reports for government filings</li>
</ul>

<h3>One-Click Payslips</h3>

<p>Gone are the days of manually creating payslip PDFs. Talio generates <strong>professional, branded payslips</strong> for every employee automatically. Features include:</p>

<ul>
<li>Customizable templates matching your company branding</li>
<li>Automatic email delivery to employees on pay day</li>
<li>Digital signatures for authenticity</li>
<li>Employee self-service portal for payslip history</li>
</ul>

<h3>Seamless Bank Transfers</h3>

<p>Talio integrates with major banking systems for <strong>direct salary disbursement</strong>:</p>

<ul>
<li>Multi-bank support for diverse employee preferences</li>
<li>Batch processing for faster payouts</li>
<li>Real-time transfer tracking and confirmation</li>
<li>Complete audit trail for every transaction</li>
</ul>

<h2>The Numbers Speak for Themselves</h2>

<p>Companies using Talio's payroll automation report:</p>

<ul>
<li><strong>80% reduction</strong> in payroll processing time</li>
<li><strong>Zero payroll errors</strong> in month-over-month processing</li>
<li><strong>100% compliance</strong> with statutory requirements</li>
<li><strong>3x faster</strong> audit preparation</li>
</ul>

<h2>From Payroll Headache to Strategic Advantage</h2>

<p>When payroll runs itself, your HR team is freed up to focus on what actually matters — employee engagement, talent development, and organizational growth. Talio doesn't just process salaries; it transforms payroll from a monthly burden into a <strong>seamless, invisible, and perfectly reliable</strong> operation.</p>

<p>Whether you're a startup with 10 employees or an enterprise with 10,000+, Talio scales with you — delivering the same precision, compliance, and simplicity at every level.</p>
`,
  },
  {
    title: 'Meet MIRA: How Talio\'s AI Assistant Is Redefining HR Operations',
    slug: 'meet-MIRA-talio-ai-assistant-redefining-hr-operations',
    metaDescription: 'Explore MIRA, Talio\'s AI-powered HR assistant that answers workforce queries instantly, generates smart reports, predicts trends, and automates repetitive HR tasks — available 24/7 in 50+ languages.',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format',
    tags: ['MIRA AI', 'Artificial Intelligence', 'HR Automation', 'Innovation'],
    content: `
<p>What if your HR department had an assistant that never sleeps, answers any question in seconds, understands 50+ languages, and gets smarter every single day? That's not a futuristic fantasy — that's <strong>MIRA</strong>, Talio's built-in AI assistant.</p>

<h2>The HR Knowledge Bottleneck</h2>

<p>In most organizations, HR teams are the go-to for everything — leave balances, payslip queries, policy clarifications, approval statuses, and a hundred other questions that pile up daily. This creates a bottleneck where:</p>

<ul>
<li>Employees wait hours (or days) for simple answers</li>
<li>HR professionals spend 60%+ of their time on repetitive queries</li>
<li>Critical strategic work gets deprioritized</li>
</ul>

<p>MIRA eliminates this bottleneck entirely.</p>

<h2>Natural Language Queries: Just Ask</h2>

<p>MIRA understands natural language, which means employees can ask questions the way they'd ask a colleague:</p>

<ul>
<li><em>"How many leaves do I have left?"</em></li>
<li><em>"Show me the attendance report for my team this month"</em></li>
<li><em>"What's our company's work from home policy?"</em></li>
<li><em>"Generate a payroll summary for Q1"</em></li>
</ul>

<p>MIRA processes the query, pulls data from the relevant Talio modules, and delivers an accurate answer — typically in <strong>under 3 seconds</strong>. With <strong>95% query accuracy</strong> and context awareness, it gets better at understanding your organization's specific language and patterns over time.</p>

<h2>Instant Reports Without the Spreadsheet Gymnastics</h2>

<p>Need a report? Instead of navigating dashboards, applying filters, and exporting data, just tell MIRA what you need:</p>

<blockquote>
<p>"MIRA, create a department-wise attendance comparison for the last quarter with a chart"</p>
</blockquote>

<p>MIRA generates the report complete with <strong>auto-generated charts</strong>, ready to export as PDF or Excel. Custom templates ensure reports match your company's formatting preferences, and you can schedule recurring reports to be generated and delivered automatically.</p>

<h2>Predictive Insights That Keep You Ahead</h2>

<p>MIRA doesn't just answer questions — it <strong>proactively surfaces insights</strong> that matter:</p>

<ul>
<li><strong>Trend analysis</strong> — identify patterns in absenteeism, overtime, and attrition before they become problems</li>
<li><strong>Predictive alerts</strong> — get warned about potential compliance issues or budget overruns</li>
<li><strong>Anomaly detection</strong> — unusual patterns (like a sudden spike in leave requests) are flagged instantly</li>
</ul>

<p>This transforms HR from a reactive function into a <strong>strategic, data-driven powerhouse</strong>.</p>

<h2>Task Automation: Set It and Forget It</h2>

<p>MIRA can handle repetitive tasks autonomously:</p>

<ul>
<li><strong>Smart reminders</strong> — nudge employees about pending timesheets, upcoming reviews, or expiring documents</li>
<li><strong>Recurring task setup</strong> — create monthly workflows with a simple conversation</li>
<li><strong>Workflow triggers</strong> — "MIRA, whenever a new employee joins, send them the onboarding checklist and notify their manager"</li>
</ul>

<h2>Employee Self-Service: Empowerment at Scale</h2>

<p>For employees, MIRA serves as a <strong>24/7 self-service portal</strong>. No more waiting for HR to respond to basic queries:</p>

<ul>
<li>Check leave balances and apply for time off</li>
<li>Download payslips and tax documents</li>
<li>Understand company policies and benefits</li>
<li>Get onboarding guidance for new joiners</li>
</ul>

<p>Available in <strong>50+ languages</strong>, MIRA ensures that every team member — regardless of location or language — has equal access to information.</p>

<h2>A Learning AI That Grows With Your Organization</h2>

<p>What makes MIRA truly special is its ability to <strong>learn from your organization's data</strong>. The more your team uses Talio, the smarter MIRA becomes — offering increasingly personalized and contextually relevant responses.</p>

<p>MIRA represents the future of HR technology — where artificial intelligence doesn't replace human HR professionals, but <strong>amplifies their impact</strong> by handling the routine so they can focus on the strategic. It's not just an assistant; it's your HR team's most reliable colleague.</p>
`,
  },
  {
    title: 'From Chaos to Clarity: Managing Projects, Goals & OKRs with Talio',
    slug: 'managing-projects-goals-okrs-with-talio',
    metaDescription: 'See how Talio\'s integrated project management and OKR tracking system helps teams deliver 40% faster with Kanban boards, goal alignment, weekly check-ins, and real-time progress analytics.',
    featuredImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80&auto=format',
    tags: ['Project Management', 'OKRs', 'Goals', 'Team Productivity'],
    content: `
<p>Great teams don't just work hard — they work <strong>aligned</strong>. But alignment is where most organizations struggle. Projects run in silos, goals get set and forgotten, and nobody can articulate how their daily work connects to the company's big picture. Talio's integrated <strong>Project Management and OKR system</strong> solves this by connecting every task to a larger purpose.</p>

<h2>The Alignment Problem</h2>

<p>Research from MIT Sloan shows that only 28% of executives and middle managers responsible for executing strategy can list three of their company's strategic priorities. If leadership can't keep track, imagine the disconnect at the team level.</p>

<p>This misalignment manifests as:</p>

<ul>
<li>Teams working on low-impact tasks while strategic goals stall</li>
<li>Duplicate work across departments</li>
<li>Missed deadlines due to unclear priorities</li>
<li>Performance reviews that feel disconnected from actual contributions</li>
</ul>

<h2>Talio's Project Management: Visual, Collaborative, Powerful</h2>

<p>Talio gives every team a <strong>flexible project workspace</strong> that adapts to how they work:</p>

<h3>Kanban Boards</h3>
<p>Visual boards with drag-and-drop simplicity let teams see the full picture at a glance. Custom columns, WIP limits, and swimlanes keep work organized without overwhelming anyone.</p>

<h3>Rich Task Management</h3>
<p>Every task in Talio is a complete work unit:</p>

<ul>
<li><strong>Subtasks & checklists</strong> — break complex work into manageable steps</li>
<li><strong>File attachments</strong> — keep assets, documents, and references with the task</li>
<li><strong>Priority levels</strong> — distinguish urgent from important</li>
<li><strong>Multiple assignees</strong> — collaborative tasks with workload balancing</li>
</ul>

<h3>Timeline & Gantt Views</h3>
<p>For teams that need to plan across weeks and months, Talio's timeline view provides <strong>Gantt charts with milestone markers</strong> — making dependencies visible and deadline management effortless.</p>

<h3>Real-Time Collaboration</h3>
<p>Threaded comments with @mentions, activity logs, and automated notifications keep everyone in sync without the chaos of email threads or scattered Slack messages.</p>

<h2>Goals & OKRs: Connecting Daily Work to Company Strategy</h2>

<p>Here's where Talio goes beyond typical project management tools. Its <strong>built-in OKR framework</strong> lets you set objectives at every level:</p>

<ul>
<li><strong>Company-level goals</strong> — the north star that guides everything</li>
<li><strong>Team objectives</strong> — department-specific targets aligned to company goals</li>
<li><strong>Individual key results</strong> — personal metrics that roll up to team objectives</li>
</ul>

<h3>Visual Goal Alignment</h3>
<p>Talio's <strong>alignment view</strong> shows how goals cascade from the top down, so every team member can see exactly how their work contributes to the bigger picture. Dependency mapping ensures no goal exists in isolation.</p>

<h3>Weekly Check-ins</h3>
<p>Rather than waiting for quarterly reviews to discover problems, Talio encourages <strong>weekly check-ins</strong> where team members:</p>

<ul>
<li>Update progress on their key results</li>
<li>Flag blockers before they become crises</li>
<li>Celebrate wins to maintain momentum</li>
<li>Use confidence scoring to signal early risk</li>
</ul>

<h3>Progress Dashboard & Analytics</h3>
<p>Talio's goal dashboard provides at-a-glance health indicators for every objective:</p>

<ul>
<li><strong>Burndown charts</strong> — are you on track?</li>
<li><strong>Velocity metrics</strong> — how fast is your team delivering?</li>
<li><strong>Risk alerts</strong> — which goals are at risk of missing their target?</li>
<li><strong>Quarterly reviews</strong> — auto-scoring with retrospective tools for continuous improvement</li>
</ul>

<h2>The Impact: Teams That Deliver</h2>

<p>Organizations using Talio's integrated project and OKR system report:</p>

<ul>
<li><strong>40% faster project delivery</strong></li>
<li><strong>3x improvement in goal achievement rates</strong></li>
<li><strong>100% visibility</strong> into what every team is working on</li>
<li><strong>Significant reduction</strong> in misaligned or duplicated effort</li>
</ul>

<p>The magic isn't in any single feature — it's in the <strong>integration</strong>. When projects, tasks, goals, and performance data all live in one system, clarity replaces chaos. Everyone knows what matters, what's on track, and where to focus next.</p>

<p>That's the Talio difference: <strong>not just tools, but alignment.</strong></p>
`,
  },
  {
    title: 'Why Growing Companies Are Switching to Talio for Unified Workforce Management',
    slug: 'why-growing-companies-switching-talio-unified-workforce-management',
    metaDescription: 'Find out why fast-growing companies are replacing fragmented HR tools with Talio — a single platform for attendance, payroll, leave, projects, goals, chat, and AI automation that scales from 5 to 10,000+ employees.',
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format',
    tags: ['Workforce Management', 'Scaling', 'HR Platform', 'SaaS'],
    content: `
<p>Here's a scenario that plays out in thousands of growing companies: you started with a spreadsheet for attendance, added a separate tool for payroll, another for leave tracking, project management in yet another app, and team chat happening across three different platforms. Before you know it, your "HR tech stack" is a <strong>Frankenstein of disconnected tools</strong> — each solving one problem while creating three new ones.</p>

<p>This is exactly why growing companies are switching to <strong>Talio</strong>.</p>

<h2>The Hidden Cost of Tool Fragmentation</h2>

<p>Most companies don't realize how expensive their disconnected tools are until they add up the costs:</p>

<ul>
<li><strong>Direct costs</strong> — 5-8 separate subscriptions, each with their own per-user pricing</li>
<li><strong>Integration costs</strong> — custom APIs, Zapier workflows, and IT maintenance to keep data flowing</li>
<li><strong>Training costs</strong> — every new hire needs to learn multiple systems</li>
<li><strong>Time costs</strong> — managers switching between 4-5 dashboards to get a complete picture</li>
<li><strong>Data quality costs</strong> — inconsistencies between systems leading to errors and disputes</li>
</ul>

<p>A mid-sized company with 200 employees typically spends <strong>$40,000-80,000 annually</strong> on disparate workforce tools — not counting the hidden productivity loss.</p>

<h2>Talio: One Platform, Everything You Need</h2>

<p>Talio replaces the entire stack with a <strong>single, integrated platform</strong> that covers:</p>

<ul>
<li><strong>Smart Attendance</strong> — GPS, geofencing, facial recognition, real-time dashboard</li>
<li><strong>Auto Payroll</strong> — salary calculations, tax compliance, one-click payslips, bank transfers</li>
<li><strong>Leave Management</strong> — one-tap requests, smart approvals, balance tracking, policy compliance</li>
<li><strong>Project Management</strong> — Kanban boards, task management, timelines, progress analytics</li>
<li><strong>Goals & OKRs</strong> — objective setting, key results, alignment views, weekly check-ins</li>
<li><strong>AI Workflows</strong> — no-code automation with 50+ pre-built templates</li>
<li><strong>MIRA AI</strong> — intelligent assistant for queries, reports, and insights</li>
<li><strong>Team Chat</strong> — channels, direct messages, file sharing, integrated notifications</li>
</ul>

<h2>Why Integration Matters More Than Features</h2>

<p>The real power of Talio isn't that it has all these features — it's that they all <strong>talk to each other seamlessly</strong>:</p>

<ul>
<li>Attendance data flows directly into payroll calculations — no exports, no imports, no reconciliation</li>
<li>Leave approvals automatically update team calendars and project timelines</li>
<li>Task completions roll up into OKR progress with zero manual tracking</li>
<li>MIRA AI has access to everything, so it can answer cross-functional queries instantly</li>
<li>Team chat integrates with all modules — get leave updates, task notifications, and approvals right in your conversations</li>
</ul>

<blockquote>
<p>"We replaced Slack, Asana, Zoho Payroll, and two other tools with Talio. Our monthly software bill dropped by 60%, but more importantly, our HR team got 15 hours per week back." — Head of Operations, 150-person SaaS Company</p>
</blockquote>

<h2>Scaling Without Breaking</h2>

<p>What makes Talio particularly attractive for growing companies is its <strong>ability to scale</strong>:</p>

<h3>Start Small</h3>
<p>With a <strong>5-minute setup</strong> and intuitive mobile app, a startup with 5 employees can be up and running instantly. No IT team required, no complex configurations.</p>

<h3>Grow Confidently</h3>
<p>As you add people, departments, and locations, Talio grows with you — same platform, same experience, just more capacity. Features like <strong>multi-location support, role-based access controls, and department hierarchies</strong> activate as you need them.</p>

<h3>Enterprise Ready</h3>
<p>At the enterprise level (10,000+ employees), Talio delivers:</p>

<ul>
<li>SSO and enterprise authentication</li>
<li>Dedicated account management</li>
<li>Custom SLA with 99.9% uptime guarantee</li>
<li>Compliance and audit logs</li>
<li>Advanced API access for custom integrations</li>
</ul>

<h2>Global by Design</h2>

<p>With support for <strong>95+ countries</strong> and <strong>24+ timezones</strong>, Talio is built for the modern global workforce. Whether your team is in Mumbai, San Francisco, London, or distributed across all three — the experience is consistent, reliable, and localized.</p>

<h2>The Bottom Line</h2>

<p>Growing companies don't have time to manage a dozen tools and hope they play nice together. They need a platform that:</p>

<ul>
<li>Starts simple and scales infinitely</li>
<li>Unifies data across all HR functions</li>
<li>Automates the repetitive with AI</li>
<li>Delivers insights, not just information</li>
<li>Supports global teams without complexity</li>
</ul>

<p>That's Talio. One platform. Everything you need. <strong>From your first hire to your ten-thousandth.</strong></p>

<p>Join the 500+ enterprises and 50,000+ users who've already made the switch. The future of workforce management isn't a collection of tools — it's a <strong>single intelligent platform</strong>.</p>
`,
  },
];

async function seedBlogs() {
  const now = new Date().toISOString();

  for (const post of posts) {
    const readTime = estimateReadTime(post.content);
    const data = {
      title: post.title,
      slug: post.slug,
      metaDescription: post.metaDescription,
      content: post.content.trim(),
      featuredImage: post.featuredImage,
      tags: post.tags,
      status: 'published',
      authorEmail: AUTHOR_EMAIL,
      authorName: AUTHOR_NAME,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      readTimeMinutes: readTime,
    };

    const res = await fetch(`${DB_URL}/blogPosts.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(`Failed to post "${post.title}": ${res.statusText}`);
    } else {
      const result = await res.json();
      console.log(`✅ Published: "${post.title}" (${readTime} min read) → ${result.name}`);
    }
  }

  console.log('\nDone! All 5 blog posts published.');
}

seedBlogs().catch(console.error);
