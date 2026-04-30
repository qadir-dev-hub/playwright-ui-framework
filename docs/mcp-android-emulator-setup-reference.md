# MCP + Android Emulator Setup Reference

This reference captures the setup we used in this repo to run Android native-app automation through MCP, Appium, and an Android emulator on Windows.

It combines:

- the repo's MCP setup
- the Android/Appium setup from the native-app docs
- the exact fixes we needed in chat to make the session work on this machine

Repo root used in this setup:

`C:\Studies\Agentic AI\playwright-ui-framework`

Target app used in the working session:

`C:\Studies\Agentic AI\playwright-ui-framework\Mobile_apps\Android.SauceLabs.Mobile.Sample.app.2.7.1.apk`

Working emulator used in the session:

- `deviceName`: `Pixel 5`
- `udid`: `emulator-5554`
- `platformVersion`: `11`

## 1. What This Setup Does

The working stack is:

1. Android Studio provides the Android SDK and emulator.
2. Appium provides native Android automation.
3. The `uiautomator2` Appium driver drives the app on the emulator.
4. MCP uses the repo-level `.mcp.json` file to talk to Appium.
5. A local PowerShell helper script starts Appium with the environment variables that Windows needs on this machine.

## 2. Files In This Repo That Matter

### `.mcp.json`

This repo already contains the MCP server config:

```json
{
  "mcpServers": {
    "wdio-mcp": {
      "command": "npx",
      "args": ["-y", "@wdio/mcp"],
      "env": {
        "APPIUM_URL": "127.0.0.1",
        "APPIUM_URL_PORT": "4723",
        "APPIUM_PATH": "/"
      }
    }
  }
}
```

This tells MCP to use `@wdio/mcp` and connect to Appium at:

`http://127.0.0.1:4723/`

### Helper script

This repo now also contains a working helper script:

`scripts/create-native-android-session.ps1`

That script:

- kills old Appium processes
- sets Android SDK environment variables
- sets Java environment variables
- starts Appium on `127.0.0.1:4723`
- creates a native Android session for the Swag Labs APK

## 3. Software Needed On A New Windows Computer

Install these first:

1. Node.js
2. Android Studio
3. Appium
4. The Appium `uiautomator2` driver
5. Playwright dependencies already used by the repo

Commands:

```powershell
npm install -g appium
appium driver install uiautomator2
```

If PowerShell blocks `appium.ps1`, use `appium.cmd` instead.

Example path on this machine:

`C:\Users\aqadi\AppData\Roaming\npm\appium.cmd`

## 4. Android Studio And Emulator Setup

On the new machine:

1. Install Android Studio.
2. Open Android Studio and install the Android SDK.
3. Make sure `platform-tools`, `build-tools`, and an Android 11 system image are installed.
4. Create an Android Virtual Device in Device Manager.
5. Start the emulator before asking the AI to open the app session.

The working emulator in this project was:

- device profile similar to `Pixel 5`
- Android version `11`
- visible to ADB as `emulator-5554`

Check that the emulator is connected:

```powershell
adb devices
```

If `adb` is not on `PATH`, call it with its full SDK path.

Example on this machine:

`C:\Users\aqadi\AppData\Local\Android\Sdk\platform-tools\adb.exe`

## 5. Windows-Specific Fixes We Needed

These were the big issues we hit, and they matter because they are common on Windows.

### ADB was not on `PATH`

Fix:

- use the full path to `adb.exe`, or
- add the Android SDK `platform-tools` folder to `PATH`

### PowerShell blocked `appium.ps1`

Fix:

- use `appium.cmd` instead of `appium`

### Appium could not find the Android SDK

We had to set:

```powershell
$env:ANDROID_HOME="C:\Users\aqadi\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT="C:\Users\aqadi\AppData\Local\Android\Sdk"
```

### Appium could not verify the APK signature because Java was missing

