# WDIO MCP For Native Apps

This repo now includes a project-level MCP config in `.mcp.json` for `@wdio/mcp`.

On this Windows machine, the practical native-app path is Android via Appium.
iOS native app automation requires macOS with Xcode.

## What This Adds

- Project MCP server config for `@wdio/mcp`
- Default Appium connection to `127.0.0.1:4723`
- A clean starting point for Android emulator or Android real-device automation

## Prerequisites

1. Install Android Studio and create or start an emulator.
2. Install Appium globally:

```bash
npm install -g appium
```

3. Install the Android Appium driver:

```bash
appium driver install uiautomator2
```

4. Start Appium:

```bash
appium
```

5. Confirm a device is available:

```bash
adb devices
```

## MCP Config

The repo-level `.mcp.json` contains:

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

If your Appium server uses a different host, port, or base path, update those values.

## Example Android Session

Once your MCP client reloads and Appium is running, start a native Android app session with values like:

```json
{
  "platform": "Android",
  "deviceName": "Pixel 7",
  "automationName": "UiAutomator2",
  "appPath": "C:\\path\\to\\your-app.apk",
  "newCommandTimeout": 120,
  "noReset": false,
  "fullReset": true
}
```

Notes:

- `deviceName` should match your running emulator or connected device.
- `appPath` should point to a real `.apk`.
- If the app is already installed and running, you can often reuse state with `noReset: true`.

## Recommended App Location In This Repo

If you want a stable convention in this project, place the APK under:

```text
test-data/mobile/
```

For example:

```text
test-data/mobile/app-debug.apk
```

Then use an absolute path when starting the app session.

## Common Issues

### MCP server starts but app session fails

- Appium is not running
- `uiautomator2` is not installed
- No emulator/device is connected
- The APK path is wrong

### Device not found

Check:

```bash
adb devices
```

### Appium on a non-default path

If you started Appium with:

```bash
appium --base-path /wd/hub
```

set:

```json
"APPIUM_PATH": "/wd/hub"
```

## Suggested First Flow

1. Start Android emulator
2. Start Appium
3. Reload your MCP client so it picks up `.mcp.json`
4. Start an Android app session
5. Ask the agent to inspect visible elements and interact by accessibility ID first

## Best Practice

Prefer accessibility IDs in the native app when possible. They are the most stable cross-platform locator strategy for Appium-driven native automation.
