import { MapPin } from "lucide-react";

export function LocationSelector() {
  return (
    <button
      type="button"
      className="flex h-[42px] w-full max-w-[280px] items-center gap-3 rounded-full border border-[#dce2df] bg-[#f1f4f2] px-5 text-left text-[15px] font-medium text-[#3f4945] transition hover:border-[#20b867] hover:bg-white"
    >
      <MapPin size={18} strokeWidth={2} />

      <span>Dhaka</span>
    </button>
  );
}