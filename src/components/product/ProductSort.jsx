import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS } from "../../utils/constants";

export default function ProductSort({
  sortBy,
  setSortBy,
  totalProducts,
  onToggleFilters,
  activeFilterCount,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 premium-shell rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-xs hover:border-primary hover:text-primary transition-all focus-luxury"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-xs text-gray-500 uppercase tracking-[0.12em]">
          <span className="font-semibold text-gray-700">{totalProducts}</span>{" "}
          products
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown size={13} className="text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-full text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer text-gray-700 uppercase tracking-[0.08em]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
