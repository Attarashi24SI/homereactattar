export default function ServiceCardSkeleton({ variant = "landing" }) {
    if (variant === "portal") {
        return (
            <div className="flex animate-pulse flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="aspect-square rounded-2xl bg-slate-200" />
                <div className="flex flex-1 flex-col pt-4">
                    <div className="mb-2 h-4 w-20 rounded-lg bg-slate-200" />
                    <div className="mb-1 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="mt-1 space-y-1">
                        <div className="h-3 w-full rounded bg-slate-100" />
                        <div className="h-3 w-2/3 rounded bg-slate-100" />
                    </div>
                    <div className="mt-auto pt-4">
                        <div className="mb-1 h-5 w-24 rounded bg-slate-200" />
                        <div className="h-3 w-32 rounded bg-slate-100" />
                    </div>
                    <div className="mt-3 h-10 w-full rounded-xl bg-slate-200" />
                </div>
            </div>
        );
    }

    // Landing page variant
    return (
        <div
            className="flex animate-pulse flex-col rounded-2xl border border-slate-200 bg-white p-6"
            style={{ minHeight: 340 }}
        >
            <div className="mb-4 h-12 w-12 rounded-xl bg-slate-200" />
            <div className="mb-2.5 h-4 w-24 rounded-lg bg-slate-200" />
            <div className="mb-2 h-5 w-3/4 rounded bg-slate-200" />
            <div className="flex-1 space-y-1.5">
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-5/6 rounded bg-slate-100" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="mb-1 h-5 w-28 rounded bg-slate-200" />
                <div className="h-3 w-36 rounded bg-slate-100" />
            </div>
        </div>
    );
}
