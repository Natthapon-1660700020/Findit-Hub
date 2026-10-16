import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useItemDetail, useResolveItem } from "../hooks/useItems";
import { useSavedStore } from "../store/useSavedStore";
import { CategoryIcon } from "../components/CategoryIcon";
import { ErrorAlert } from "../components/ErrorAlert";

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: item, isLoading, isError, refetch } = useItemDetail(id);
  const { isSaved, toggleSave } = useSavedStore();
  const resolveMutation = useResolveItem();

  const [resolveNote, setResolveNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saved = item ? isSaved(item.id) : false;

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    await resolveMutation.mutateAsync({
      id: item.id,
      note:
        resolveNote.trim() ||
        "Item returned to owner or settled at campus office.",
    });
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-base-300 rounded w-1/4" />
        <div className="h-96 bg-base-300 rounded-2xl w-full" />
        <div className="space-y-3">
          <div className="h-6 bg-base-300 rounded w-3/4" />
          <div className="h-4 bg-base-300 rounded w-full" />
          <div className="h-4 bg-base-300 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorAlert
          message="Item not found or failed to load item details."
          onRetry={() => refetch()}
        />
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-1"
        >
          ← Back to previous page
        </button>
        <span className="text-xs text-base-content/60 font-mono">
          ID: {item.id}
        </span>
      </div>

      <div className="bg-base-100 rounded-3xl border border-base-200 shadow-lg overflow-hidden">
        {/* Item Image Banner */}
        <div className="w-full h-80 sm:h-96 bg-base-200 relative flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <CategoryIcon category={item.category} size="lg" />
              <span className="text-sm font-semibold text-base-content/70 mt-3">
                No original photo uploaded
              </span>
              <span className="text-xs text-base-content/50">
                Displaying category icon for {item.category}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className={`badge font-bold text-sm uppercase px-3 py-4 text-white ${
                item.type === "Lost" ? "badge-error" : "badge-success"
              }`}
            >
              {item.type} Item
            </span>
            <span
              className={`badge text-sm font-semibold px-3 py-4 ${
                item.status === "Resolved" ? "badge-neutral" : "badge-primary"
              }`}
            >
              Status: {item.status}
            </span>
          </div>
        </div>

        {/* Item Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-base-content/60 mb-1">
                <span className="badge badge-outline">{item.category}</span>
                <span>•</span>
                <span>Reported on {item.date}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">
                {item.title}
              </h1>
            </div>

            {/* Action Buttons: Save & Resolve */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => toggleSave(item.id)}
                className={`btn btn-sm flex-1 sm:flex-initial ${
                  saved ? "btn-primary" : "btn-outline"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill={saved ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                {saved ? "Saved" : "Save Item"}
              </button>

              {item.status === "Active" && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-sm btn-accent flex-1 sm:flex-initial"
                >
                  ✓ Mark Resolved
                </button>
              )}
            </div>
          </div>

          <hr className="border-base-200" />

          {/* Description */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60 mb-2">
              Item Description
            </h2>
            <p className="text-base text-base-content/80 whitespace-pre-line leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Location & Custody Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200/60 p-4 rounded-xl border border-base-200">
              <span className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                Incident Location
              </span>
              <p className="font-semibold text-base-content flex items-center gap-2">
                📍 {item.location}
              </p>
            </div>

            <div className="bg-base-200/60 p-4 rounded-xl border border-base-200">
              <span className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                {item.type === "Lost"
                  ? "Return Instruction"
                  : "Current Custody / Pick-up Point"}
              </span>
              <p className="font-semibold text-base-content flex items-center gap-2">
                🏢{" "}
                {item.type === "Lost" && item.custody === "With Finder / Owner"
                  ? "Contact Owner Directly (or Drop at Building A3)"
                  : item.custody}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-primary mb-1">
              Contact & Verification
            </h3>
            <p className="text-sm text-base-content/80 mb-2">
              To verify ownership or arrange returning this item, please reach
              out via:
            </p>
            <div className="text-base font-bold text-base-content bg-base-100 p-3 rounded-lg border border-primary/20 inline-block">
              📞 {item.contact}
            </div>
          </div>

          {/* Resolution Note (if Resolved) */}
          {item.status === "Resolved" && item.resolvedNote && (
            <div className="bg-success/10 border border-success/30 p-4 rounded-xl text-success-content">
              <span className="text-xs font-bold uppercase block mb-1">
                Resolution Summary
              </span>
              <p className="text-sm">{item.resolvedNote}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Mark as Resolved */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Close & Resolve this Event</h3>
            <p className="py-2 text-sm text-base-content/70">
              Confirm that this item has been returned to its owner or handed
              over to the campus administration.
            </p>
            <form onSubmit={handleResolveSubmit} className="mt-3 space-y-4">
              <div>
                <label className="label text-xs font-semibold">
                  Resolution Note (Optional)
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="e.g., Owner retrieved the item at Central Lost & Found Room A3-101"
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolveMutation.isPending}
                  className="btn btn-sm btn-accent"
                >
                  {resolveMutation.isPending
                    ? "Updating..."
                    : "Confirm Resolution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
