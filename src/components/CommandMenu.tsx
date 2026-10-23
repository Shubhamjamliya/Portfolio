import { lazy, Suspense, useEffect, useState } from "react";
import { getLenis } from "@/lib/scroll";
import { OPEN_COMMAND_EVENT } from "@/lib/site";

// The dialog + cmdk code only downloads the first time the palette is opened
const CommandPalette = lazy(() => import("@/components/CommandPalette"));

/** Listens for ⌘K / Ctrl+K (or the navbar button) and mounts the palette on demand. */
const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setRequested(true);
        setOpen((o) => !o);
      }
    };
    const onOpen = () => {
      setRequested(true);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  // Freeze smooth-scroll behind the dialog
  useEffect(() => {
    if (!requested) return;
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, requested]);

  if (!requested) return null;

  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </Suspense>
  );
};

export default CommandMenu;
