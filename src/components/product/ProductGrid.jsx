import ProductCard from './ProductCard';

export default function ProductGrid({ products, columns = 4, onQuickView }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream/50 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No products found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 md:gap-5`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
