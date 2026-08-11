"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type DragEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, MapPin, Pencil, RotateCcw, Upload, X } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { useVenueDraft } from "./VenueDraftProvider";
import { validateDraft, validateStep, venueSteps, type DraftPhoto, type ValidationErrors, type VenueDraft, type VenueStep } from "./venue-draft";

const inputClass = "mt-2 h-11 w-full rounded-lg border border-[#d8e1dc] bg-white px-3.5 text-sm text-[#26332d] outline-none transition placeholder:text-[#98a39d] focus:border-[#12b866] focus:ring-2 focus:ring-[#12b866]/10";
const textAreaClass = `${inputClass} h-28 resize-y py-3`;

export function VenueWizard({ step }: { step: VenueStep }) {
  return <AuthenticatedWizard step={step} />;
}

function AuthenticatedWizard({ step }: { step: VenueStep }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      sessionStorage.setItem("indoor:open-login", "1");
      sessionStorage.setItem("indoor:login-return", `/venues/new/${step}`);
      router.replace("/");
    }
  }, [loading, router, step, user]);

  if (loading || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f5] text-sm text-[#65756d]">Checking your session…</div>;
  return <WizardContent step={step} />;
}

function WizardContent({ step }: { step: VenueStep }) {
  const router = useRouter();
  const { draft, hydrated, resetDraft } = useVenueDraft();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const currentIndex = venueSteps.findIndex((item) => item.slug === step);

  function goNext() {
    const nextErrors = validateStep(step, draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const next = venueSteps[currentIndex + 1];
    if (next) router.push(`/venues/new/${next.slug}`);
  }

  function goBack() {
    const previous = venueSteps[currentIndex - 1];
    if (previous) router.push(`/venues/new/${previous.slug}`);
  }

  function submit() {
    const allErrors = validateDraft(draft);
    if (Object.keys(allErrors).length) {
      setErrors(allErrors);
      const invalidStep = venueSteps.slice(0, 5).find((item) => Object.keys(validateStep(item.slug, draft)).length);
      if (invalidStep) router.push(`/venues/new/${invalidStep.slug}`);
      return;
    }
    resetDraft();
    setSubmitted(true);
  }

  function discard() {
    if (window.confirm("Discard all venue draft information? This cannot be undone.")) {
      resetDraft();
      setErrors({});
      router.push("/venues/new/basic-info");
    }
  }

  if (!hydrated) return <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f5] text-sm text-[#65756d]">Restoring your venue draft…</div>;

  if (submitted) return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4f7f5] px-4 py-12 text-[#26332d]">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#d9e7df] bg-white p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2 className="mx-auto text-[#12b866]" size={58} />
        <h1 className="mt-5 text-2xl font-bold">Venue draft submitted</h1>
        <p className="mt-2 text-[#65756d]">Your frontend-only submission was successful. The local draft has been cleared.</p>
        <Link href="/" className="mt-7 inline-flex rounded-lg bg-[#08ad59] px-6 py-3 font-semibold text-white hover:bg-[#078d4a]">Back to Dashboard</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f4f7f5] px-4 py-7 text-[#26332d] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#53625a] hover:text-[#0b9e57]"><ArrowLeft size={17} /> Back to Dashboard</Link>
            <h1 className="mt-4 text-2xl font-bold text-[#1d2923] sm:text-3xl">Add New Venue</h1>
            <p className="mt-1 text-sm text-[#65756d] sm:text-base">Complete the details below to list your venue on Indoor.</p>
          </div>
          <button type="button" onClick={discard} className="inline-flex items-center gap-2 rounded-lg border border-[#d8e1dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#53625a] hover:border-red-200 hover:text-red-600"><RotateCcw size={16} /> Discard draft</button>
        </div>

        <Stepper currentIndex={currentIndex} />

        <div className="rounded-2xl border border-[#dde5e1] bg-white p-5 shadow-[0_4px_20px_rgba(30,55,42,0.05)] sm:p-7 lg:p-9">
          <StepContent step={step} errors={errors} clearError={(key) => setErrors((current) => { const next = { ...current }; delete next[key]; return next; })} />
          {Object.keys(errors).length > 0 && <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Please correct the highlighted fields before continuing.</p>}
          <WizardNavigation index={currentIndex} onBack={goBack} onNext={goNext} onSubmit={submit} />
        </div>
      </div>
    </main>
  );
}

