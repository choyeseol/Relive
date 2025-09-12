import { BookReview } from '@/types/bookReview';

const STORAGE_KEY = 'book_reviews';

export class StorageService {
  static getReviews(): BookReview[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get reviews from storage:', error);
      return [];
    }
  }

  static saveReviews(reviews: BookReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Failed to save reviews to storage:', error);
    }
  }

  static addReview(review: BookReview): void {
    const reviews = this.getReviews();
    reviews.push(review);
    this.saveReviews(reviews);
  }

  static updateReview(updatedReview: BookReview): void {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === updatedReview.id);
    if (index !== -1) {
      reviews[index] = updatedReview;
      this.saveReviews(reviews);
    }
  }

  static deleteReview(id: string): void {
    const reviews = this.getReviews();
    const filteredReviews = reviews.filter(r => r.id !== id);
    this.saveReviews(filteredReviews);
  }

  static getReview(id: string): BookReview | null {
    const reviews = this.getReviews();
    return reviews.find(r => r.id === id) || null;
  }
}
