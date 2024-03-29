// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../src/app/styles/globals.css'; // Ensure the path to your global styles is correct
import RootLayout from '../src/app/components/RootLayout';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
};

export default MyApp;
