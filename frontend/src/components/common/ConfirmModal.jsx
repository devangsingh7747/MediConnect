import {
    CheckCircle2,
    CircleX,
    LoaderCircle,
    TriangleAlert,
} from "lucide-react";

const modalVariants = {
    danger: {
        iconContainer: "bg-red-100",
        iconColor: "text-red-500",
        confirmButton:
            "bg-red-600 hover:bg-red-700",
        Icon: CircleX,
    },

    success: {
        iconContainer: "bg-emerald-100",
        iconColor: "text-emerald-600",
        confirmButton:
            "bg-emerald-600 hover:bg-emerald-700",
        Icon: CheckCircle2,
    },

    warning: {
        iconContainer: "bg-amber-100",
        iconColor: "text-amber-600",
        confirmButton:
            "bg-amber-600 hover:bg-amber-700",
        Icon: TriangleAlert,
    },
};

const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "danger",
    loading = false,
}) => {
    if (!isOpen) {
        return null;
    }

    const selectedVariant =
        modalVariants[variant] ||
        modalVariants.danger;

    const Icon = selectedVariant.Icon;

    return (
        <div
            className="
                fixed inset-0 z-[9999]
                flex items-center justify-center
                bg-black/45 px-4
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-full max-w-md
                    overflow-hidden rounded-3xl
                    bg-white shadow-2xl
                    animate-[fadeIn_.2s_ease]
                "
            >
                <div className="p-8">
                    <div className="flex justify-center">
                        <div
                            className={`
                                flex h-20 w-20
                                items-center justify-center
                                rounded-full
                                ${selectedVariant.iconContainer}
                            `}
                        >
                            <Icon
                                size={40}
                                className={
                                    selectedVariant.iconColor
                                }
                            />
                        </div>
                    </div>

                    <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-4 text-center leading-6 text-slate-500">
                        {message}
                    </p>
                </div>

                <div className="flex gap-4 border-t border-slate-200 p-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            flex-1 cursor-pointer
                            rounded-xl border
                            border-slate-300 py-3
                            font-semibold text-slate-700
                            transition hover:bg-slate-100
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            flex flex-1 cursor-pointer
                            items-center justify-center gap-2
                            rounded-xl py-3
                            font-semibold text-white
                            transition
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            ${selectedVariant.confirmButton}
                        `}
                    >
                        {loading ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                />

                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;