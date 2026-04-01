import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { usePageMeta } from '@/app/hooks/usePageMeta';

const sections = [
  {
    title: "1. Introduction",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        At Talio (operated by MW FutureTech), we are committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you use our productivity utility,
        related web and desktop applications, and connected HRMS add-on
        features.
      </p>
    ),
  },
  {
    title: "2. Information We Collect",
    content: (
      <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
        <li>
          <span className="font-medium text-gray-300">
            Personal Information:
          </span>{" "}
          Name, email address, employment information, profile photos, and
          payment or payroll-related details when your organization enables
          those workflows.
        </li>
        <li>
          <span className="font-medium text-gray-300">
            Attendance, Work, and Location Data:
          </span>{" "}
          Timestamps, approvals, task or coordination inputs, and optional GPS
          or geofence logs when your organization uses attendance or
          location-aware features.
        </li>
        <li>
          <span className="font-medium text-gray-300">Usage Data:</span> Device
          type, IP address, diagnostics, product interactions, and error logs to
          operate, secure, and improve the Service.
        </li>
      </ul>
    ),
  },
  {
    title: "3. How We Use Your Information",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>Provide, maintain, and support the Service</li>
          <li>Operate productivity, coordination, attendance, leave, payroll, and employee workflows</li>
          <li>Communicate with you about your account, updates, or support needs</li>
          <li>Analyze usage patterns to improve product quality and reliability</li>
          <li>Protect the Service, investigate misuse, and prevent fraud</li>
          <li>Comply with legal, contractual, and regulatory obligations</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Data Sharing",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          We may share your information with:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-3">
          <li>Your organization’s authorized administrators, managers, or operators, as configured</li>
          <li>Service providers who help us host, operate, secure, or support the Service</li>
          <li>Legal authorities when required by law</li>
        </ul>
        <p className="text-gray-400 leading-relaxed mb-4">
          We never sell your personal data to third parties.
        </p>
      </>
    ),
  },
  {
    title: "5. Data Security",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          We protect your data with:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>Encryption in transit</li>
          <li>Encryption at rest where supported and appropriate</li>
          <li>Access controls and permission-based visibility</li>
          <li>Administrative, technical, and organizational safeguards</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Your Rights",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          You have the right to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Data portability</li>
          <li>Object to processing</li>
        </ul>
      </>
    ),
  },
  {
    title: "7. Data Retention",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        We retain your data for as long as necessary to provide our services.
        Upon account deletion, your data is permanently removed within 90 days.
      </p>
    ),
  },
  {
    title: "8. Changes to This Policy",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy and updating the "Last Updated"
        date.
      </p>
    ),
  },
  {
    title: "9. Contact Us",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        If you have questions about this Privacy Policy, please contact us at{" "}
        <a
          href="mailto:privacy@talio.app"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          privacy@talio.app
        </a>
      </p>
    ),
  },
];

export function PrivacyPolicy() {
  usePageMeta('Privacy Policy', 'Talio\'s privacy policy. Learn how we collect, use, and protect data used in our productivity utility and HRMS add-on workflows.');

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });
  const contentInView = useInView(contentRef, { once: true, margin: '-10%' });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pt-32 pb-16 text-center px-6 md:px-8 lg:px-12 flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10">
          ✦ LEGAL
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center">
          Privacy Policy
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-light text-center">Last updated: December 18, 2025</p>
      </motion.section>

      {/* Content */}
      <motion.section
        ref={contentRef}
        initial={{ opacity: 0, y: 30 }}
        animate={contentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 pb-32"
      >
        <div className="rounded-3xl bg-gray-900 border border-gray-800 p-8 md:p-12">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold text-white mb-4 mt-10 first:mt-0">
                {section.title}
              </h2>
              {section.content}
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
