# Platform Support

Quran for All is available on multiple platforms.

## Supported Platforms

### ✅ Web Browser

- Works in any modern web browser

### ✅ Desktop Applications

- **Windows**: Native Windows application (.exe, .msi)
- **Linux**: Native Linux application (.deb, .AppImage)
- **macOS**: Native macOS application (.dmg)

### ✅ Mobile Applications

- **Android**: Native Android APK

## Building

### Desktop

```bash
npx tauri build
```

### Android

```bash
npx tauri android build
```

## Android Development Setup

1. Install Android Studio and Android SDK
2. Set up environment variables:

   ```bash
   export ANDROID_HOME=/path/to/android-sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

3. Initialize Android support:

   ```bash
   npx tauri android init
   ```

4. Build:
   ```bash
   npx tauri android build --debug
   ```

## Features Available on All Platforms

- Browse Quran by Surah or Juz
- Read Arabic text with translations
- Audio recitation playback
- Multiple translation languages
- Dark/light theme support
- Offline-capable

## Troubleshooting

### Android Build Issues

- **Bundle Identifier Error**: Update identifier in `src-tauri/tauri.conf.json`, delete `src-tauri/gen/android`, and run `npx tauri android init` again
- **Android SDK Not Found**: Install Android Studio and set ANDROID_HOME environment variable

### General Issues

- Run `npm run build` first to check for errors
- Ensure all dependencies are installed with `npm install`
