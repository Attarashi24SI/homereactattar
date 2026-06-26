import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import laundryPortalAPI from "../services/laundryPortalAPI";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

export default function FeedbackForm({ open, onOpenChange, order, user, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (rating < 1) {
            setError("Silakan pilih rating terlebih dahulu.");
            return;
        }

        setIsSubmitting(true);
        try {
            await laundryPortalAPI.createFeedback({
                user,
                orderId: order.id,
                rating,
                comment: comment.trim() || null,
            });
            onSuccess?.();
            resetForm();
            onOpenChange(false);
        } catch (err) {
            setError(err.message || "Gagal mengirim feedback. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setComment("");
        setError("");
    };

    const handleOpenChange = (open) => {
        if (!open) resetForm();
        onOpenChange(open);
    };

    const starLabels = ["", "Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Beri Ulasan</DialogTitle>
                    <DialogDescription>
                        Bagaimana pengalaman Anda dengan layanan <strong>{order?.service_name || "laundry"}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="rounded-lg p-1 transition-transform duration-150 hover:scale-110 focus:outline-none"
                                    aria-label={`${star} bintang`}
                                >
                                    <Star
                                        size={36}
                                        fill={star <= (hoverRating || rating) ? "#f59e0b" : "transparent"}
                                        stroke={star <= (hoverRating || rating) ? "#f59e0b" : "#d1d5db"}
                                        strokeWidth={1.5}
                                        className="transition-all duration-200"
                                    />
                                </button>
                            ))}
                        </div>
                        {(hoverRating || rating) > 0 && (
                            <span className="text-sm font-medium text-slate-600">
                                {starLabels[hoverRating || rating]}
                            </span>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Komentar <span className="text-slate-400">(opsional)</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ceritakan pengalaman Anda dengan layanan ini..."
                            rows={4}
                            maxLength={1000}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        />
                        <p className="mt-1 text-right text-xs text-slate-400">
                            {comment.length}/1000
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating < 1}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all duration-200 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Kirim Ulasan
                            </>
                        )}
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