function Stepper({ currentIndex }: { currentIndex: number }) {
  return (
    <ol aria-label="Venue creation progress" className="my-8 grid grid-cols-6 overflow-x-auto pb-2">
      {venueSteps.map((item, index) => {
        const complete = index < currentIndex; const active = index === currentIndex;
        return <li key={item.slug} className="relative min-w-[92px] text-center">
          {index > 0 && <span className={`absolute left-0 right-1/2 top-4 h-px ${index <= currentIndex ? "bg-[#12b866]" : "bg-[#ccd6d1]"}`} />}
          {index < venueSteps.length - 1 && <span className={`absolute left-1/2 right-0 top-4 h-px ${index < currentIndex ? "bg-[#12b866]" : "bg-[#ccd6d1]"}`} />}
          <Link href={index <= currentIndex ? `/venues/new/${item.slug}` : "#"} aria-current={active ? "step" : undefined} onClick={(event) => { if (index > currentIndex) event.preventDefault(); }} className="relative z-10 inline-flex flex-col items-center gap-2">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${active || complete ? "border-[#0eaa59] bg-[#0eaa59] text-white" : "border-[#bdc9c3] bg-[#f4f7f5] text-[#637169]"}`}>{complete ? <Check size={16} /> : index + 1}</span>
            <span className={`whitespace-nowrap text-xs font-medium ${active ? "text-[#0b9e57]" : "text-[#637169]"}`}>{item.label}</span>
          </Link>
        </li>;
      })}
    </ol>
  );
}

function WizardNavigation({ index, onBack, onNext, onSubmit }: { index: number; onBack: () => void; onNext: () => void; onSubmit: () => void }) {
  return <div className={`mt-8 flex gap-3 border-t border-[#edf1ef] pt-6 ${index ? "justify-between" : "justify-end"}`}>
    {index > 0 && <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-[#ccd7d1] px-5 py-3 text-sm font-semibold hover:bg-[#f4f7f5]"><ArrowLeft size={17} /> Back</button>}
    {index < 5 ? <button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-lg bg-[#08ad59] px-5 py-3 text-sm font-semibold text-white hover:bg-[#078d4a]">Next: {venueSteps[index + 1].label} <ArrowRight size={17} /></button>
      : <button type="button" onClick={onSubmit} className="inline-flex items-center gap-2 rounded-lg bg-[#08ad59] px-6 py-3 text-sm font-semibold text-white hover:bg-[#078d4a]"><CheckCircle2 size={18} /> Submit Venue</button>}
  </div>;
}

function StepContent({ step, errors, clearError }: { step: VenueStep; errors: ValidationErrors; clearError: (key: string) => void }) {
  if (step === "basic-info") return <BasicInfo errors={errors} clearError={clearError} />;
  if (step === "location") return <Location errors={errors} clearError={clearError} />;
  if (step === "details") return <Details errors={errors} clearError={clearError} />;
  if (step === "amenities") return <Amenities errors={errors} clearError={clearError} />;
  if (step === "photos") return <Photos errors={errors} clearError={clearError} />;
  return <Review />;
}

function Heading({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return <div className="mb-7"><h2 className="text-xl font-bold text-[#1d2923]">{number}. {title}</h2><p className="mt-1 text-sm text-[#65756d]">{subtitle}</p></div>;
}

function Field({ label, name, error, optional, children }: { label: string; name: string; error?: string; optional?: boolean; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-[#26332d]"><span>{label}{!optional && <span className="text-red-500"> *</span>}{optional && <span className="font-normal text-[#7c8982]"> (Optional)</span>}</span>{children}{error && <span className="mt-1.5 block text-xs font-normal text-red-600" id={`${name}-error`}>{error}</span>}</label>;
}

function BasicInfo({ errors, clearError }: StepProps) {
  const { draft, updateSection } = useVenueDraft(); const data = draft.basicInfo;
  const set = (key: keyof typeof data, value: string) => { updateSection("basicInfo", { ...data, [key]: value }); clearError(key); };
  return <><Heading number={1} title="Basic Information" subtitle="Tell customers about your venue and how bookings work." />
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Venue Name" name="venueName" error={errors.venueName}><input value={data.venueName} onChange={(e) => set("venueName", e.target.value)} className={inputClass} placeholder="e.g. Elite Sports Arena" /></Field>
      <Field label="Venue Type" name="venueType" error={errors.venueType}><select value={data.venueType} onChange={(e) => set("venueType", e.target.value)} className={inputClass}><option value="">Select venue type</option><option>Turf</option><option>Sports Complex</option><option>Indoor Court</option><option>Event Space</option><option>Training Facility</option></select></Field>
      <div className="md:col-span-2"><Field label="Description" name="description" error={errors.description}><textarea maxLength={500} value={data.description} onChange={(e) => set("description", e.target.value)} className={textAreaClass} placeholder="Describe your venue, facilities, and what makes it special…" /><span className="mt-1 block text-right text-xs font-normal text-[#7c8982]">{data.description.length}/500</span></Field></div>
      <Field label="Booking Mode" name="bookingMode" error={errors.bookingMode}><select value={data.bookingMode} onChange={(e) => set("bookingMode", e.target.value)} className={inputClass}><option value="">Select booking mode</option><option>Online bookings</option><option>Offline bookings</option><option>Online & Offline bookings</option></select></Field>
      <Field label="Phone Number" name="phone" error={errors.phone}><input type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+880 1XXXXXXXXX" /></Field>
      <Field label="Email Address" name="email" error={errors.email}><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="venue@example.com" /></Field>
      <Field label="Website" name="website" error={errors.website} optional><input type="url" value={data.website} onChange={(e) => set("website", e.target.value)} className={inputClass} placeholder="https://yourvenue.com" /></Field>
      <Field label="Business Status" name="businessStatus" optional><select value={data.businessStatus} onChange={(e) => set("businessStatus", e.target.value)} className={inputClass}><option value="">Select status</option><option>Registered business</option><option>Individual owner</option><option>Non-profit / Community</option></select></Field>
    </div></>;
}

type StepProps = { errors: ValidationErrors; clearError: (key: string) => void };

function Location({ errors, clearError }: StepProps) {
  const { draft, updateSection } = useVenueDraft(); const data = draft.location;
  const set = (key: keyof typeof data, value: string) => { updateSection("location", { ...data, [key]: value }); clearError(key); };
  const fields: Array<[keyof typeof data, string, boolean?]> = [["address1", "Address Line 1"], ["address2", "Address Line 2", true], ["area", "Area"], ["city", "City"], ["district", "District"], ["division", "Division"], ["postalCode", "Postal Code", true], ["country", "Country"]];
  return <><Heading number={2} title="Location" subtitle="Add the exact location so players can easily find your venue." /><div className="grid gap-7 lg:grid-cols-[1.2fr_.8fr]"><div className="grid gap-5 sm:grid-cols-2">{fields.map(([key, label, optional]) => <div key={key} className={key === "address1" || key === "address2" ? "sm:col-span-2" : ""}><Field label={label} name={key} error={errors[key]} optional={optional}><input value={data[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} placeholder={label} /></Field></div>)}</div>
    <div className="min-h-72 overflow-hidden rounded-xl border border-[#d8e1dc] bg-[#eaf3ee]"><div className="relative flex h-full min-h-72 items-center justify-center bg-[linear-gradient(30deg,transparent_24%,rgba(18,184,102,.08)_25%,rgba(18,184,102,.08)_26%,transparent_27%,transparent_74%,rgba(18,184,102,.08)_75%,rgba(18,184,102,.08)_76%,transparent_77%)] bg-[length:40px_40px]"><div className="text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0aaf59] shadow-md"><MapPin size={30} /></span><p className="mt-4 font-semibold">Map location preview</p><p className="mt-1 max-w-xs text-sm text-[#65756d]">A free placeholder for now. Map coordinates can be connected later without changing this form.</p></div></div></div></div></>;
}

function Details({ errors, clearError }: StepProps) {
  const { draft, updateSection } = useVenueDraft(); const data = draft.details;
  const set = (key: keyof typeof data, value: string) => { updateSection("details", { ...data, [key]: value }); clearError(key); };
  const numbers: Array<[keyof typeof data, string, string]> = [["venueSize", "Venue Size", "sq ft"], ["maximumParticipants", "Maximum Participants", "players"], ["minimumBookingMinutes", "Minimum Booking Minutes", "minutes"], ["maximumBookingMinutes", "Maximum Booking Minutes", "minutes"], ["bookingLeadTime", "Booking Lead Time", "hours"], ["advanceBookingDays", "Advance Booking Days", "days"]];
  return <><Heading number={3} title="Venue Details" subtitle="Set venue capacity, booking limits, policies, and house rules." /><div className="grid gap-5 md:grid-cols-2">{numbers.map(([key, label, suffix]) => <Field key={key} label={label} name={key} error={errors[key]}><div className="relative"><input type="number" min="1" value={data[key]} onChange={(e) => set(key, e.target.value)} className={`${inputClass} pr-20`} placeholder="Enter value" /><span className="absolute bottom-3 right-3 text-xs text-[#65756d]">{suffix}</span></div></Field>)}<Field label="Cancellation Policy" name="cancellationPolicy" error={errors.cancellationPolicy}><textarea maxLength={500} value={data.cancellationPolicy} onChange={(e) => set("cancellationPolicy", e.target.value)} className={textAreaClass} placeholder="Explain cancellation and refund rules…" /></Field><Field label="House Rules" name="houseRules" error={errors.houseRules}><textarea maxLength={500} value={data.houseRules} onChange={(e) => set("houseRules", e.target.value)} className={textAreaClass} placeholder="No smoking, proper sports shoes, arrival time…" /></Field></div></>;
}

const amenityGroups = {
  facilities: ["Changing Room", "Restroom", "Parking", "Refreshments / Cafe", "Flood Lights", "Equipment Rental"],
  environment: ["Indoor", "Outdoor"],
  courtTypes: ["Football", "Cricket", "Badminton", "Basketball", "Tennis", "Multi-sport"],
  highlights: ["Air Conditioned", "Clean & Hygienic", "Safe & Secure", "Professional Staff", "Locker Facility", "Wheelchair Accessible"],
} satisfies Record<keyof VenueDraft["amenities"], string[]>;

function Amenities({ errors, clearError }: StepProps) {
  const { draft, updateSection } = useVenueDraft();
  function toggle(group: keyof typeof amenityGroups, item: string) { const values = draft.amenities[group]; updateSection("amenities", { ...draft.amenities, [group]: values.includes(item) ? values.filter((value) => value !== item) : [...values, item] }); clearError(group); }
  return <><Heading number={4} title="Amenities" subtitle="Select the facilities, environment, court types, and highlights your venue offers." /><div className="grid gap-5 md:grid-cols-2">{(Object.keys(amenityGroups) as Array<keyof typeof amenityGroups>).map((group) => <fieldset key={group} className="rounded-xl border border-[#dfe7e3] p-5"><legend className="px-1 font-bold capitalize">{group === "courtTypes" ? "Court Types" : group === "facilities" ? "Sports & Facilities" : group === "environment" ? "Indoor / Outdoor" : "Additional Highlights"}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{amenityGroups[group].map((item) => { const selected = draft.amenities[group].includes(item); return <button key={item} type="button" aria-pressed={selected} onClick={() => toggle(group, item)} className={`flex items-center justify-between rounded-lg border px-3.5 py-3 text-left text-sm transition ${selected ? "border-[#15b866] bg-[#eaf9f1] font-semibold text-[#087d47]" : "border-[#e1e8e4] hover:border-[#9fd7ba]"}`}><span>{item}</span><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-[#12b866] bg-[#12b866] text-white" : "border-[#b9c5bf]"}`}>{selected && <Check size={13} />}</span></button>; })}</div>{errors[group] && <p className="mt-3 text-xs text-red-600">{errors[group]}</p>}</fieldset>)}</div></>;
}

function Photos({ errors, clearError }: StepProps) {
  const { draft, updateSection } = useVenueDraft(); const inputRef = useRef<HTMLInputElement>(null); const [photoError, setPhotoError] = useState("");
  async function addFiles(files: FileList | File[]) {
    setPhotoError(""); const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (images.length !== Array.from(files).length) setPhotoError("Only image files are supported.");
    const room = Math.max(0, 8 - draft.photos.length); const selected = images.slice(0, room);
    const additions = await Promise.all(selected.map((file) => new Promise<DraftPhoto>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, preview: String(reader.result) }); reader.onerror = reject; reader.readAsDataURL(file); })));
    updateSection("photos", [...draft.photos, ...additions]); clearError("photos");
  }
  function drop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); void addFiles(event.dataTransfer.files); }
  return <><Heading number={5} title="Photos" subtitle="Upload clear venue photos. File metadata is retained across refreshes while previews remain available in this browser session." /><div onDragOver={(e) => e.preventDefault()} onDrop={drop} className="rounded-xl border-2 border-dashed border-[#78ce9f] bg-[#f4fcf7] p-9 text-center"><Upload className="mx-auto text-[#0aaf59]" size={42} /><p className="mt-4 font-bold text-[#087d47]">Drag and drop your photos here</p><p className="mt-1 text-sm text-[#65756d]">or choose images from your device (up to 8)</p><button type="button" onClick={() => inputRef.current?.click()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#08ad59] px-5 py-2.5 text-sm font-semibold text-white"><ImagePlus size={17} /> Browse photos</button><input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ""; }} /></div>{(errors.photos || photoError) && <p className="mt-3 text-sm text-red-600">{errors.photos || photoError}</p>}
    {draft.photos.length > 0 && <div className="mt-7"><h3 className="font-bold">Your Photos ({draft.photos.length}/8)</h3><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{draft.photos.map((photo) => <div key={photo.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#d8e1dc] bg-[#eef2ef]">{photo.preview ? <img src={photo.preview} alt={photo.name} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center text-[#718078]"><ImagePlus size={28} /><span className="line-clamp-2 text-xs">{photo.name}</span></div>}<button type="button" aria-label={`Remove ${photo.name}`} onClick={() => updateSection("photos", draft.photos.filter((item) => item.id !== photo.id))} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50"><X size={17} /></button></div>)}</div></div>}
    <p className="mt-5 text-xs text-[#728078]">Browser storage safely keeps serializable file metadata, not File objects. A future upload adapter can replace each preview with a cloud asset URL without redesigning the wizard.</p></>;
}

function Review() {
  const { draft } = useVenueDraft();
  const sections = [
    { title: "Basic Information", step: "basic-info", rows: [["Venue", draft.basicInfo.venueName], ["Type", draft.basicInfo.venueType], ["Booking mode", draft.basicInfo.bookingMode], ["Contact", `${draft.basicInfo.phone} · ${draft.basicInfo.email}`], ["Description", draft.basicInfo.description]] },
    { title: "Location", step: "location", rows: [["Address", [draft.location.address1, draft.location.address2, draft.location.area, draft.location.city].filter(Boolean).join(", ")], ["Region", [draft.location.district, draft.location.division, draft.location.postalCode, draft.location.country].filter(Boolean).join(", ")]] },
    { title: "Details", step: "details", rows: [["Venue size", `${draft.details.venueSize} sq ft`], ["Participants", draft.details.maximumParticipants], ["Booking range", `${draft.details.minimumBookingMinutes}–${draft.details.maximumBookingMinutes} minutes`], ["Lead / advance", `${draft.details.bookingLeadTime} hours / ${draft.details.advanceBookingDays} days`], ["Cancellation", draft.details.cancellationPolicy], ["House rules", draft.details.houseRules]] },
  ];
  return <><Heading number={6} title="Review Your Listing" subtitle="Review all venue information before submitting. Use Edit to make changes without losing the draft." /><div className="grid gap-5 lg:grid-cols-2">{sections.map((section) => <ReviewCard key={section.step} title={section.title} step={section.step} rows={section.rows} />)}<ReviewCard title="Amenities" step="amenities" rows={Object.entries(draft.amenities).map(([key, values]) => [key.replace(/([A-Z])/g, " $1"), values.length ? values.join(", ") : "None selected"])} /><section className="rounded-xl border border-[#dfe7e3] p-5"><div className="flex items-center justify-between"><h3 className="font-bold">Photos</h3><EditLink step="photos" /></div><div className="mt-4 grid grid-cols-3 gap-2">{draft.photos.map((photo) => photo.preview ? <img key={photo.id} src={photo.preview} alt={photo.name} className="aspect-square w-full rounded-lg object-cover" /> : <div key={photo.id} className="flex aspect-square items-center justify-center rounded-lg bg-[#eef2ef] p-2 text-center text-xs text-[#718078]">{photo.name}</div>)}</div></section></div><div className="mt-6 flex items-start gap-3 rounded-xl border border-[#ccebd9] bg-[#effaf4] p-4 text-sm text-[#23613f]"><CheckCircle2 className="mt-0.5 shrink-0 text-[#0aae59]" size={20} /><p><strong>Ready to submit.</strong> This frontend-only action validates your complete draft and does not publish or send data to a backend.</p></div></>;
}

function ReviewCard({ title, step, rows }: { title: string; step: string; rows: string[][] }) { return <section className="rounded-xl border border-[#dfe7e3] p-5"><div className="flex items-center justify-between"><h3 className="font-bold">{title}</h3><EditLink step={step} /></div><dl className="mt-4 space-y-3">{rows.map(([label, value]) => <div key={label} className="grid grid-cols-[110px_1fr] gap-3 text-sm"><dt className="capitalize text-[#718078]">{label}</dt><dd className="break-words font-medium text-[#29362f]">{value || "—"}</dd></div>)}</dl></section>; }
function EditLink({ step }: { step: string }) { return <Link href={`/venues/new/${step}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#079c51] hover:underline"><Pencil size={13} /> Edit</Link>; }
