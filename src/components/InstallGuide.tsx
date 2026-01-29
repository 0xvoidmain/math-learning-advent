import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  DeviceMobile,
  ShareFat,
  Plus,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { getSetting, setSetting } from "@/lib/db";

export function InstallGuide() {
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deviceType, setDeviceType] = useState<
    "ios" | "android" | "desktop" | null
  >(null);

  useEffect(() => {
    const checkAndShow = async () => {
      const lastSeenTimestamp = await getSetting<number>(
        "install-guide-last-seen",
      );
      const oneHourAgo = Date.now() - 60 * 60 * 1000; // 1 hour in milliseconds

      if (lastSeenTimestamp && lastSeenTimestamp > oneHourAgo) {
        setHasSeenGuide(true);
        return;
      }

      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      if (isStandalone) {
        await setSetting("install-guide-last-seen", Date.now());
        setHasSeenGuide(true);
        return;
      }

      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isDesktop = !isIOS && !isAndroid;

      if (isIOS) {
        setDeviceType("ios");
      } else if (isAndroid) {
        setDeviceType("android");
      } else if (isDesktop) {
        setDeviceType("desktop");
      }

      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    checkAndShow();
  }, []);

  const handleDismiss = async () => {
    setIsVisible(false);
    setTimeout(async () => {
      await setSetting("install-guide-last-seen", Date.now());
      setHasSeenGuide(true);
    }, 300);
  };

  if (!deviceType || hasSeenGuide) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none"
        >
          <Card className="w-full max-w-md p-6 shadow-2xl border-2 border-primary/20 pointer-events-auto bg-card">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full shrink-0">
                <DeviceMobile weight="fill" className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Install Math Quest
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use it like a real app! Add to your home screen for quick
                    access.
                  </p>
                </div>

                {deviceType === "ios" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        1.
                      </span>
                      <div className="flex items-center gap-2">
                        <span>Click the Share button</span>
                        <ShareFat
                          weight="fill"
                          className="w-4 h-4 text-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        2.
                      </span>
                      <span>Scroll down and select "Add to Home Screen"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        3.
                      </span>
                      <span>Tap "Add"</span>
                    </div>
                  </div>
                )}

                {deviceType === "android" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        1.
                      </span>
                      <div className="flex items-center gap-2">
                        <span>Click the Share button</span>
                        <ShareFat
                          weight="fill"
                          className="w-4 h-4 text-primary"
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        2.
                      </span>
                      <span>Scroll down and select "Add to Home Screen"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        3.
                      </span>
                      <span>Tap "Add"</span>
                    </div>
                  </div>
                )}

                {deviceType === "desktop" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        1.
                      </span>
                      <span>Look for the Share icon in your address bar</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        2.
                      </span>
                      <span>Scroll down and select "Add to Home Screen"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary shrink-0">
                        3.
                      </span>
                      <span>Open installed app from your home screen</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
