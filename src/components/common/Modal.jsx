import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
  footer,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() =>
          closeOnOverlay && onClose?.()
        }
      />

      {/* MODAL */}
      <div
        className={`relative z-10 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c121c] shadow-2xl ${sizes[size] || sizes.md}`}
      >
        {/* HEADER */}
        {(title || showClose) && (
          <div className="flex items-start justify-between border-b border-white/[0.06] px-5 py-4">

            <div className="min-w-0">

              {title && (
                <h2
                  id="modal-title"
                  className="text-sm font-semibold text-white"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-[9px] leading-4 text-slate-600">
                  {description}
                </p>
              )}

            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            )}

          </div>
        )}

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto p-5">
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] px-5 py-4">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}

export default Modal;