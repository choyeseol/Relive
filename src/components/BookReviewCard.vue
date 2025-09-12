<template>
  <ion-card class="review-card" @click="$emit('click', review)">
    <ion-card-content>
      <div class="review-header">
        <div class="book-info">
          <h3 class="book-title">{{ review.title }}</h3>
          <p class="book-author">{{ review.author }}</p>
        </div>
        <div class="rating-container">
          <ion-icon 
            v-for="star in 5" 
            :key="star"
            :icon="star <= review.rating ? star : starOutline"
            :class="{ 'filled': star <= review.rating }"
            class="star-icon"
          ></ion-icon>
        </div>
      </div>
      
      <p class="review-summary">{{ review.summary }}</p>
      
      <div class="review-meta">
        <div class="tags">
          <ion-chip 
            v-for="tag in review.tags.slice(0, 3)" 
            :key="tag"
            class="tag-chip"
          >
            {{ tag }}
          </ion-chip>
          <span v-if="review.tags.length > 3" class="more-tags">
            +{{ review.tags.length - 3 }}
          </span>
        </div>
        <span class="read-date">{{ formatDate(review.readDate) }}</span>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon, IonChip } from '@ionic/vue';
import { star, starOutline } from 'ionicons/icons';
import { formatDate } from '@/utils/dateUtils';
import type { BookReview } from '@/types/bookReview';

defineProps<{
  review: BookReview;
}>();

defineEmits<{
  click: [review: BookReview];
}>();
</script>

<style scoped>
.review-card {
  margin: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.book-info {
  flex: 1;
  margin-right: 12px;
}

.book-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ion-color-dark);
}

.book-author {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.rating-container {
  display: flex;
  gap: 2px;
}

.star-icon {
  font-size: 16px;
  color: var(--ion-color-light);
}

.star-icon.filled {
  color: var(--ion-color-warning);
}

.review-summary {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-dark);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.tag-chip {
  font-size: 12px;
  height: 24px;
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
}

.more-tags {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-left: 4px;
}

.read-date {
  font-size: 12px;
  color: var(--ion-color-medium);
  white-space: nowrap;
}
</style>
