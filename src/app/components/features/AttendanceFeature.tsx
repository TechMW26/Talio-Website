import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { MapPin, MapPinned, ScanFace, LayoutDashboard, Smartphone, FileText } from 'lucide-react';

export function AttendanceFeature() {
  return (
    <FeatureDetailPage
      badge="SMART ATTENDANCE"
      title="Smart Attendance"
      titleGradient="from-blue-400 to-cyan-400"
      subtitle="GPS check-ins with geofencing, facial recognition, and real-time tracking for accurate attendance management."
      accentColor="text-cyan-400"
      gradientFrom="to-cyan-950/30"
      stats={[
        { value: '98%', label: 'Accuracy' },
        { value: '5min', label: 'Setup Time' },
        { value: '50%', label: 'Time Saved' },
        { value: '24/7', label: 'Real-time Tracking' },
      ]}
      features={[
        {
          icon: MapPin,
          title: 'GPS Check-ins',
          description: 'Real-time location verification with address auto-detection and complete history.',
          details: ['Real-time location', 'Address auto-detection', 'Location history'],
        },
        {
          icon: MapPinned,
          title: 'Geofencing',
          description: 'Custom virtual zones with auto clock-in/out and multi-location support.',
          details: ['Custom zones', 'Auto clock-in/out', 'Multiple locations'],
        },
        {
          icon: ScanFace,
          title: 'Facial Recognition',
          description: 'AI-powered face verification with anti-spoofing and privacy protection.',
          details: ['AI-powered', 'Anti-spoofing', 'Privacy-first'],
        },
        {
          icon: LayoutDashboard,
          title: 'Real-time Dashboard',
          description: 'Live attendance feed with team overview and instant notification system.',
          details: ['Live feed', 'Team overview', 'Instant notifications'],
        },
        {
          icon: Smartphone,
          title: 'Mobile App',
          description: 'Full attendance features offline with push notifications and quick widget.',
          details: ['Offline mode', 'Push notifications', 'Quick widget'],
        },
        {
          icon: FileText,
          title: 'Automated Reports',
          description: 'Custom report builder with scheduled exports and payroll integration.',
          details: ['Custom builder', 'Scheduled exports', 'Payroll integration'],
        },
      ]}
      steps={[
        { step: '1', title: 'Set Up Locations', description: 'Configure your office locations and geofence boundaries.' },
        { step: '2', title: 'Invite Team', description: 'Add your team members and assign them to locations.' },
        { step: '3', title: 'Start Tracking', description: 'Begin tracking attendance with real-time GPS verification.' },
      ]}
      testimonial={{
        quote: "Talio's attendance system has completely transformed how we track our team. The GPS and facial recognition features give us incredible accuracy.",
        author: 'Sarah Johnson',
        role: 'HR Director, TechCorp Inc.',
      }}
    />
  );
}
