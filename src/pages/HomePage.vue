<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>독후감</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="refreshReviews" :disabled="isLoading">
            <ion-icon :icon="refresh" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button router-link="/add-review">
            <ion-icon :icon="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">독후감</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- PWA 설치 프롬프트 불러오기-->
      <InstallPrompt />

      <!-- 통계 카드 -->
      <ion-card class="stats-card">
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ totalReviews }}</div>
              <div class="stat-label">총 독후감</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ averageRating }}</div>
              <div class="stat-label">평균 평점</div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 검색 및 필터 -->
      <ion-card class="search-card">
          <ion-item class="search-item">
            <ion-icon :icon="search" slot="start" class="search-icon"></ion-icon>
            <ion-input
              v-model="searchQuery"
              placeholder="제목, 저자, 내용으로 검색..."
              class="search-input"
            ></ion-input>
            <ion-icon 
              v-if="searchQuery" 
              :icon="close" 
              slot="end" 
              class="clear-icon"
              @click="clearSearch"
            ></ion-icon>
          </ion-item>
      </ion-card>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>독후감을 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <ion-card v-if="error" class="error-card">
        <ion-card-content>
          <div class="error-content">
            <ion-icon :icon="alertCircle" class="error-icon"></ion-icon>
            <p>{{ error }}</p>
            <ion-button fill="outline" @click="loadReviews">다시 시도</ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- 독후감 목록 -->
      <div v-if="!isLoading && !error">
        <div v-if="filteredReviews.length === 0" class="empty-state">
          <ion-icon :icon="bookOutline" class="empty-icon"></ion-icon>
          <h3 v-if="!searchQuery">독후감이 없습니다</h3>
          <h3 v-else>검색 결과가 없습니다</h3>
          <p v-if="!searchQuery">첫 번째 독후감을 작성해보세요!</p>
          <p v-else>"{{ searchQuery }}"에 대한 검색 결과가 없습니다.</p>
          <ion-button router-link="/add-review" fill="outline" v-if="!searchQuery">
            작성하기
          </ion-button>
          <ion-button @click="clearSearch" fill="outline" v-else>
            검색 초기화
          </ion-button>
        </div>

        <BookReviewCard
          v-for="review in filteredReviews"
          :key="review.id"
          :review="review"
        />
      </div>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button router-link="/add-review">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonFab,
  IonFabButton,
} from '@ionic/vue';
import {
  add,
  refresh,
  alertCircle,
  bookOutline,
  search,
  close,
} from 'ionicons/icons';

import { useBookReviewStore } from '@/stores/bookReviewStore';
import InstallPrompt from '@/components/InstallPrompt.vue';
import BookReviewCard from '@/components/BookReviewCard.vue';
const {
  reviews,
  isLoading,
  error,
  totalReviews,
  averageRating,
  loadReviews,
  searchReviews,
} = useBookReviewStore();

const searchQuery = ref('');

const filteredReviews = computed(() => {
  if (!searchQuery.value) {
    return reviews.value;
  }
  
  const results = searchReviews({ search: searchQuery.value });
  return results;
});

const clearSearch = () => {
  searchQuery.value = '';
};


const refreshReviews = async () => {
  await loadReviews();
};

onMounted(async () => {
  await loadReviews();
});

onActivated(async () => {
  await loadReviews();
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #229bff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--ion-color-medium);
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


.error-content {
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 48px;
  color: var(--ion-color-danger);
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-light);
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: var(--ion-color-medium);
}

.empty-state p {
  margin: 0 0 24px 0;
  color: var(--ion-color-medium);
}

/* 모든 그림자 효과 제거하고 stroke로 변경 */
.stats-card {
  margin: 16px;
  border-radius: 12px;
  box-shadow: none !important;
  border: 1px solid #e4e4e4;
}

.search-card {
  margin: 0 16px 16px 16px;
  border-radius: 12px;
  box-shadow: none !important;
  border: 1px solid #e4e4e4;
}

.error-card {
  margin: 16px;
  border-radius: 12px;
  box-shadow: none !important;
  border: 1px solid #e4e4e4;
}

/* ion-card 기본 그림자 제거 */
ion-card {
  box-shadow: none !important;
  border: 1px solid #e4e4e4;
}

/* ion-button 기본 그림자 제거 */
ion-button {
  box-shadow: none !important;
}

/* ion-fab-button 기본 그림자 제거 */
ion-fab-button {
  box-shadow: none !important;
  --background: #229bff;
  border: none;
}

/* ion-item의 기본 스타일 오버라이드 */
.search-item {
  --border-style: none;
  --border-width: 0;
  --inner-border-width: 0;
  --border-color: transparent;
}

.search-icon {
  color: #b3b3b3;
  margin-right: 8px;
}

.clear-icon {
  color: var(--ion-color-medium);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.clear-icon:hover {
  background-color: var(--ion-color-light);
}

/* 작성하기 버튼 스타일 */
.empty-state ion-button {
    font-size: 14px;
  --color: #229bff;
  --border-color: #229bff;
}

/* ion-header ion-toolbar 기본 그림자 제거 */
ion-header ion-toolbar {
  box-shadow: none !important;
  border-bottom: 1px solid #e4e4e4;
}

/* 전역 그림자 효과 제거 */
:root {
  --ion-shadow-color: transparent;
  --ion-box-shadow: none;
}

/* 모든 요소의 그림자 제거 */
* {
  box-shadow: none !important;
}
</style>
