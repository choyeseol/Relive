<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>독후감 상세</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="editReview">
            <ion-icon :icon="create" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button @click="deleteReview" color="danger">
            <ion-icon :icon="trash" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">독후감 상세</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="review">
        <!-- 도서 정보 -->
        <ion-card class="book-info-card">
          <ion-card-content>
            <div class="book-header">
              <div class="book-details">
                <h1 class="book-title">{{ review.title }}</h1>
                <p class="book-author">{{ review.author }}</p>
                <p v-if="review.isbn" class="book-isbn">ISBN: {{ review.isbn }}</p>
              </div>
              <div class="rating-display">
                <div class="stars">
                  <ion-icon
                    v-for="star in 5"
                    :key="star"
                    :icon="star <= review.rating ? star : starOutline"
                    :class="{ 'filled': star <= review.rating }"
                    class="star-icon"
                  ></ion-icon>
                </div>
                <span class="rating-text">{{ review.rating }}점</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- 독후감 내용 -->
        <ion-card class="content-card">
          <ion-card-header>
            <ion-card-title>줄거리 요약</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p class="summary-text">{{ review.summary }}</p>
          </ion-card-content>
        </ion-card>

        <ion-card class="content-card">
          <ion-card-header>
            <ion-card-title>독후감</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p class="review-text">{{ review.review }}</p>
          </ion-card-content>
        </ion-card>

        <!-- 인상 깊은 구절 -->
        <ion-card v-if="review.favoriteQuote" class="content-card quote-card">
          <ion-card-header>
            <ion-card-title>
              <ion-icon :icon="chatbubbleOutline" class="quote-icon"></ion-icon>
              인상 깊은 구절
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <blockquote class="favorite-quote">{{ review.favoriteQuote }}</blockquote>
          </ion-card-content>
        </ion-card>

        <!-- 태그 -->
        <ion-card v-if="review.tags.length > 0" class="content-card">
          <ion-card-header>
            <ion-card-title>태그</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="tags-container">
              <ion-chip
                v-for="tag in review.tags"
                :key="tag"
                class="tag-chip"
              >
                {{ tag }}
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- 메타 정보 -->
        <ion-card class="meta-card">
          <ion-card-content>
            <div class="meta-info">
              <div class="meta-item">
                <ion-icon :icon="calendar" class="meta-icon"></ion-icon>
                <span>읽은 날짜: {{ formatDate(review.readDate) }}</span>
              </div>
              <div class="meta-item">
                <ion-icon :icon="time" class="meta-icon"></ion-icon>
                <span>작성일: {{ formatDate(review.createdAt) }}</span>
              </div>
              <div v-if="review.updatedAt !== review.createdAt" class="meta-item">
                <ion-icon :icon="create" class="meta-icon"></ion-icon>
                <span>수정일: {{ formatDate(review.updatedAt) }}</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <div v-else class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>독후감을 불러오는 중...</p>
      </div>

      <!-- 삭제 확인 알림 -->
      <ion-alert
        :is-open="showDeleteAlert"
        header="독후감 삭제"
        message="정말로 이 독후감을 삭제하시겠습니까?"
        :buttons="alertButtons"
        @did-dismiss="showDeleteAlert = false"
      ></ion-alert>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonSpinner,
  IonAlert,
} from '@ionic/vue';
import {
  create,
  trash,
  star,
  starOutline,
  chatbubbleOutline,
  calendar,
  time,
} from 'ionicons/icons';

import { useBookReviewStore } from '@/stores/bookReviewStore';
import { formatDate } from '@/utils/dateUtils';
import type { BookReview } from '@/types/bookReview';

const route = useRoute();
const router = useRouter();
const { getReview, deleteReview: deleteReviewAction } = useBookReviewStore();

const review = ref<BookReview | null>(null);
const showDeleteAlert = ref(false);

const editReview = () => {
  if (review.value) {
    router.push(`/edit-review/${review.value.id}`);
  }
};

const deleteReview = () => {
  showDeleteAlert.value = true;
};

const confirmDelete = async () => {
  if (review.value) {
    try {
      await deleteReviewAction(review.value.id);
      router.push('/');
    } catch (error) {
      console.error('독후감 삭제 실패:', error);
    }
  }
};

const alertButtons = [
  {
    text: '취소',
    role: 'cancel',
  },
  {
    text: '삭제',
    role: 'destructive',
    handler: confirmDelete,
  },
];

onMounted(() => {
  const reviewId = route.params.id as string;
  if (reviewId) {
    review.value = getReview(reviewId);
    if (!review.value) {
      router.push('/');
    }
  }
});
</script>

<style scoped>
.book-info-card {
  margin: 16px;
  border-radius: 12px;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.book-details {
  flex: 1;
  margin-right: 16px;
}

.book-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ion-color-dark);
}

.book-author {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: var(--ion-color-medium);
}

.book-isbn {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-light);
}

.rating-display {
  text-align: center;
}

.stars {
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
}

.star-icon {
  font-size: 20px;
  color: var(--ion-color-light);
}

.star-icon.filled {
  color: var(--ion-color-warning);
}

.rating-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.content-card {
  margin: 0 16px 16px 16px;
  border-radius: 12px;
}

.summary-text,
.review-text {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--ion-color-dark);
  white-space: pre-wrap;
}

.quote-card {
  background: linear-gradient(135deg, var(--ion-color-light), var(--ion-color-primary-tint));
}

.quote-icon {
  margin-right: 8px;
  color: var(--ion-color-primary);
}

.favorite-quote {
  margin: 0;
  font-size: 16px;
  font-style: italic;
  line-height: 1.6;
  color: var(--ion-color-dark);
  border-left: 4px solid var(--ion-color-primary);
  padding-left: 16px;
  white-space: pre-wrap;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
}

.meta-card {
  margin: 0 16px 32px 16px;
  border-radius: 12px;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.meta-icon {
  font-size: 16px;
  color: var(--ion-color-primary);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-container p {
  margin-top: 16px;
  color: var(--ion-color-medium);
}
</style>
