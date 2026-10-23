import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import Magnetic from "@/components/effects/Magnetic";
import { CONTACT_EMAIL } from "@/lib/site";

const topics = ["Full-time role", "Internship", "Freelance", "Just saying hi"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(80, "That's a long name"),
  email: z.string().trim().email("That email looks off"),
  topic: z.enum(topics),
  message: z.string().trim().min(10, "A few more words, please").max(2000, "Keep it under 2000 characters"),
});

type FormValues = z.infer<typeof schema>;

const Field = ({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="relative">
    {children}
    <label
      htmlFor={id}
      className="pointer-events-none absolute left-0 top-5 font-mono text-xs uppercase tracking-widest text-secondary-foreground/40 transition-all duration-300 peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px]"
    >
      {label}
    </label>
    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out peer-focus:scale-x-100" />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 font-mono text-[11px] uppercase tracking-widest text-primary"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputClass =
  "peer w-full border-b border-secondary-foreground/20 bg-transparent pb-3 pt-5 font-heading text-xl md:text-2xl font-bold text-secondary-foreground placeholder-transparent outline-none transition-colors focus:border-secondary-foreground/40";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", topic: "Full-time role", message: "" },
  });

  const topic = watch("topic");

  const onSubmit = (data: FormValues) => {
    const subject = `[${data.topic}] Hello from ${data.name}`;
    const body = `${data.message}\n\n— ${data.name} (${data.email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success("Opening your mail app…", {
      description: `Your note is pre-filled. If nothing opens, write to ${CONTACT_EMAIL}.`,
    });
    reset({ name: "", email: "", topic: data.topic, message: "" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      <fieldset>
        <legend className="mb-4 font-mono text-xs uppercase tracking-widest text-secondary-foreground/40">
          What's it about?
        </legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => {
            const selected = topic === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected}
                onClick={() => setValue("topic", t)}
                className={`relative overflow-hidden border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
                  selected
                    ? "border-primary text-primary-foreground"
                    : "border-secondary-foreground/20 text-secondary-foreground/60 hover:border-secondary-foreground/60 hover:text-secondary-foreground"
                }`}
              >
                {selected && (
                  <motion.span layoutId="topic-pill" className="absolute inset-0 bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{t}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <Field id="cf-name" label="Your name" error={errors.name?.message}>
          <input id="cf-name" autoComplete="name" placeholder="Your name" className={inputClass} {...register("name")} />
        </Field>
        <Field id="cf-email" label="Your email" error={errors.email?.message}>
          <input id="cf-email" type="email" autoComplete="email" placeholder="Your email" className={inputClass} {...register("email")} />
        </Field>
      </div>

      <Field id="cf-message" label="Tell me about it" error={errors.message?.message}>
        <textarea
          id="cf-message"
          rows={3}
          placeholder="Tell me about it"
          className={`${inputClass} resize-none text-lg md:text-xl font-medium`}
          {...register("message")}
        />
      </Field>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-widest text-secondary-foreground/40">
          Opens in your mail app, pre-filled. No trackers, no spam.
        </p>
        <Magnetic strength={0.3}>
          <button
            type="submit"
            className="group relative inline-flex items-center gap-4 overflow-hidden bg-primary px-8 py-4 font-heading text-lg font-black uppercase tracking-wider text-primary-foreground"
          >
            <span className="absolute inset-0 translate-y-full bg-secondary-foreground transition-transform duration-500 ease-in-out-expo group-hover:translate-y-0" />
            <span className="relative transition-colors duration-300 group-hover:text-secondary">Send message</span>
            <span className="relative transition-all duration-300 group-hover:translate-x-1 group-hover:text-secondary">→</span>
          </button>
        </Magnetic>
      </div>
    </form>
  );
};

export default ContactForm;
