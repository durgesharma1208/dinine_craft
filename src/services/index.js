export {
  fetchAllProducts,
  fetchProductBySlug,
  fetchFeaturedProducts,
  fetchBestSellers,
  fetchTrendingProducts,
  fetchNewArrivals,
  fetchProductsByCategory,
  fetchRelatedProducts,
} from './productService';

export {
  fetchCategories,
} from './categoryService';

export {
  fetchTestimonials,
  fetchFAQ,
  fetchInstagramGallery,
  subscribeNewsletter,
  submitContactMessage,
} from './contentService';

export {
  getDashboardStats,
  getProductCountByCategory,
  getRevenueData,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updateSiteSetting,
  getSiteSettings,
  updateHomepageSection,
  getHomepageSections,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from './adminService';

export {
  uploadImage,
  deleteImage,
  listImages,
  getAllImages,
} from './mediaService';
