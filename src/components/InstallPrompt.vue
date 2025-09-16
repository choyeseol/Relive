<template>
  <ion-card v-if="canInstall && !isInstalled" class="install-prompt">
    <ion-card-content>
      <div class="install-content">
        <div class="install-text">
          <h3>앱으로 설치하기</h3>
          <p>홈 화면에 추가하여 더 편리하게 사용하세요!</p>
        </div>
        <!-- 설치하기 버튼 누르면 handleInstall에서 installApp 함수 호출 -->
        <ion-button 
          fill="outline" 
          @click="handleInstall" 
          :disabled="isInstalling"
        >
          <ion-icon :icon="downloadOutline" slot="start" class="install-icon"></ion-icon>
          {{ isInstalling ? '설치 중...' : '설치하기' }}
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/vue';
import { downloadOutline } from 'ionicons/icons';
import { usePWA } from '@/composables/usePWA';

const { canInstall, isInstalled, installApp } = usePWA();
const isInstalling = ref(false);

const handleInstall = async () => {
  isInstalling.value = true;
  try {
    await installApp();
  } catch (error) {
    console.error('설치 중 오류 발생:', error);
  } finally {
    isInstalling.value = false;
  }
};
</script>

<style scoped>
.install-prompt {
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.install-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.install-icon {
  font-size: 24px;
  color: #229bff;
}

.install-text {
  flex: 1;
}

.install-text h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.install-text p {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

/* 설치하기 버튼 스타일링 */
.install-prompt ion-button {
  --color: #229bff;
  --border-color: #229bff;
}

@media (max-width: 768px) {
  .install-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .install-text {
    order: -1;
  }
}
</style>
