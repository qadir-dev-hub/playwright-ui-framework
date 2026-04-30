$sdk = 'C:\Users\aqadi\AppData\Local\Android\Sdk'
$javaHome = 'C:\Program Files\Android\Android Studio\jbr'
$appium = 'C:\Users\aqadi\AppData\Roaming\npm\appium.cmd'
$log = 'C:\Studies\Agentic AI\playwright-ui-framework\appium-native-session.log'
$err = 'C:\Studies\Agentic AI\playwright-ui-framework\appium-native-session.err.log'

Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -match 'appium' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2
Remove-Item $log, $err -ErrorAction SilentlyContinue

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"

Start-Process -FilePath $appium `
  -ArgumentList '--address', '127.0.0.1', '--port', '4723', '--base-path', '/' `
  -RedirectStandardOutput $log `
  -RedirectStandardError $err `
  -WindowStyle Hidden

$status = $null
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Seconds 2
  try {
    $status = Invoke-RestMethod -Uri 'http://127.0.0.1:4723/status' -Method Get
    if ($status.value.ready) {
      break
    }
  } catch {
  }
}

if (-not $status -or -not $status.value.ready) {
  Write-Error 'Appium did not become ready on http://127.0.0.1:4723'
}

$body = @{
  capabilities = @{
    alwaysMatch = @{
      platformName = 'Android'
      'appium:automationName' = 'UiAutomator2'
      'appium:deviceName' = 'Pixel 5'
      'appium:udid' = 'emulator-5554'
      'appium:platformVersion' = '11'
      'appium:app' = 'C:\Studies\Agentic AI\playwright-ui-framework\Mobile_apps\Android.SauceLabs.Mobile.Sample.app.2.7.1.apk'
      'appium:appPackage' = 'com.swaglabsmobileapp'
      'appium:appActivity' = 'com.swaglabsmobileapp.MainActivity'
      'appium:appWaitActivity' = 'com.swaglabsmobileapp.MainActivity'
      'appium:newCommandTimeout' = 120
      'appium:noReset' = $false
      'appium:fullReset' = $false
    }
  }
} | ConvertTo-Json -Depth 8

Invoke-RestMethod -Uri 'http://127.0.0.1:4723/session' -Method Post -ContentType 'application/json' -Body $body |
  ConvertTo-Json -Depth 10
