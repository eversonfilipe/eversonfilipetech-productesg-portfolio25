export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Performance optimizations
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js');
    }

    // Preload critical resources
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://prod.spline.design/7TWlzczpjqxs2Er8/scene.splinecode';
    link.as = 'fetch';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }, []);

  return <Component {...pageProps} />;
}

export { reportWebVitals };
