import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check saved install flag (works on all browsers)
    const installedFlag = localStorage.getItem("pwa-installed");
    if (installedFlag === "true") {
      setIsInstalled(true);
      return;
    }

    // Detect standalone / installed mode
    const checkIfInstalled = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in window.navigator &&
          (window.navigator as { standalone?: boolean }).standalone)
      ) {
        setIsInstalled(true);
        localStorage.setItem("pwa-installed", "true"); // persist it
        return true;
      }
      return false;
    };

    if (checkIfInstalled()) return;

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);

      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem(
          "pwa-install-prompt-dismissed"
        );
        if (!hasSeenPrompt) setShowPrompt(true);
      }, 3000);
    };

    // appinstalled (not fired on iOS Safari)
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem("pwa-installed", "true");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("PWA installation accepted");
        localStorage.setItem("pwa-installed", "true"); // IMPORTANT FIX
        setIsInstalled(true);
      } else {
        console.log("PWA installation dismissed");
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Error during PWA installation:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-prompt-dismissed", "true");
  };

  // Don't show if installed or not allowed
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in fixed right-4 bottom-4 left-4 z-50 duration-300 sm:right-4 sm:left-auto sm:w-80">
      <Card className="border-primary/20 bg-background/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="text-primary size-6"
                  fill="currentColor"
                >
                  <path d="M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm-60-267q14-7 29-10t31-3h20v-440h-20q-25 0-42.5 17.5T240-740v393Zm160-13h320v-440H400v440Zm-160 13v-453 453Zm60 187h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-foreground text-sm font-semibold">
                  Install Quran for All
                </h3>
                <p className="text-muted-foreground text-xs">
                  Add to your home screen
                </p>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground -mt-1 -mr-2 h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-xs leading-relaxed">
            Install for quick access, offline reading, and a better experience.
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="h-9 flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              Install App
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="h-9 px-4"
            >
              Later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
