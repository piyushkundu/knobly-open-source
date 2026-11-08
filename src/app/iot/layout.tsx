import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IoT — Internet of Things Complete Course | O-Level M4-R5',
    description: 'Internet of Things (IoT) complete course — IoT architecture, sensors, actuators, Arduino, Raspberry Pi, smart devices, applications, protocols aur security. Hindi + English mein. O-Level M4-R5.',
    keywords: ['IoT', 'Internet of Things', 'IoT Hindi', 'Arduino', 'Raspberry Pi', 'IoT sensors', 'smart devices', 'O-Level IoT', 'M4-R5', 'NIELIT IoT'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
