import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import { PWAInstallPrompt } from "./components/pwa-install-prompt";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { HomePage, SurahPage } from "./pages";

// Create a client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/surah/:surahId" element={<SurahPage />} />
              </Routes>
              <Footer />
              <Toaster />
            </main>
            <PWAInstallPrompt />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
