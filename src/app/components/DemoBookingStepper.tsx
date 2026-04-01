import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, User, Building2, Clock, Sparkles, Check } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';
import { demoTimeSlots, type DemoBookingFormValues, type PlanInfo } from '@/app/components/demoBookingTypes';
import { DatePicker } from '@/app/components/ui/date-picker';
import { TimePicker } from '@/app/components/ui/time-picker';

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
    title: 'Your details',
    description: 'We\'ll send the confirmation here.',
    icon: User,
    fields: ['firstName', 'lastName', 'email', 'phone'] as FieldName[],
  },
  {
    label: 'Company',
    title: 'Your company',
    description: 'Helps us tailor the demo to your needs.',
    icon: Building2,
    fields: ['company', 'jobTitle', 'industry', 'companySize'] as FieldName[],
  },
  {
    label: 'Schedule',
    title: 'Pick a slot',
    description: 'Choose your preferred date and time.',
    icon: Clock,
    fields: ['preferredDate', 'preferredTime'] as FieldName[],
  },
];

const inputClass =
  'w-full rounded-xl border border-gray-700/60 bg-gray-950/80 px-4 py-3 text-[16px] md:text-[13px] text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15 hover:border-gray-600';

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
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {planInfo && (
        <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-r from-gray-800/40 to-gray-800/20 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${planInfo.gradient} shadow-lg`}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-semibold text-white">{planInfo.name} Plan</span>
              <span className="block text-[12px] text-gray-400">{planInfo.price}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step indicators */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const complete = isStepComplete(index);
          const StepIcon = step.icon;

          return (
            <button
              key={step.label}
              type="button"
              disabled={!canOpenStep(index)}
              onClick={() => canOpenStep(index) && setCurrentStep(index)}
              className={`group relative flex flex-1 items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-xl border px-2 sm:px-3 py-2.5 text-left transition-all duration-200 min-w-0 ${
                active
                  ? 'border-blue-500/30 bg-blue-500/[0.08] shadow-sm shadow-blue-500/5'
                  : complete
                    ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
                    : 'border-gray-800/60 bg-gray-950/40'
              } ${!canOpenStep(index) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-gray-600'}`}
            >
              <div className={`hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                active
                  ? 'bg-blue-500/20 text-blue-400'
                  : complete
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-gray-800/60 text-gray-500'
              }`}>
                {complete && !active ? <Check className="h-3.5 w-3.5" /> : <StepIcon className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 hidden sm:block">
                <span className={`block text-[10px] font-medium leading-none ${
                  active ? 'text-blue-300' : complete ? 'text-emerald-300' : 'text-gray-500'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-medium text-white/80">{step.label}</span>
              </div>
              {/* Mobile: just label */}
              <span className={`block sm:hidden text-xs font-semibold text-center w-full ${
                active ? 'text-blue-300' : complete ? 'text-emerald-300' : 'text-gray-500'
              }`}>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-[2px] w-full rounded-full bg-gray-800/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
          initial={false}
          animate={{ width: `${((currentStep + (isStepComplete(currentStep) ? 1 : 0.5)) / steps.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Step content card */}
      <div className="rounded-2xl border border-gray-800/60 bg-gradient-to-b from-gray-900/60 to-gray-950/80 p-4 md:p-5">
        <div className="flex items-center gap-3 mb-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={goToPreviousStep}
              aria-label="Go back to previous step"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-gray-400 transition-all hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          )}

          <div className="min-w-0">
            <span className="block text-base md:text-lg font-semibold text-white">{steps[currentStep].title}</span>
            <span className="block text-[12px] md:text-[13px] text-gray-400">{steps[currentStep].description}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={steps[currentStep].label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <StepInput name="firstName" value={form.firstName} onChange={onFieldChange} placeholder="First Name" required />
                  <StepInput name="lastName" value={form.lastName} onChange={onFieldChange} placeholder="Last Name" required />
                </div>
                <StepInput name="email" type="email" value={form.email} onChange={onFieldChange} placeholder="Work Email" required />
                <StepInput name="phone" type="tel" value={form.phone} onChange={onFieldChange} placeholder="Phone Number" required />
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <StepInput name="company" value={form.company} onChange={onFieldChange} placeholder="Company Name" required />
                  <StepInput name="jobTitle" value={form.jobTitle} onChange={onFieldChange} placeholder="Job Title" required />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-500">201–500 employees</option>
                    <option value="501+">501+ employees</option>
                  </StepSelect>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-800/50 bg-black/20 p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <span className="text-[13px] font-medium text-white">When works for you?</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-500">Preferred Date</span>
                      <DatePicker
                        name="preferredDate"
                        value={form.preferredDate}
                        onChange={(dateStr) =>
                          onFieldChange({
                            target: { name: 'preferredDate', value: dateStr },
                          } as ChangeEvent<HTMLInputElement>)
                        }
                        minDate={minDate}
                        placeholder="Pick a date"
                        required
                      />
                    </div>

                    <div>
                      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-500">Preferred Time (IST)</span>
                      <TimePicker
                        name="preferredTime"
                        value={form.preferredTime}
                        onChange={(timeStr) =>
                          onFieldChange({
                            target: { name: 'preferredTime', value: timeStr },
                          } as ChangeEvent<HTMLInputElement>)
                        }
                        slots={demoTimeSlots}
                        placeholder="Pick a time slot"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit / Next button */}
      <motion.button
        type="submit"
        disabled={!isStepComplete(currentStep) || submitting || submitted}
        whileHover={!submitting && isStepComplete(currentStep) ? { scale: 1.01 } : {}}
        whileTap={!submitting && isStepComplete(currentStep) ? { scale: 0.98 } : {}}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        <span>{isLastStep ? (submitting ? submittingLabel : submitLabel) : 'Continue'}</span>
        {(!submitting || !isLastStep) && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        {submitting && isLastStep && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </motion.button>

      {legalNotice && <div className="pt-0.5">{legalNotice}</div>}
    </form>
  );
}