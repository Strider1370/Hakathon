package kr.jikime.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // 1) 런타임 마이크 권한 요청 (Android 6+). 음성(getUserMedia)에 필요.
    if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
      requestPermissions(new String[] { Manifest.permission.RECORD_AUDIO }, 4001);
    }

    // 2) WebView가 마이크 권한을 요청하면 즉시 승인 (getUserMedia 신뢰성 ↑).
    getBridge().getWebView().setWebChromeClient(new BridgeWebChromeClient(getBridge()) {
      @Override
      public void onPermissionRequest(final PermissionRequest request) {
        runOnUiThread(() -> request.grant(request.getResources()));
      }
    });
  }
}
