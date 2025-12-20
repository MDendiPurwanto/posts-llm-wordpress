import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dokumentasi',
    description: 'Dokumentasi teknis dan panduan penggunaan WP Content Architect.',
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
