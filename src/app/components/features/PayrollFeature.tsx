import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { Calculator, Receipt, FileOutput, Landmark, History, Settings } from 'lucide-react';

export function PayrollFeature() {
  return (
    <FeatureDetailPage
      badge="AUTO PAYROLL"
      title="Auto Payroll"
      titleGradient="from-green-400 to-emerald-400"
      subtitle="Automated salary calculations, tax deductions, and payslip generation — error-free and on time."
      accentColor="text-emerald-400"
      gradientFrom="to-emerald-950/30"
      stats={[
        { value: '99.9%', label: 'Accuracy' },
        { value: '80%', label: 'Time Saved' },
        { value: '₹0', label: 'Errors' },
        { value: '1-Click', label: 'Payslips' },
      ]}
      features={[
        {
          icon: Calculator,
          title: 'Auto Calculations',
          description: 'Salary based on attendance data, overtime rules, and custom formulas.',
          details: ['Attendance-based', 'Overtime rules', 'Custom formulas'],
        },
        {
          icon: Receipt,
          title: 'Tax Compliance',
          description: 'Automatic TDS calculation, PF/ESI handling, and Form 16 generation.',
          details: ['Auto TDS', 'PF/ESI', 'Form 16'],
        },
        {
          icon: FileOutput,
          title: 'Payslip Generation',
          description: 'Customizable templates with auto email delivery and digital signatures.',
          details: ['Custom templates', 'Auto email', 'Digital signatures'],
        },
        {
          icon: Landmark,
          title: 'Bank Transfers',
          description: 'Multi-bank support with batch processing and real-time payment tracking.',
          details: ['Multi-bank', 'Batch processing', 'Payment tracking'],
        },
        {
          icon: History,
          title: 'Payroll History',
          description: 'Complete historical records with comparison reports and trend analysis.',
          details: ['Historical records', 'Comparison reports', 'Trend analysis'],
        },
        {
          icon: Settings,
          title: 'Custom Salary Structure',
          description: 'Flexible components with grade-wise settings and full CTC breakdown.',
          details: ['Flexible components', 'Grade-wise settings', 'CTC breakdown'],
        },
      ]}
      steps={[
        { step: '1', title: 'Configure Salary', description: 'Set up salary structures, components, and tax rules.' },
        { step: '2', title: 'Review & Approve', description: 'Review calculated payroll and approve for processing.' },
        { step: '3', title: 'Process Payment', description: 'Execute bank transfers and generate payslips automatically.' },
      ]}
      testimonial={{
        quote: 'Payroll used to take us 3 days. With Talio, it\'s done in hours with zero errors.',
        author: 'Rajesh Kumar',
        role: 'Finance Director, StartupHub',
      }}
    />
  );
}
