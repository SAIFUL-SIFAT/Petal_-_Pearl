import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors={true}
      duration={2000}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl transition-all duration-300 !overflow-visible",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:opacity-100 group-[.toast]:!left-[-6px] group-[.toast]:!right-auto group-[.toast]:!top-[-6px] group-[.toast]:bg-background group-[.toast]:border group-[.toast]:rounded-full group-[.toast]:transition-all group-[.toast]:w-5 group-[.toast]:h-5 group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:p-0 group-[.toast]:transform-none",
          success:
            "group-[.toaster]:!bg-[#042116] group-[.toaster]:!border-[#10b981] group-[.toaster]:!text-[#10b981] [&_[data-close-button]]:!border-[#10b981] [&_[data-close-button]]:!text-[#10b981] [&_[data-icon]]:!text-[#10b981]",
          error:
            "group-[.toaster]:!bg-[#2e0505] group-[.toaster]:!border-[#ef4444] group-[.toaster]:!text-[#ef4444] [&_[data-close-button]]:!border-[#ef4444] [&_[data-close-button]]:!text-[#ef4444] [&_[data-icon]]:!text-[#ef4444]",
          info:
            "group-[.toaster]:!bg-[#081b33] group-[.toaster]:!border-[#3b82f6] group-[.toaster]:!text-[#3b82f6] [&_[data-close-button]]:!border-[#3b82f6] [&_[data-close-button]]:!text-[#3b82f6] [&_[data-icon]]:!text-[#3b82f6]",
          warning:
            "group-[.toaster]:!bg-[#2e1f05] group-[.toaster]:!border-[#f59e0b] group-[.toaster]:!text-[#f59e0b] [&_[data-close-button]]:!border-[#f59e0b] [&_[data-close-button]]:!text-[#f59e0b] [&_[data-icon]]:!text-[#f59e0b]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
