// app/page.js
'use client';

import { useState, useEffect, CSSProperties } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster

export default function Home() {
  // State for main form
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  // State for configuration
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [wpApiUrl, setWpApiUrl] = useState('');
  const [wpUsername, setWpUsername] = useState('');
  const [wpAppPassword, setWpAppPassword] = useState('');
  const [openrouterApiKey, setOpenrouterApiKey] = useState('');
  const [openrouterModel, setOpenrouterModel] = useState('');
  const [configSaved, setConfigSaved] = useState(false);

  // Effect to load configuration from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('appConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setWpApiUrl(config.wpApiUrl || '');
        setWpUsername(config.wpUsername || '');
        setWpAppPassword(config.wpAppPassword || '');
        setOpenrouterApiKey(config.openrouterApiKey || '');
        setOpenrouterModel(config.openrouterModel || 'qwen/qwen3-235b-a22b:free');
        setConfigSaved(true);
      }
    }
  }, []);

  // Function to save configuration to localStorage
  const saveConfig = () => {
    if (typeof window !== 'undefined') {
      const config = {
        wpApiUrl,
        wpUsername,
        wpAppPassword,
        openrouterApiKey,
        openrouterModel,
      };
      localStorage.setItem('appConfig', JSON.stringify(config));
      setConfigSaved(true);
      toast.success('Configuration saved successfully!'); // Use toast for success
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPostUrl('');
    setGeneratedTitle('');
    setGeneratedContent('');

    // Check if all important configurations are filled
    if (!wpApiUrl || !wpUsername || !wpAppPassword || !openrouterApiKey || !openrouterModel) {
      toast.error('Please save your API configurations first!'); // Use toast for error
      setLoading(false);
      return;
    }

    try {
      // Step 1: Generate content with LLM
      toast.loading('Generating content with AI...'); // Use toast for loading
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

      toast.dismiss(); // Dismiss previous loading toast
      toast.loading('Content generated! Now sending to WordPress...'); // New loading toast

      // Step 2: Create post in WordPress
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
      toast.dismiss(); // Dismiss loading toast
      toast.success('Post created successfully in WordPress as a draft!'); // Use toast for success
      setPostUrl(result.postUrl);
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss(); // Dismiss any loading toasts
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`); // Use toast for error
      } else {
        toast.error('An unknown error occurred.'); // Use toast for unknown error
      }
      setGeneratedTitle('');
      setGeneratedContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Toaster /> {/* Add Toaster component */}
      <h1 style={styles.heading}>AI-Powered WordPress Post Generator</h1>
      <p style={styles.subheading}>
        Enter a prompt, let AI craft your content, and publish it as a draft to your WordPress site.
      </p>
      <p style={{ ...styles.subheading, fontSize: '1em', marginTop: '-15px', marginBottom: '35px' }}>
        Need help? See the <a href="https://organized-mochi-86e.notion.site/Dokumentasi-AI-Powered-WordPress-Post-Generator-20cf640ca2e980688aa1ccdc369acea4?pvs=141" target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'underline' }}>tutorial & docs</a> or <a href="https://organized-mochi-86e.notion.site/Dokumentasi-AI-Powered-WordPress-Post-Generator-20cf640ca2e980688aa1ccdc369acea4?pvs=141" style={{ color: '#0070f3', textDecoration: 'underline' }}>configure API</a>.
      </p>

         {/* Configuration Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading} onClick={() => setIsConfigOpen(!isConfigOpen)}>
          0. API Configuration
          <span style={styles.toggleArrow}>
            {isConfigOpen ? '▲' : '▼'}
          </span>
        </h2>
        {isConfigOpen && (
          <>
            {/* Bagian WordPress Base URL (Satu Baris Penuh) */}
            <div style={styles.fullWidthInput}> {/* Style baru untuk full width */}
              <label htmlFor="wpApiUrl" style={styles.label}>WordPress Base URL:</label>
              <input type="text" id="wpApiUrl" value={wpApiUrl} onChange={(e) => setWpApiUrl(e.target.value)}
                     placeholder="https://yourdomain.com atau https://sub.yourdomain.com" style={styles.input} />
            </div>

            {/* Bagian Grid 2 Kolom untuk Input Lainnya */}
            <div style={styles.gridContainer}> {/* Style baru untuk menampung grid */}
              <div>
                <label htmlFor="wpUsername" style={styles.label}>WP Username:</label>
                <input type="text" id="wpUsername" value={wpUsername} onChange={(e) => setWpUsername(e.target.value)}
                       placeholder="Your WordPress Username" style={styles.input} />
              </div>
              <div>
                <label htmlFor="wpAppPassword" style={styles.label}>WP Application Password:</label>
                <input type="password" id="wpAppPassword" value={wpAppPassword} onChange={(e) => setWpAppPassword(e.target.value)}
                       placeholder="lSos xxx xxx xxxx xxxx" style={styles.input} />
              </div>
              <div>
                <label htmlFor="openrouterApiKey" style={styles.label}>OpenRouter API Key:</label>
                <input type="password" id="openrouterApiKey" value={openrouterApiKey} onChange={(e) => setOpenrouterApiKey(e.target.value)}
                       placeholder="sk-or-..." style={styles.input} />
              </div>
              <div>
                <label htmlFor="openrouterModel" style={styles.label}>OpenRouter Model:</label>
                <input type="text" id="openrouterModel" value={openrouterModel} onChange={(e) => setOpenrouterModel(e.target.value)}
                       placeholder="qwen/qwen3-235b-a22b:free" style={styles.input} />
              </div>
            </div>
            <button onClick={saveConfig} style={{...styles.button, marginTop: '20px', backgroundColor: '#28a745'}}>
              {configSaved ? 'Config Saved!' : 'Save Configuration'}
            </button>
          </>
        )}
      </div>


      {/* Input Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>1. Tell AI What to Write</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="prompt" style={styles.label}>
            Topic/Prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="e.g., Manfaat meditasi untuk kesehatan mental dan cara memulainya untuk pemula."
            required
            style={styles.textarea}
          ></textarea>

          <button
            type="submit"
            disabled={loading || !prompt.trim() || !configSaved}
            style={{
              ...styles.button,
              backgroundColor: (loading || !configSaved) ? '#999' : '#0070f3',
              cursor: (loading || !configSaved) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating & Publishing...' : 'Generate & Publish Draft'}
          </button>
        </form>
      </div>

      {/* Generated Content Preview Section */}
      {generatedTitle && generatedContent && (
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>2. AI-Generated Content Preview</h2>
          <div style={styles.contentPreviewCard}>
            <h3 style={styles.contentTitle}>{generatedTitle}</h3>
            {postUrl && (
              <p style={{marginBottom: '15px'}}>
                <a href={postUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  View Draft in WordPress →
                </a>
              </p>
            )}
            <div
              style={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: generatedContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styles for a cleaner UI
const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    padding: '40px',
    maxWidth: '900px',
    margin: '30px auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    color: '#333'
  },
  heading: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  subheading: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.1em',
    marginBottom: '30px',
  },
  section: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    marginBottom: '25px',
    border: '1px solid #eee',
  },
  sectionHeading: {
    color: '#34495e',
    fontSize: '1.6em',
    marginBottom: '20px',
    borderBottom: '2px solid #ecf0f1',
    paddingBottom: '10px',
    cursor: 'pointer', // Make heading clickable for toggling
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleArrow: {
    fontSize: '0.8em',
    marginLeft: '10px',
  },
  fullWidthInput: {
    marginBottom: '15px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  input: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    fontSize: '1em',
    width: '100%',
    boxSizing: 'border-box',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '5px',
    display: 'block',
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #dcdcdc',
    fontSize: '1em',
    lineHeight: '1.5',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'border-color 0.3s ease',
  },
  button: {
    padding: '14px 25px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
  },
  // Removed messageBox as toasts will handle messages
  link: {
    color: '#0070f3',
    textDecoration: 'none',
    fontWeight: 'bold',
    // alignSelf: 'flex-start', // This might not be needed if moved inside content preview
    transition: 'color 0.3s ease',
  },
  contentPreviewCard: {
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fdfdfd',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  },
  contentTitle: {
    color: '#2c3e50',
    fontSize: '1.8em',
    marginBottom: '15px',
    borderBottom: '1px dashed #eee',
    paddingBottom: '10px',
  },
  contentBody: {
    maxHeight: '450px',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    padding: '15px',
    border: '1px solid #f0f0f0',
    lineHeight: '1.7',
    color: '#34495e',
  }
};