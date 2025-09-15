import { ref, onMounted } from 'vue';

export const usePWA = () => {
  const canInstall = ref(false);
  const isInstalled = ref(false);
  /**
   * any: 모든 타입을 허용하는 TypeScript의 타입 지정
   */
  let deferredPrompt: any = null;

  /**
   * onMounted: 라이프사이클 훅, 컴포넌트가 마운트(DOM에 추가)된 후 실행되는 코드 정의
   */
  onMounted(() => {
    // beforeinstallprompt 이벤트 리스너
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // 기본 동작 방지 (자동 설치 프롬프트 방지)
      deferredPrompt = e; // 설치를 위한 prompt 저장
      canInstall.value = true; // 설치 간으 상태로 표시
      console.log('PWA 설치 가능 상태');
    });

    // 앱이 이미 설치되어 있는지 확인
    /**
     * display-mode: standalone는  웹앱 설치 후 전체 화면 모드에서 실행되는 CSS 미디어쿼리
     * window.matchMedia('(display-mode: standalone)': 현재 화면이 standalone 모드인지 확인하는 mediaQueryList 객체를 반환
     * .matches: 미디어쿼리가 현재 화면에 적용되었는지 여부를 나타내는 boolean 값을 반환
     * -> 따라서 아래에서 true: 이미 설치 / false: 설치 안됨
     * 
     * display=mode
     * - fullscreen: 전체 화면 모드
     * - standalone: 홈 화면에 설치된 앱처럼 실행되는 경우 (주소 표시줄이 없는 모드)
     * - minimal-ui: 일부 브라우저에서 제공하는 최소한의 UI만 제공되는 모드
     * - browser: 일반적인 브라우저 모드
     */
    if (window.matchMedia('(display-mode: standalone)').matches) { 
      isInstalled.value = true;
      canInstall.value = false;
    }

    /**
     * PWA 설치 완료시 발생하는 이벤트
     */
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true;
      canInstall.value = false;
      deferredPrompt = null; // 설치 프롬프트 초기화
      console.log('PWA 설치 완료');
    });
  });

  /**
   * async 함수: 비동기 작업을 수행하고 결과를 반환하는 함수
   * Promise<boolean>: boolean 값을 반환하는 Promise 객체를 반환한다.
   */
  const installApp = async (): Promise<boolean> => {
    // 설치 프롬프트 검증
    if (!deferredPrompt) {
      console.log('설치 프롬프트가 없습니다');
      return false;
    }

    try {
      // 설치 프롬프트 표시
      deferredPrompt.prompt();

      // 사용자 선택 대기
      // await: 비동기 작업이 완료될 때까지 기다리는 키워드
      // userChoice: 사용자에게 질문하는 과정
      const choiceResult = await deferredPrompt.userChoice;
      
      // outcome: 사용자가 질문에 답변한 내용
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

    // navigator.share: 브라우저에서 공유 기능을 제공하는 객체(Web Share API)
    // 기기의 기본 공유 시트를 열어 제목, 텍스트, URL 등을 다른 앱으로 공유하게 해주는 기능
    if (navigator.share) {
      navigator.share({
        title: '독후감 - Relive',
        text: '간편하게 독후감을 작성하고 관리할 수 있는 앱',
        url: window.location.href,
      });
    } else {
      // 현재 페이지 주소를 클립보드에 저장
      // window.location.href: 현재 페이지의 URL을 반환
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
