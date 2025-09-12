export interface BookReview {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  rating: number;
  review: string;
  summary: string;
  favoriteQuote?: string;
  tags: string[];
  readDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookReviewRequest {
  title: string;
  author: string;
  isbn?: string;
  rating: number;
  review: string;
  summary: string;
  favoriteQuote?: string;
  tags: string[];
  readDate: string;
}

export interface UpdateBookReviewRequest extends Partial<CreateBookReviewRequest> {
  id: string;
}

export interface BookReviewFilters {
  search?: string;
  rating?: number;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}