We had to set:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
```

This used the Java runtime bundled with Android Studio.

### The app launched, but Appium waited on the wrong activity

The APK manifest initially pointed Appium toward a splash activity, but the app settled on:

`com.swaglabsmobileapp.MainActivity`

The working session needed these capabilities:

- `appium:appPackage = com.swaglabsmobileapp`
- `appium:appActivity = com.swaglabsmobileapp.MainActivity`
- `appium:appWaitActivity = com.swaglabsmobileapp.MainActivity`

## 6. Working Session Settings

These are the exact capabilities that worked in the final session:

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Pixel 5",
  "appium:udid": "emulator-5554",
  "appium:platformVersion": "11",
  "appium:app": "C:\\Studies\\Agentic AI\\playwright-ui-framework\\Mobile_apps\\Android.SauceLabs.Mobile.Sample.app.2.7.1.apk",
  "appium:appPackage": "com.swaglabsmobileapp",
  "appium:appActivity": "com.swaglabsmobileapp.MainActivity",
  "appium:appWaitActivity": "com.swaglabsmobileapp.MainActivity",
  "appium:newCommandTimeout": 120,
  "appium:noReset": false,
  "appium:fullReset": false
}
```

## 7. Helper Script We Ended Up Using

The helper script in:

`scripts/create-native-android-session.ps1`

is the easiest local recovery path for this repo.

It already contains:

- the SDK path
- the Java path
- the Appium server start
- the final working capabilities

On another computer, this script will probably need path edits for:

- Android SDK location
- Java location
- global npm location for `appium.cmd`
- APK location if the repo path changes

## 8. Recommended Startup Flow

This is the clean day-to-day order to follow:

1. Start the Android emulator.
2. Confirm the device is visible with `adb devices`.
3. Make sure `.mcp.json` is present in the repo.
4. Start Appium.
5. If Windows needs it, use the helper PowerShell script instead of launching Appium manually.
6. Reload the MCP client so it picks up the repo MCP config.
7. Ask the AI to start the native Android session.
8. Once the session opens, ask the AI to inspect the screen and continue the flow.

## 9. How We Verified Things During Setup

These were the main checks used while debugging:

### Check emulator availability

```powershell
adb devices
```

### Check Appium version

```powershell
appium.cmd -v
```

### Check installed Appium driver

```powershell
appium.cmd driver list --installed
```

Expected driver:

`uiautomator2`

### Check Appium server status

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:4723/status" -Method Get
```

### Check Appium logs

Use:

- `appium-native-session.log`
- `appium-native-session.err.log`

Those logs were the fastest way to spot:

- missing SDK variables
- missing Java
- wrong activity names
- session creation failures

## 10. Login Credentials Seen In The Working App

When the app opened to the login screen, the visible hint panel showed:

- usernames: `standard_user`, `locked_out_user`, `problem_user`
- password: `secret_sauce`

The successful login used:

- username: `standard_user`
- password: `secret_sauce`

## 11. Short Prompt To Reuse Later

For a future session on the same machine, this is enough:

```text
Start the Android Appium session on emulator-5554 and open the Swag Labs APK, then continue from there.
```

More explicit version:

```text
Start a native Android Appium session with:
deviceName: Pixel 5
udid: emulator-5554
platformVersion: 11
appPath: C:\Studies\Agentic AI\playwright-ui-framework\Mobile_apps\Android.SauceLabs.Mobile.Sample.app.2.7.1.apk

If needed, use the existing helper script in the repo to bring Appium up, then launch the app and continue with the test flow.
```

## 12. What To Change On Another Computer

On a different Windows computer, expect to update:

1. Android SDK path
2. Java path
3. Global npm path to `appium.cmd`
4. Emulator name or UDID
5. APK path

The MCP config itself can stay the same as long as Appium still runs locally at:

`127.0.0.1:4723`

## 13. Practical Troubleshooting Checklist

If the session does not start:

1. Make sure the emulator is already booted.
2. Run `adb devices`.
3. Confirm `uiautomator2` is installed.
4. Confirm Appium is listening on port `4723`.
5. Confirm `ANDROID_HOME` and `ANDROID_SDK_ROOT` are set.
6. Confirm `JAVA_HOME` points to a valid Java runtime.
7. Check the Appium log for the exact failing step.
8. If the app launches but Appium times out, confirm the real activity name and update `appWaitActivity`.

## 14. Local Reference Files

Useful files in this repo:

- `docs/wdio-mcp-native-apps.md`
- `.mcp.json`
- `scripts/create-native-android-session.ps1`
- `appium-native-session.log`
- `appium-native-session.err.log`

## 15. Final Outcome On This Machine

The final working result was:

- Appium running at `http://127.0.0.1:4723`
- emulator visible as `emulator-5554`
- native Android session created successfully
- Swag Labs app opened successfully
- login completed successfully
- app landed on the `PRODUCTS` screen
