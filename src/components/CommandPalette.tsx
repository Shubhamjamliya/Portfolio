import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  ArrowUp,
  Briefcase,
  Copy,
  FolderOpen,
  Github,
  House,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Sparkles,
  Sun,
  Terminal,
  User,
  Workflow,
  Wrench,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { scrollToTarget } from "@/lib/scroll";
import { switchTheme } from "@/lib/theme";
import { CONTACT_EMAIL } from "@/lib/site";

const sections = [
  { id: "#about", label: "About", icon: User },
  { id: "#services", label: "Capabilities", icon: Sparkles },
  { id: "#work", label: "Selected Work", icon: Layers },
  { id: "#skills", label: "Skills", icon: Wrench },
  { id: "#process", label: "Process", icon: Workflow },
  { id: "#experience", label: "Experience", icon: Briefcase },
  { id: "#contact", label: "Contact", icon: Mail },
];

const socials = [
  { label: "GitHub", href: "https://github.com/Shubhamjamliya", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/shubhamjamliya", icon: Linkedin },
  { label: "LeetCode", href: "https://leetcode.com/u/shubhamjamliya", icon: Terminal },
];

const itemClass =
  "gap-3 py-2.5 font-mono text-xs uppercase tracking-widest data-[selected='true']:bg-foreground data-[selected=true]:text-background";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** ⌘K / Ctrl+K palette: jump anywhere, copy the email, flip the theme. Lazy-loaded on first open. */
const CommandPalette = ({ open, onOpenChange: setOpen }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, setTheme } = useTheme();

  const run = useCallback(
    (action: () => void) => {
      setOpen(false);
      // Let the dialog close (and scroll unlock) before acting
      window.setTimeout(action, 120);
    },
    [setOpen],
  );

  const goToSection = (hash: string) =>
    run(() => {
      if (location.pathname === "/") scrollToTarget(hash);
      else navigate(`/${hash}`);
    });

  const isDark = resolvedTheme === "dark";

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command menu</DialogTitle>
      <DialogDescription className="sr-only">Jump to a section, copy the email address or switch the theme.</DialogDescription>
      <CommandInput placeholder="Type a command or jump to a section…" />
      <CommandList data-lenis-prevent>
        <CommandEmpty>Nothing found. Try "work" or "email".</CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem className={itemClass} onSelect={() => run(() => (location.pathname === "/" ? scrollToTarget(0) : navigate("/")))}>
            <House /> Home
          </CommandItem>
          {sections.map(({ id, label, icon: Icon }) => (
            <CommandItem className={itemClass} key={id} value={label} onSelect={() => goToSection(id)}>
              <Icon /> {label}
            </CommandItem>
          ))}
          <CommandItem className={itemClass} onSelect={() => run(() => navigate("/projects"))}>
            <FolderOpen /> Project Archive
            <CommandShortcut>PAGE</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem className={itemClass}
            onSelect={() => {
              // Clipboard + popups must run inside the user gesture, so no delay here
              setOpen(false);
              navigator.clipboard
                ?.writeText(CONTACT_EMAIL)
                .then(() => toast.success("Email copied to clipboard", { description: CONTACT_EMAIL }))
                .catch(() => toast(CONTACT_EMAIL, { description: "Couldn't access the clipboard — here it is." }));
            }}
          >
            <Copy /> Copy email address
          </CommandItem>
          <CommandItem className={itemClass}
            onSelect={() => {
              setOpen(false);
              window.location.href = `mailto:${CONTACT_EMAIL}`;
            }}
          >
            <Mail /> Send an email
          </CommandItem>
          <CommandItem className={itemClass} onSelect={() => run(() => switchTheme(isDark ? "light" : "dark", setTheme))}>
            {isDark ? <Sun /> : <Moon />} Switch to {isDark ? "light" : "dark"} theme
          </CommandItem>
          {location.pathname === "/" && (
            <CommandItem className={itemClass} onSelect={() => run(() => scrollToTarget(0))}>
              <ArrowUp /> Back to top
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Elsewhere">
          {socials.map(({ label, href, icon: Icon }) => (
            <CommandItem className={itemClass}
              key={label}
              onSelect={() => {
                setOpen(false);
                window.open(href, "_blank", "noopener,noreferrer");
              }}
            >
              <Icon /> {label}
              <CommandShortcut>↗</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
