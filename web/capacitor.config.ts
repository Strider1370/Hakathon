import type { CapacitorConfig } from '@capacitor/cli';

// 지킴e 안드로이드 래퍼. server.url 로 배포 https를 직접 로드(화면은 서버에서 실시간).
// webDir 은 자리표시 폴더(index.html 한 장)면 됨 — server.url 을 쓰므로.
const config: CapacitorConfig = {
  appId: 'kr.jikime.app',
  appName: '지킴e',
  webDir: 'capacitor-www',
  server: { url: 'https://projectamo.co.kr' },
};

export default config;
