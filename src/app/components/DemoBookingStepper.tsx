import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';
import { demoTimeSlots, type DemoBookingFormValues, type PlanInfo } from '@/app/components/demoBookingTypes';

type FieldName = keyof DemoBookingFormValues;

interface DemoBookingStepperProps {
  form: DemoBookingFormValues;
  onFieldChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  submitted: boolean;
  minDate: string;
  submitLabel: string;
  submittingLabel: string;
  legalNotice?: ReactNode;
  planInfo?: PlanInfo | null;
  resetKey: string;
}

const steps = [
  {
    label: 'Personal',
    title: 'Personal details',
    description: 'Tell us who should receive the demo confirmation.',
    fields: ['firstName', 'lastName', 'email', 'phone'] as FieldName[],
  },
  {
    label: 'Company',
    title: 'Company details',
    description: 'Add the business context so the walkthrough stays relevant.',
    fields: ['company', 'jobTitle', 'industry', 'companySize'] as FieldName[],
  },
  {
    label: 'Timing',
    title: 'Schedule the demo',
    description: 'Pick the session slot that works best for your team.',
    fields: ['preferredDate', 'preferredTime'] as FieldName[],
  },
];

const inputClass =
  'w-full rounded-2xl border border-gray-800 bg-gray-950 px-3 py-2.5 text-[13px] text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

function StepInput(props: ComponentPropsWithoutRef<'input'>) {
  return <input {...props} className={inputClass} />;
}

function StepSelect(props: ComponentPropsWithoutRef<'select'>) {
  return <select {...props} className={inputClass} />;
}

export function DemoBookingStepper({
  form,
  onFieldChange,
  onSubmit,
  submitting,
  submitted,
  minDate,
  submitLabel,
  submittingLabel,
  legalNotice,
  planInfo,
  resetKey,
}: DemoBookingStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    setCurrentStep(0);
  }, [resetKey, submitted]);

  const isStepComplete = (stepIndex: number) =>
    steps[stepIndex].fields.every((field) => form[field].trim() !== '');

  const canOpenStep = (stepIndex: number) =>
    stepIndex <= currentStep || steps.slice(0, stepIndex).every((_, index) => isStepComplete(index));

  const goToPreviousStep = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (currentStep < steps.length - 1) {
      event.preventDefault();
      if (!isStepComplete(currentStep)) {
        event.currentTarget.reportValidity();
        return;
      }

      setCurrentStep((previous) => Math.min(previous + 1, steps.length - 1));
      return;
    }

    onSubmit(event);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {planInfo && (
        <div className="rounded-[1.5rem] border border-gray-700/50 bg-gray-800/35 p-3.5">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${planInfo.gradient}`}>
              <span className="text-xs font-bold text-white">{planInfo.name[0]}</span>
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-semibold text-white">{planInfo.name} Plan</span>
              <span className="block text-[11px] text-gray-400">{planInfo.price}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const complete = isStepComplete(index);

          return (
            <button
              key={step.label}
              type="button"
              disabled={!canOpenStep(index)}
              onClick={() => canOpenStep(index) && setCurrentStep(index)}
              className={`rounded-2xl border px-3 py-2 text-left transition ${
                active
                  ? 'border-white/20 bg-white/[0.08]'
                  : complete
                    ? 'border-emerald-500/20 bg-emerald-500/10'
                    : 'border-gray-800 bg-gray-950/70'
              } ${!canOpenStep(index) ? 'opacity-50' : ''}`}
            >
              <span className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${active ? 'text-blue-300' : complete ? 'text-emerald-300' : 'text-gray-500'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block text-[12px] font-medium text-white">{step.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-gray-800/80 bg-gray-950/70 p-4 md:p-5">
        <div className="flex items-start gap-3">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={goToPreviousStep}
              aria-label="Go back to previous step"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="mt-2 block text-lg font-semibold text-white">{steps[currentStep].title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-400">{steps[currentStep].description}</span>
          </div>
        </div>

        <div className="mt-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[currentStep].label}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {currentStep === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    <StepInput name="firstName" value={form.firstName} onChange={onFieldChange} placeholder="First Name" required />
                    <StepInput name="lastName" value={form.lastName} onChange={onFieldChange} placeholder="Last Name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    <StepInput name="email" type="email" value={form.email} onChange={onFieldChange} placeholder="Work Email" required />
                    <StepInput name="phone" type="tel" value={form.phone} onChange={onFieldChange} placeholder="Phone" required />
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    <StepInput name="company" value={form.company} onChange={onFieldChange} placeholder="Company Name" required />
                    <StepInput name="jobTitle" value={form.jobTitle} onChange={onFieldChange} placeholder="Job Title" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                    <StepSelect name="industry" value={form.industry} onChange={onFieldChange} required>
                      <option value="" disabled>Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </StepSelect>
                    <StepSelect name="companySize" value={form.companySize} onChange={onFieldChange} required>
                      <option value="" disabled>Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </StepSelect>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <div className="rounded-[1.5rem] border border-gray-800 bg-black/30 p-3.5 md:p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Schedule Your Demo</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="mb-1 block text-[11px] text-gray-500">Preferred Date</span>
                      <StepInput
                        type="date"
                        name="preferredDate"
                        value={form.preferredDate}
                        onChange={onFieldChange}
                        min={minDate}
                        required
                      />
                    </div>

                    <div>
                      <span className="mb-1 block text-[11px] text-gray-500">Preferred Time (IST)</span>
                      <StepSelect name="preferredTime" value={form.preferredTime} onChange={onFieldChange} required>
                        <option value="" disabled>Select Time</option>
                        {demoTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </StepSelect>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isStepComplete(currentStep) || submitting || submitted}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{isLastStep ? (submitting ? submittingLabel : submitLabel) : 'Next'}</span>
        {(!submitting || !isLastStep) && <ArrowRight className="h-4 w-4" />}
      </button>

      {legalNotice && <div className="pt-1">{legalNotice}</div>}
    </form>
  );
}