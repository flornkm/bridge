import { Inter, JetBrains_Mono, Lora, Varela_Round } from "next/font/google";
import "../styles/globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

const inter = Inter({ 
  display: "swap",
  weights: [400, 500, 600, 700, 800, 900],
  subsets: ["latin"],
 });

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  weights: [400, 500, 600, 700, 800, 900],
  subsets: ["latin"],
});

const serifFont = Lora({ 
  weights: [400, 500, 600, 700, 800, 900],
  display: 'swap',
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
            --jetbrains-mono-font: ${jetbrainsMono.style.fontFamily};
            --display-font: ${serifFont.style.fontFamily};
        `}
      </style>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  );
}
export default MyApp;
