import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";
import { SpeechProvider } from "@/lib/speech-context";
import { SpeechSettingsPanel } from "@/components/SpeechSettingsPanel";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <SpeechProvider>
        <Component {...pageProps} />
        <Toaster />
        <SpeechSettingsPanel className="fixed bottom-4 right-4 z-50" />
      </SpeechProvider>
    </LanguageProvider>
  );
}
