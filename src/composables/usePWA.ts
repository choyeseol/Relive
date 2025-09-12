import { ref, onMounted } from 'vue';

export const usePWA = () => {
  const canInstall = ref(false);
  const isInstalled = ref(false);
  let deferredPrompt: any = null;

  onMounted(() => {
    // beforeinstallprompt 이벤트 리스너
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      canInstall.value = true;
      console.log('PWA 설치 가능 상태');
    });

    // 앱이 이미 설치되어 있는지 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true;
      canInstall.value = false;
    }

    // appinstalled 이벤트 리스너
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true;
      canInstall.value = false;
      deferredPrompt = null;
      console.log('PWA 설치 완료');
    });
  });

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('설치 프롬프트가 없습니다');
      return false;
    }

    try {
      // 설치 프롬프트 표시
      deferredPrompt.prompt();

      // 사용자 선택 대기
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 PWA 설치에 동의했습니다');
        isInstalled.value = true;
        canInstall.value = false;
        deferredPrompt = null;
        return true;
      } else {
        console.log('사용자가 PWA 설치를 거부했습니다');
        return false;
      }
    } catch (error) {
      console.error('PWA 설치 중 오류 발생:', error);
      return false;
    }
  };

  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: '독후감 - Relive',
        text: '간편하게 독후감을 작성하고 관리할 수 있는 앱',
        url: window.location.href,
      });
    } else {
      // fallback: URL 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return {
    canInstall,
    isInstalled,
    installApp,
    shareApp,
  };
};
