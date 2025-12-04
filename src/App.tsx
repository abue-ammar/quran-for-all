import Footer from "./components/footer";
import Header from "./components/header";
import QuranTabs from "./components/quran-tabs";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex h-screen flex-col overflow-auto">
        <Header />
        <main className="container mx-auto flex-1 p-4">
          <QuranTabs />
          <Footer />
          <Toaster />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
