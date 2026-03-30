export interface DemoBookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  industry: string;
  companySize: string;
  preferredDate: string;
  preferredTime: string;
}

export interface PlanInfo {
  name: string;
  price: string;
  gradient: string;
}

export const createEmptyDemoBookingForm = (): DemoBookingFormValues => ({
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

export const demoTimeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
];