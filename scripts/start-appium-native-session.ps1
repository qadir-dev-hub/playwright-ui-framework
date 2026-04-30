$log = 'C:\Studies\Agentic AI\playwright-ui-framework\appium-native-session.log'
$err = 'C:\Studies\Agentic AI\playwright-ui-framework\appium-native-session.err.log'
$sdk = 'C:\Users\aqadi\AppData\Local\Android\Sdk'

Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -match 'appium' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2
Remove-Item $log, $err -ErrorAction SilentlyContinue

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk

& 'C:\Users\aqadi\AppData\Roaming\npm\appium.cmd' --address 127.0.0.1 --port 4723 --base-path / `
  1>> $log `
  2>> $err
