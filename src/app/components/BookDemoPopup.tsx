import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Sparkles, Shield, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { DemoBookingStepper } from '@/app/components/DemoBookingStepper';
import { createDemoBookingEmailPayload, sendDemoBookingEmail } from '@/app/components/demoBookingEmail';
import { createEmptyDemoBookingForm, type PlanInfo } from '@/app/components/demoBookingTypes';
import { submitSignup, enrichVisitorFromForm } from '@/lib/firebase';
import { getPageLabelFromPath } from '@/lib/leadAttribution';

export type { PlanInfo } from '@/app/components/demoBookingTypes';

interface BookDemoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planInfo?: PlanInfo | null;
}

export function BookDemoPopup({ isOpen, onClose, planInfo }: BookDemoPopupProps) {
  const location = useLocation();
  const [form, setForm] = useState(createEmptyDemoBookingForm());

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submissionData = {
        ...createDemoBookingEmailPayload(
          form,
          planInfo ? `pricing-${planInfo.name.toLowerCase()}` : 'book-demo-popup',
          planInfo,
        ),
        sourcePagePath: location.pathname,
        sourcePageName: getPageLabelFromPath(location.pathname),
      };

      await submitSignup(submissionData);
      await sendDemoBookingEmail(submissionData);
      enrichVisitorFromForm({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, phone: form.phone });

      setSubmitted(true);
      setForm(createEmptyDemoBookingForm());
    } catch {
      alert('We could not send your booking confirmation email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form after animation completes
    setTimeout(() => {
      setSubmitted(false);
    }, 300);
  };

  // Min date: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-700/40 bg-gray-900 shadow-2xl shadow-black/40"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700/50 bg-gray-800/80 text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-5 sm:p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <span className="block text-xl font-bold text-white mb-2">You're all set!</span>
                  <span className="block text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
                    Check your inbox for the confirmation. Our team will reach out with the next steps.
                  </span>
                  <button
                    onClick={handleClose}
                    className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-gray-100"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-5 pr-8">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Free Demo</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Book your guided walkthrough</h2>
                    <p className="mt-2 text-[13px] sm:text-sm text-gray-400 leading-relaxed">
                      See Talio in action — tailored to your team and workflow.
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Clock className="h-3 w-3 text-gray-600" /> 30 min session
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Shield className="h-3 w-3 text-gray-600" /> No commitment
                    </span>
                  </div>

                  <DemoBookingStepper
                    form={form}
                    onFieldChange={handleChange}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    submitted={submitted}
                    minDate={minDate}
                    submitLabel="Book Free Demo"
                    submittingLabel="Booking..."
                    planInfo={planInfo}
                    resetKey={`${isOpen}-${planInfo?.name ?? 'default'}`}
                    legalNotice={
                      <p className="text-center text-[11px] leading-relaxed text-gray-500">
                        By booking a demo you agree to our{' '}
                        <Link to="/terms" className="text-gray-400 underline hover:text-white transition-colors">Terms</Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-gray-400 underline hover:text-white transition-colors">Privacy Policy</Link>.
                      </p>
                    }
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
