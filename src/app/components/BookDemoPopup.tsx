import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { DemoBookingStepper } from '@/app/components/DemoBookingStepper';
import { createDemoBookingEmailPayload, sendDemoBookingEmail } from '@/app/components/demoBookingEmail';
import { createEmptyDemoBookingForm, type PlanInfo } from '@/app/components/demoBookingTypes';
import { submitSignup } from '@/lib/firebase';
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-[1.75rem] border border-gray-800 bg-gray-900 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 md:p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <span className="block text-xl font-semibold text-white mb-2">Demo Booked! 🎉</span>
                  <span className="block text-sm text-gray-400 mb-6 max-w-xs">
                    We've sent a confirmation to your email. Our team will reach out shortly.
                  </span>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <>
                  <span className="block text-xl font-semibold text-white">Book a Free Demo</span>
                  <span className="mt-1 block text-sm leading-relaxed text-gray-400">
                    Schedule a guided walkthrough tailored to your team and plan.
                  </span>

                  <div className="mt-5">
                    <DemoBookingStepper
                      form={form}
                      onFieldChange={handleChange}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      submitted={submitted}
                      minDate={minDate}
                      submitLabel="Book Free Demo"
                      submittingLabel="Booking Demo..."
                      planInfo={planInfo}
                      resetKey={`${isOpen}-${planInfo?.name ?? 'default'}`}
                      legalNotice={
                        <p className="text-center text-[11px] leading-relaxed text-gray-500">
                          By booking a demo you agree to our{' '}
                          <Link to="/terms" className="text-gray-400 underline hover:text-white">Terms</Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-gray-400 underline hover:text-white">Privacy Policy</Link>.
                        </p>
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
