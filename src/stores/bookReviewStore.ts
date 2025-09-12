import { ref, computed } from 'vue';
import { BookReview, CreateBookReviewRequest, UpdateBookReviewRequest, BookReviewFilters } from '@/types/bookReview';
import { StorageService } from '@/services/storageService';

export const useBookReviewStore = () => {
  const reviews = ref<BookReview[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const totalReviews = computed(() => reviews.value.length);
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.value.length) * 10) / 10;
  });

  // Actions
  const loadReviews = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;
      reviews.value = StorageService.getReviews();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load reviews';
    } finally {
      isLoading.value = false;
    }
  };

  const addReview = async (reviewData: CreateBookReviewRequest): Promise<BookReview> => {
    try {
      isLoading.value = true;
      error.value = null;

      const newReview: BookReview = {
        ...reviewData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      StorageService.addReview(newReview);
      reviews.value = StorageService.getReviews();
      
      return newReview;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add review';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateReview = async (reviewData: UpdateBookReviewRequest): Promise<BookReview> => {
    try {
      isLoading.value = true;
      error.value = null;

      const existingReview = StorageService.getReview(reviewData.id);
      if (!existingReview) {
        throw new Error('Review not found');
      }

      const updatedReview: BookReview = {
        ...existingReview,
        ...reviewData,
        updatedAt: new Date().toISOString(),
      };

      StorageService.updateReview(updatedReview);
      reviews.value = StorageService.getReviews();
      
      return updatedReview;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update review';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteReview = async (id: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      StorageService.deleteReview(id);
      reviews.value = StorageService.getReviews();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete review';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getReview = (id: string): BookReview | null => {
    return reviews.value.find(review => review.id === id) || null;
  };

  const searchReviews = (filters: BookReviewFilters): BookReview[] => {
    let filtered = [...reviews.value];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchTerm) ||
        review.author.toLowerCase().includes(searchTerm) ||
        review.review.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(review => review.rating >= filters.rating!);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(review =>
        filters.tags!.some(tag => review.tags.includes(tag))
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(review => review.readDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(review => review.readDate <= filters.dateTo!);
    }

    return filtered;
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  return {
    // State
    reviews,
    isLoading,
    error,

    // Computed
    totalReviews,
    averageRating,

    // Actions
    loadReviews,
    addReview,
    updateReview,
    deleteReview,
    getReview,
    searchReviews,
  };
};
