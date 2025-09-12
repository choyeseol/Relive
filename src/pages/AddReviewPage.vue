<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>독후감 작성</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="saveReview" :disabled="!isFormValid || isLoading">
            {{ isLoading ? '저장 중...' : '저장' }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">독후감 작성</ion-title>
        </ion-toolbar>
      </ion-header>

      <form @submit.prevent="saveReview">
        <!-- 기본 정보 -->
        <ion-card class="form-card">
          <ion-card-header>
            <ion-card-title class="card-title">기본 정보</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">도서 제목 <span class="required-asterisk">*</span></ion-label>
              <ion-input
                v-model="form.title"
                placeholder="도서 제목을 입력하세요"
                :class="{ 'ion-invalid': errors.title }"
              ></ion-input>
            </ion-item>
            <ion-note v-if="errors.title" color="danger">{{ errors.title }}</ion-note>

            <ion-item>
              <ion-label position="stacked">저자 <span class="required-asterisk">*</span></ion-label>
              <ion-input
                v-model="form.author"
                placeholder="저자명을 입력하세요"
                :class="{ 'ion-invalid': errors.author }"
              ></ion-input>
            </ion-item>
            <ion-note v-if="errors.author" color="danger">{{ errors.author }}</ion-note>

            <ion-item>
              <ion-label position="stacked">읽은 날짜 <span class="required-asterisk">*</span></ion-label>
              <ion-datetime
                v-model="form.readDate"
                presentation="date"
                :max="getCurrentDateString()"
              ></ion-datetime>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- 평점 -->
        <ion-card class="form-card">
          <ion-card-header>
            <ion-card-title class="card-title">평점 <span class="rating-text">{{ form.rating }}점</span></ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="rating-container">
              <ion-icon
                v-for="star in 5"
                :key="star"
                :icon="star <= form.rating ? star : starOutline"
                :class="{ 'filled': star <= form.rating }"
                class="rating-star"
                @click="setRating(star)"
              ></ion-icon>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- 독후감 내용 -->
        <ion-card class="form-card">
          <ion-card-header>
            <ion-card-title class="card-title">독후감</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">줄거리 요약 <span class="required-asterisk">*</span></ion-label>
              <ion-textarea
                v-model="form.summary"
                placeholder="책의 주요 내용을 간단히 요약해주세요"
                :rows="4"
                :class="{ 'ion-invalid': errors.summary }"
              ></ion-textarea>
            </ion-item>
            <ion-note v-if="errors.summary" color="danger">{{ errors.summary }}</ion-note>

            <ion-item>
              <ion-label position="stacked">독후감 <span class="required-asterisk">*</span></ion-label>
              <ion-textarea
                v-model="form.review"
                placeholder="이 책을 읽고 느낀 점, 생각한 점을 자유롭게 작성해주세요"
                :rows="6"
                :class="{ 'ion-invalid': errors.review }"
              ></ion-textarea>
            </ion-item>
            <ion-note v-if="errors.review" color="danger">{{ errors.review }}</ion-note>

            <ion-item>
              <ion-label position="stacked">인상 깊은 구절 (선택사항)</ion-label>
              <ion-textarea
                v-model="form.favoriteQuote"
                placeholder="인상 깊었던 구절이나 명언을 적어주세요"
                :rows="3"
              ></ion-textarea>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- 태그 -->
        <ion-card class="form-card">
          <ion-card-header>
            <ion-card-title class="card-title">태그</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">태그 (쉼표로 구분)</ion-label>
              <ion-input
                v-model="tagInput"
                placeholder="예: 소설, 감동, 성장"
                @ion-input="updateTags"
              ></ion-input>
            </ion-item>
            <div class="tags-display">
              <ion-chip
                v-for="tag in form.tags"
                :key="tag"
                class="tag-chip"
              >
                {{ tag }}
                <ion-icon :icon="close" @click="removeTag(tag)"></ion-icon>
              </ion-chip>
            </div>
          </ion-card-content>
        </ion-card>
      </form>

      <!-- 에러 메시지 -->
      <ion-toast
        v-if="error"
        :is-open="!!error"
        :message="error"
        :duration="3000"
        @did-dismiss="error = null"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonIcon,
  IonNote,
  IonChip,
  IonToast,
} from '@ionic/vue';
import { star, starOutline, close } from 'ionicons/icons';

import { useBookReviewStore } from '@/stores/bookReviewStore';
import { getCurrentDateString } from '@/utils/dateUtils';
import type { CreateBookReviewRequest } from '@/types/bookReview';

const router = useRouter();
const { addReview, isLoading, error } = useBookReviewStore();

const tagInput = ref('');
const errors = ref<Record<string, string>>({});

const form = ref<CreateBookReviewRequest>({
  title: '',
  author: '',
  isbn: '',
  rating: 0,
  review: '',
  summary: '',
  favoriteQuote: '',
  tags: [],
  readDate: getCurrentDateString(),
});

const isFormValid = computed(() => {
  return (
    form.value.title.trim() &&
    form.value.author.trim() &&
    form.value.rating > 0 &&
    form.value.review.trim() &&
    form.value.summary.trim()
  );
});

const setRating = (rating: number) => {
  form.value.rating = rating;
};

const updateTags = () => {
  const tags = tagInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  form.value.tags = tags;
};

const removeTag = (tagToRemove: string) => {
  form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove);
  tagInput.value = form.value.tags.join(', ');
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = '도서 제목을 입력해주세요';
  }

  if (!form.value.author.trim()) {
    errors.value.author = '저자명을 입력해주세요';
  }

  if (!form.value.summary.trim()) {
    errors.value.summary = '줄거리 요약을 입력해주세요';
  }

  if (!form.value.review.trim()) {
    errors.value.review = '독후감을 입력해주세요';
  }

  return Object.keys(errors.value).length === 0;
};

const saveReview = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    await addReview(form.value);
    router.push('/');
  } catch (err) {
    console.error('독후감 저장 실패:', err);
  }
};

// 폼 초기화
onMounted(() => {
});
</script>

<style scoped>
.form-card {
  margin: 16px;
  border-radius: 12px;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
}

.rating-star {
  font-size: 24px;
  color: #e4e4e4;
  cursor: pointer;
  transition: color 0.2s ease;
}

.rating-star.filled {
  color: var(--ion-color-warning);
}

.rating-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag-chip {
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
}

.tag-chip ion-icon {
  margin-left: 8px;
  cursor: pointer;
}

.ion-invalid {
  --border-color: var(--ion-color-danger);
}

.required-asterisk {
  color: var(--ion-color-danger);
  font-weight: bold;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
}

/* 모든 그림자 효과 제거하고 stroke로 변경 */
.form-card {
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

/* ion-chip 기본 그림자 제거 */
ion-chip {
  box-shadow: none !important;
  border: 1px solid var(--ion-color-light-shade);
}

/* ion-toast 기본 그림자 제거 */
ion-toast {
  box-shadow: none !important;
  border: 1px solid var(--ion-color-light-shade);
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

/* Ionic 컴포넌트별 그림자 제거 */
ion-header ion-toolbar {
  box-shadow: none !important;
  border-bottom: 1px solid var(--ion-color-light-shade);
}

ion-content {
  box-shadow: none !important;
}

ion-card-header {
  box-shadow: none !important;
  border-bottom: 1px solid var(--ion-color-light);
}

ion-card-content {
  box-shadow: none !important;
}
</style>
