import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { usePageMeta } from '@/app/hooks/usePageMeta';

const sections = [
  {
    title: "1. Agreement to Terms",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        By accessing or using Talio's services, you agree to be bound by these
        Terms of Service. These terms constitute a binding legal agreement
        between you and MW FutureTech, governed by the laws of India.
      </p>
    ),
  },
  {
    title: "2. Definitions",
    content: (
      <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
        <li>
          <span className="font-medium text-gray-300">"Service"</span> refers to
          the Talio workforce management platform
        </li>
        <li>
          <span className="font-medium text-gray-300">"User"</span> refers to
          any individual accessing the Service
        </li>
        <li>
          <span className="font-medium text-gray-300">"Organization"</span>{" "}
          refers to the company or entity subscribing to the Service
        </li>
        <li>
          <span className="font-medium text-gray-300">"Administrator"</span>{" "}
          refers to users with administrative privileges
        </li>
        <li>
          <span className="font-medium text-gray-300">"Content"</span> refers to
          any data, text, or materials uploaded to the Service
        </li>
      </ul>
    ),
  },
  {
    title: "3. Account Registration",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          When creating an account, you agree to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>Provide accurate and complete information</li>
          <li>Keep your credentials confidential</li>
          <li>Accept responsibility for all activity under your account</li>
          <li>Notify us immediately of any unauthorized access</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Acceptable Use",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          You agree NOT to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>Violate any applicable laws or regulations</li>
          <li>Impersonate any person or entity</li>
          <li>Upload malicious code or viruses</li>
          <li>Attempt unauthorized access to our systems</li>
          <li>Reverse engineer or decompile the Service</li>
          <li>Use the Service for fraudulent purposes</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Subscription & Payment",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">For paid plans:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>You agree to pay all applicable fees</li>
          <li>Provide valid payment information</li>
          <li>Subscriptions auto-renew unless cancelled</li>
          <li>Refunds are not provided except as required by law</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Data & Privacy",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        Your use of the Service is also governed by our Privacy Policy. By using
        the Service, you consent to the collection and use of data as described
        therein.
      </p>
    ),
  },
  {
    title: "7. Intellectual Property",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        All content, features, and functionality of the Service are owned by MW
        Umbrella and are protected by international copyright, trademark, and
        other intellectual property laws. You may not copy, modify, or distribute
        any part of the Service without prior written consent.
      </p>
    ),
  },
  {
    title: "8. Disclaimer of Warranties",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        The Service is provided "AS IS" and "AS AVAILABLE" without warranties of
        any kind, either express or implied, including but not limited to
        merchantability, fitness for a particular purpose, and non-infringement.
      </p>
    ),
  },
  {
    title: "9. Limitation of Liability",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        In no event shall MW FutureTech be liable for any indirect, incidental,
        special, consequential, or punitive damages arising from your use of the
        Service.
      </p>
    ),
  },
  {
    title: "10. Termination",
    content: (
      <>
        <p className="text-gray-400 leading-relaxed mb-3">
          We may terminate or suspend your account immediately for any breach of
          these Terms. Upon termination:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-400 leading-relaxed mb-4">
          <li>You have 30 days to export your data</li>
          <li>After 90 days, all data will be permanently deleted</li>
        </ul>
      </>
    ),
  },
  {
    title: "11. Governing Law",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        These Terms are governed by and construed in accordance with the laws of
        India. Any disputes shall be subject to the exclusive jurisdiction of the
        courts of Bangalore, Karnataka.
      </p>
    ),
  },
  {
    title: "12. Contact",
    content: (
      <p className="text-gray-400 leading-relaxed mb-4">
        For questions about these Terms, contact us at{" "}
        <a
          href="mailto:legal@talio.app"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          legal@talio.app
        </a>
      </p>
    ),
  },
];

export function TermsOfService() {
  usePageMeta('Terms of Service', 'Talio\'s terms of service. Review the terms and conditions for using our AI-powered workforce management platform.');

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
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
          Terms of Service
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
