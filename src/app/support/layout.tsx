import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dukungan',
    description: 'Hubungi tim kami jika Anda membutuhkan bantuan dengan WP Content Architect.',
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
