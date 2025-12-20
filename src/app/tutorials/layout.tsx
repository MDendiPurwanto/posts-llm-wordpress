import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tutorial',
    description: 'Pelajari cara menggunakan WP Content Architect untuk otomatisasi konten WordPress Anda.',
};

export default function TutorialsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
