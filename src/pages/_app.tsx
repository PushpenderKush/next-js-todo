import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import '../styles/globals.css';
import { store } from '../../store';
import React, { Suspense } from "react";
import Loader from "../components/loader";
import ErrorBoundary from "../components/Error-boundies";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Suspense fallback={<Loader />}>
          <ErrorBoundary>
            <Toaster />
            <Component {...pageProps} />
          </ErrorBoundary>
        </Suspense>
      </Provider>
    </React.StrictMode>

  );
}

export default MyApp;
