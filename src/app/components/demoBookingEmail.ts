import type { DemoBookingFormValues, PlanInfo } from '@/app/components/demoBookingTypes';

export interface DemoBookingEmailPayload extends DemoBookingFormValues {
  source: string;
  submittedAt?: string;
  selectedPlan?: string;
  selectedPlanPrice?: string;
}

export function createDemoBookingEmailPayload(
  form: DemoBookingFormValues,
  source: string,
  planInfo?: PlanInfo | null,
): DemoBookingEmailPayload {
  return {
    ...form,
    source,
    selectedPlan: planInfo?.name || '',
    selectedPlanPrice: planInfo?.price || '',
    submittedAt: new Date().toISOString(),
  };
}

export async function sendDemoBookingEmail(payload: DemoBookingEmailPayload) {
  const response = await fetch('/api/send-booking-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to send booking confirmation email.';

    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // Fall back to the default message when the error payload is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}