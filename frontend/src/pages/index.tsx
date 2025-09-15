import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check if backend is running
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        if (data.success) {
          setApiStatus('✅ Backend Connected');
        } else {
          setApiStatus('❌ Backend Error');
        }
      } catch (error) {
        setApiStatus('❌ Backend Offline');
      }
    };

    checkBackend();
  }, []);

  return (
    <>
      <Head>
        <title>Student Commute Optimizer</title>
        <meta name="description" content="A full-stack carpooling platform for students" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#2563eb', 
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2.5rem'
          }}>
            🚗 Student Commute Optimizer
          </h1>

          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>System Status</h2>
            <p><strong>Backend API:</strong> {apiStatus}</p>
            <p><strong>Frontend:</strong> ✅ React/Next.js Running</p>
            <p><strong>WebSocket:</strong> ✅ Ready for real-time chat</p>
          </div>

          <div style={{ 
            backgroundColor: '#fefce8', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid #eab308'
          }}>
            <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>🚧 Development Mode</h2>
            <p>This is the <strong>Student Commute Optimizer</strong> running in development mode. The application includes:</p>
            <ul style={{ marginTop: '1rem', color: '#92400e' }}>
              <li>✅ <strong>Full-stack architecture</strong> - Node.js backend + React frontend</li>
              <li>✅ <strong>Anonymous carpooling system</strong> for student privacy</li>
              <li>✅ <strong>Real-time chat functionality</strong> with WebSocket</li>
              <li>✅ <strong>Interactive map interface</strong> for route visualization</li>
              <li>✅ <strong>Route matching algorithm</strong> for finding compatible students</li>
              <li>✅ <strong>Security features</strong> - JWT auth, rate limiting, input validation</li>
            </ul>
          </div>

          <div style={{ 
            backgroundColor: '#f0f9ff', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid #0ea5e9'
          }}>
            <h2 style={{ color: '#0c4a6e', marginBottom: '1rem' }}>📋 Available Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h3 style={{ color: '#0369a1', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Core Features:</h3>
                <ul style={{ color: '#0c4a6e', fontSize: '0.9rem' }}>
                  <li>Student registration & login</li>
                  <li>Anonymous username system</li>
                  <li>Route planning & visualization</li>
                  <li>Student matching algorithm</li>
                  <li>Real-time messaging</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: '#0369a1', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Safety Features:</h3>
                <ul style={{ color: '#0c4a6e', fontSize: '0.9rem' }}>
                  <li>User reporting system</li>
                  <li>Content moderation</li>
                  <li>Email verification</li>
                  <li>Privacy protection</li>
                  <li>Secure authentication</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#f0fdf4', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid #22c55e'
          }}>
            <h2 style={{ color: '#15803d', marginBottom: '1rem' }}>🎯 How It Works</h2>
            <div style={{ color: '#166534' }}>
              <p><strong>1. Student Registration:</strong> Sign up with email and get an anonymous username (e.g., "SwiftEagle247")</p>
              <p><strong>2. Route Setup:</strong> Enter your home and school/college locations with your schedule</p>
              <p><strong>3. Find Matches:</strong> Discover students with similar routes and timing</p>
              <p><strong>4. Connect Safely:</strong> Chat anonymously to coordinate carpooling arrangements</p>
              <p><strong>5. Ride Together:</strong> Save money, reduce emissions, and make new connections!</p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fef2f2', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            border: '1px solid #f87171'
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>⚠️ Demo Limitations</h2>
            <p style={{ color: '#7f1d1d' }}>
              This is a development demonstration. Some features require additional setup:
            </p>
            <ul style={{ marginTop: '0.5rem', color: '#7f1d1d' }}>
              <li>MongoDB database (currently using demo mode)</li>
              <li>OpenRouteService API key for geocoding</li>
              <li>Email service configuration for verification</li>
              <li>Production deployment configuration</li>
            </ul>
            <p style={{ marginTop: '1rem', color: '#7f1d1d' }}>
              See <code>SETUP_GUIDE.md</code> for complete configuration instructions.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
            <p>Built with ❤️ for students who want to commute smarter together</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              React + Next.js + Node.js + MongoDB + TypeScript + Socket.io
            </p>
          </div>
        </div>
      </main>
    </>
  );
}