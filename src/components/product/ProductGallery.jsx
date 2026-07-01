import { useState, useCallback } from "react";

export default function ProductGallery({ images, name }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!zoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setZoomPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [zoomed],
  );

  const displayImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1612152661182-8d6c5e568c94?w=800&q=80",
        ];

  return (
    <div className="space-y-4 lg:space-y-5">
      <div
        className="relative overflow-hidden rounded-[1.7rem] bg-[#f4e8d9]/70 cursor-crosshair group border border-[#8b6d45]/10 shadow-[0_24px_60px_rgba(46,31,16,0.12)]"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="relative aspect-square">
          <img
            src={displayImages[selectedIndex]}
            alt={`${name} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-200"
            style={
              zoomed
                ? {
                    transform: "scale(1.8)",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : {}
            }
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-[#2d1e10]/18 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/4 rounded-[1.7rem] pointer-events-none" />
        <div className="absolute bottom-3 right-3 bg-white/82 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[11px] text-gray-600 font-semibold uppercase tracking-[0.12em]">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
              selectedIndex === index
                ? "border-primary shadow-[0_8px_16px_rgba(95,67,36,0.2)]"
                : "border-transparent hover:border-[#c5aa86]"
            }`}
          >
            <img
              src={img}
              alt={`${name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
