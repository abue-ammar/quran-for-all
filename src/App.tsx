import Footer from "./components/footer";
import Header from "./components/header";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <main className="container mx-auto flex-1 overflow-y-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <h1 className="text-4xl font-bold">Welcome to Your App</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start building your amazing project here
            </p>
            {/* Add your content here */}
          </div>
          <Footer />
          <Toaster />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
