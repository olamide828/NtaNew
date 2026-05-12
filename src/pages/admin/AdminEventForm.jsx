import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  adminCreateEvent,
  adminUpdateEvent,
  adminGetEvents,
} from "../../utils/api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import NProgress from "nprogress";
import {
  HiArrowLeft,
  HiUpload,
  HiPhotograph,
  HiX,
  HiLink,
} from "react-icons/hi";

const CATS = [
  "Sunday Service",
  "Prayer Meeting",
  "Bible Study",
  "Youth Program",
  "Special Event",
  "Conference",
  "Outreach",
  "Other",
];

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [imageMode, setImageMode] = useState("file");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [urlValue, setUrlValue] = useState("");
  const fileRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "Special Event",
      registrationRequired: true,
      isPublished: true,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    adminGetEvents()
      .then((r) => {
        const ev = r.data.data.find((e) => e._id === id);
        if (ev) {
          reset({
            ...ev,
            date: ev.date?.slice(0, 10) || "",
            endDate: ev.endDate?.slice(0, 10) || "",
            registrationDeadline: ev.registrationDeadline?.slice(0, 16) || "",
            registrationRequired: ev.registrationRequired ?? true,
            isPublished: ev.isPublished ?? true,
            isFeatured: ev.isFeatured ?? false,
          });
          if (ev.imageUrl) {
            setImagePreview(ev.imageUrl);
            setUrlValue(ev.imageUrl);
            setImageMode("url");
          }
        }
      })
      .catch(() => toast.error("Failed to load event."))
      .finally(() => setFetching(false));
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageMode("file");
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUrlValue("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();

      // Append all text fields with proper type coercion
      fd.append("title", data.title || "");
      fd.append("description", data.description || "");
      fd.append("category", data.category || "Special Event");
      fd.append("date", data.date || "");
      fd.append("time", data.time || "");
      fd.append("location", data.location || "");

      // Booleans must be sent as string 'true'/'false' for express-validator to parse
      fd.append(
        "registrationRequired",
        data.registrationRequired ? "true" : "false",
      );
      fd.append("isPublished", data.isPublished ? "true" : "false");
      fd.append("isFeatured", data.isFeatured ? "true" : "false");

      // Optional fields
      if (data.endDate) fd.append("endDate", data.endDate);
      if (data.registrationDeadline)
        fd.append("registrationDeadline", data.registrationDeadline);
      if (data.capacity) fd.append("capacity", String(Number(data.capacity)));

      // Image: file upload takes priority over URL
      if (imageMode === "file" && imageFile) {
        fd.append("image", imageFile);
      } else if (imageMode === "url" && urlValue.trim()) {
        fd.append("imageUrl", urlValue.trim());
      }

      if (isEdit) {
        await adminUpdateEvent(id, fd);
        toast.success("Event updated successfully!");
      } else {
        await adminCreateEvent(fd);
        toast.success("Event created!");
      }
      NProgress.start();
      navigate("/admin/events");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to save event.";
      toast.error(msg);
      console.error("Event save error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/events"
          className="w-10 h-10 rounded-xl bg-white border border-navy/8 flex items-center justify-center text-navy/40 hover:text-navy hover:border-navy/20 transition-all shadow-sm"
        >
          <HiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-4xl text-navy">
            {isEdit ? "Edit Event" : "Create Event"}
          </h1>
          <p className="font-sans text-sm text-navy/35">
            Fill in the details below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Details */}
        <div className="bg-white border border-navy/6 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy pb-3 border-b border-navy/5">
            Event Details
          </h2>
          <div>
            <label className="label">Event Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="input"
              placeholder="e.g. Annual Thanksgiving Service"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={4}
              className="input resize-none"
              placeholder="Describe the event…"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">Category</label>
            <select {...register("category")} className="input">
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Image upload */}
          <div>
            <label className="label">Event Image</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageMode("file")}
                className={`flex items-center gap-2 font-sans text-xs px-4 py-2 rounded-full border transition-all ${imageMode === "file" ? "bg-navy text-white border-navy" : "border-navy/15 text-navy/50 bg-white hover:border-navy/30"}`}
              >
                <HiUpload size={12} />
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex items-center gap-2 font-sans text-xs px-4 py-2 rounded-full border transition-all ${imageMode === "url" ? "bg-navy text-white border-navy" : "border-navy/15 text-navy/50 bg-white hover:border-navy/30"}`}
              >
                <HiLink size={12} />
                Paste Image URL
              </button>
            </div>

            {imageMode === "file" ? (
              <div>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden h-44 bg-cream">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain bg-cream"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors"
                    >
                      <HiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-navy/10 hover:border-gold/50 rounded-xl p-10 text-center cursor-pointer transition-colors group bg-cream/50"
                  >
                    <HiPhotograph
                      size={28}
                      className="text-navy/15 group-hover:text-gold mx-auto mb-2 transition-colors"
                    />
                    <p className="font-sans text-sm text-navy/40 group-hover:text-navy/60">
                      Click to select an image from your device
                    </p>
                    <p className="font-sans text-xs text-navy/25 mt-1">
                      JPG, PNG, WEBP — up to 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div>
                <input
                  value={urlValue}
                  onChange={(e) => {
                    setUrlValue(e.target.value);
                    if (e.target.value) setImagePreview(e.target.value);
                    else setImagePreview(null);
                  }}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
                {imagePreview && urlValue && (
                  <div className="relative mt-3 rounded-xl overflow-hidden h-44 bg-cream">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={() => setImagePreview(null)}
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors"
                    >
                      <HiX size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date & Location */}
        <div className="bg-white border border-navy/6 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy pb-3 border-b border-navy/5">
            Date & Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Event Date *</label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="input"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">End Date (optional)</label>
              <input type="date" {...register("endDate")} className="input" />
            </div>
            <div>
              <label className="label">Time *</label>
              <input
                {...register("time", { required: "Time is required" })}
                className="input"
                placeholder="e.g. 10:00 AM"
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
            <div>
              <label className="label">Location *</label>
              <input
                {...register("location", { required: "Location is required" })}
                className="input"
                placeholder="Church auditorium / venue"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white border border-navy/6 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="font-serif text-xl text-navy pb-3 border-b border-navy/5">
            Registration Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Capacity (blank = unlimited)</label>
              <input
                type="number"
                {...register("capacity")}
                className="input"
                placeholder="e.g. 200"
                min="1"
              />
            </div>
            <div>
              <label className="label">Registration Deadline</label>
              <input
                type="datetime-local"
                {...register("registrationDeadline")}
                className="input"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              ["registrationRequired", "Registration Required"],
              ["isPublished", "Published (visible to public)"],
              ["isFeatured", "Featured on Homepage"],
            ].map(([name, label]) => (
              <label
                key={name}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  {...register(name)}
                  className="w-4 h-4 accent-gold rounded"
                />
                <span className="font-sans text-sm text-navy/60">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-gold">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                {isEdit ? "Saving…" : "Creating…"}
              </>
            ) : isEdit ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </button>
          <Link to="/admin/events" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
