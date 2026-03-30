import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { submitSignup } from '@/lib/firebase';

export interface PlanInfo {
  name: string;
  price: string;
  gradient: string;
}

interface BookDemoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planInfo?: PlanInfo | null;
}

export function BookDemoPopup({ isOpen, onClose, planInfo }: BookDemoPopupProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    preferredDate: '',
    preferredTime: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submissionData = {
        ...form,
        source: planInfo ? `pricing-${planInfo.name.toLowerCase()}` : 'book-demo-popup',
        selectedPlan: planInfo?.name || '',
        selectedPlanPrice: planInfo?.price || '',
        submittedAt: new Date().toISOString(),
      };

      await submitSignup(submissionData);

      // Send booking confirmation email
      try {
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });
      } catch {
        // Email send failure shouldn't block the booking
      }

      setSubmitted(true);
      setForm({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', jobTitle: '', industry: '', companySize: '',
        preferredDate: '', preferredTime: '',
      });
    } catch {
      alert('Something went wrong. Please try again.');
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

  const inputClass =
    'w-full rounded-xl border border-gray-700/60 bg-gray-800/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  const timeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM',
  ];

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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 md:p-8">
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
                  <div className="mb-6">
                    <span className="block text-xl font-semibold text-white mb-1">Book a Free Demo</span>
                    <span className="block text-sm text-gray-400">
                      Schedule a personalized demo with our team.
                    </span>
                  </div>

                  {planInfo && (
                    <div className={`mb-5 flex items-center gap-3 rounded-xl border border-gray-700/40 bg-gray-800/40 p-3.5`}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${planInfo.gradient}`}>
                        <span className="text-white text-xs font-bold">{planInfo.name[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-white">{planInfo.name} Plan</span>
                        <span className="block text-xs text-gray-400">{planInfo.price}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className={inputClass}
                        required
                      />
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Work Email"
                        className={inputClass}
                        required
                      />
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className={inputClass}
                        required
                      />
                      <input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        placeholder="Job Title"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <select
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="" disabled>Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </select>
                      <select
                        name="companySize"
                        value={form.companySize}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="" disabled>Company Size</option>
                        <option value="1-10">1–10</option>
                        <option value="11-50">11–50</option>
                        <option value="51-200">51–200</option>
                        <option value="201-500">201–500</option>
                        <option value="501+">501+</option>
                      </select>
                    </div>

                    {/* Calendar Booking */}
                    <div className="border border-gray-700/40 rounded-xl p-4 bg-gray-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">Schedule Your Demo</span>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">Preferred Date</label>
                          <input
                            type="date"
                            name="preferredDate"
                            value={form.preferredDate}
                            onChange={handleChange}
                            min={minDate}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">Preferred Time (IST)</label>
                          <select
                            name="preferredTime"
                            value={form.preferredTime}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          >
                            <option value="" disabled>Select Time</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || submitted}
                      className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10 disabled:opacity-60"
                    >
                      {submitting ? 'Booking Demo...' : 'Book Free Demo →'}
                    </button>

                    <p className="text-center text-xs text-gray-500">
                      By booking a demo you agree to our{' '}
                      <Link to="/terms" className="text-gray-400 underline hover:text-white">Terms</Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-gray-400 underline hover:text-white">Privacy Policy</Link>.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
