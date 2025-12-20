'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ConfigSection from '@/components/ConfigSection';
import ContentForm from '@/components/ContentForm';
import PreviewSection from '@/components/PreviewSection';
import Link from 'next/link';

export default function Home() {
  // Main state
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  // Config state
  const [wpApiUrl, setWpApiUrl] = useState('');
  const [wpUsername, setWpUsername] = useState('');
  const [wpAppPassword, setWpAppPassword] = useState('');
  const [openrouterApiKey, setOpenrouterApiKey] = useState('');
  const [openrouterModel, setOpenrouterModel] = useState('google/gemini-2.0-flash-exp:free');
  const [configSaved, setConfigSaved] = useState(false);

  // Reset configSaved when values change
  useEffect(() => {
    setConfigSaved(false);
  }, [wpApiUrl, wpUsername, wpAppPassword, openrouterApiKey, openrouterModel]);

  // Load config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setWpApiUrl(config.wpApiUrl || '');
        setWpUsername(config.wpUsername || '');
        setWpAppPassword(config.wpAppPassword || '');
        setOpenrouterApiKey(config.openrouterApiKey || '');
        setOpenrouterModel(config.openrouterModel || 'google/gemini-2.0-flash-exp:free');

        // Wait for state updates to settle before checking if we should auto-save status
        if (config.wpApiUrl && config.wpUsername && config.wpAppPassword && config.openrouterApiKey) {
          setTimeout(() => setConfigSaved(true), 0);
        }
      } catch (e) {
        console.error('Failed to parse config', e);
      }
    }
  }, []);

  const saveConfig = () => {
    const config = {
      wpApiUrl,
      wpUsername,
      wpAppPassword,
      openrouterApiKey,
      openrouterModel,
    };
    localStorage.setItem('appConfig', JSON.stringify(config));
    setConfigSaved(true);
    toast.success('Configuration saved successfully!', {
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setPostUrl('');
    setGeneratedTitle('');
    setGeneratedContent('');

    const toastId = toast.loading('Starting process...');

    try {
      // Step 1: Generate content
      toast.loading('Generating content with AI...', { id: toastId });
      const generateResponse = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          openrouterApiKey,
          openrouterModel,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.details || 'Failed to generate content');
      }

      const { title, content } = await generateResponse.json();
      setGeneratedTitle(title);
      setGeneratedContent(content);

      // Step 2: WordPress Upload
      toast.loading('Content generated! Publishing to WordPress...', { id: toastId });

      const wpResponse = await fetch('/api/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          wpApiUrl,
          wpUsername,
          wpAppPassword,
        }),
      });

      if (!wpResponse.ok) {
        const errorData = await wpResponse.json();
        throw new Error(errorData.details || 'Failed to create post in WordPress');
      }

      const result = await wpResponse.json();
      setPostUrl(result.postUrl);
      toast.success('Post created as a draft!', { id: toastId });
    } catch (error: any) {
      console.error('Process error:', error);
      toast.error(error.message || 'An error occurred during the process', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            WP Content <span className="text-primary italic">Architect</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Transformasikan ide Anda menjadi postingan WordPress profesional menggunakan model AI canggih dan draf otomatis.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-medium pt-2">
            <Link href="/tutorials" className="text-primary hover:underline">Tutorial</Link>
            <span className="text-gray-300">•</span>
            <Link href="/support" className="text-primary hover:underline">Bantuan</Link>
            <span className="text-gray-300">•</span>
            <Link href="/docs" className="text-primary hover:underline">Dokumentasi</Link>
          </div>
        </header>

        {/* Configuration Section */}
        <ConfigSection
          wpApiUrl={wpApiUrl} setWpApiUrl={setWpApiUrl}
          wpUsername={wpUsername} setWpUsername={setWpUsername}
          wpAppPassword={wpAppPassword} setWpAppPassword={setWpAppPassword}
          openrouterApiKey={openrouterApiKey} setOpenrouterApiKey={setOpenrouterApiKey}
          openrouterModel={openrouterModel} setOpenrouterModel={setOpenrouterModel}
          saveConfig={saveConfig}
          configSaved={configSaved}
        />

        {/* Form Section */}
        <ContentForm
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          handleSubmit={handleSubmit}
          configSaved={configSaved}
        />

        {/* Results Section */}
        <PreviewSection
          title={generatedTitle}
          content={generatedContent}
          postUrl={postUrl}
        />

        {/* Footer */}
        <footer className="text-center py-12 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-sm font-semibold text-gray-900">
              Program Studi Informatika • Fakultas Teknik
            </p>
            <p className="text-sm text-muted">
              Universitas Majalengka
            </p>
          </div>
          <p className="text-xs text-muted/60 border-t border-gray-100 pt-6">
            &copy; {new Date().getFullYear()} WP Content Architect. Dibuat oleh <span className="text-primary font-medium">Dede Maulana</span>.
          </p>
        </footer>
      </div>
    </main>
  );
}