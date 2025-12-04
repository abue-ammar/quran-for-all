# Quran For All - Tauri + React Boilerplate

A modern, production-ready boilerplate for building cross-platform desktop applications using **Tauri**, **React**, **TypeScript**, and **Tailwind CSS**.

This project serves as a foundation for building desktop applications with a professional CI/CD pipeline, theming system, and native platform support (macOS, Windows, Linux, and Android).

## 🚀 Features

- **⚡ Tauri Desktop Framework** - Lightweight, secure, and fast desktop app runtime
- **⚛️ React 19** - Modern UI library with hooks
- **🎨 Tailwind CSS** - Utility-first CSS framework  
- **🌙 Dark/Light Theme** - Built-in theme switching with `next-themes`
- **🔧 TypeScript** - Full type safety and better DX
- **📱 Cross-Platform** - macOS, Windows, Linux, and Android support
- **🚀 Vite** - Lightning-fast build tool
- **🔒 Pre-configured Security** - Tauri capabilities and security best practices
- **🎯 Modern Tooling** - ESLint, Prettier, component library (shadcn/ui)

## 📋 Project Structure

```
├── src/                          # Frontend source code (React + TypeScript)
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components (shadcn/ui)
│   │   ├── header.tsx          # App header
│   │   ├── footer.tsx          # App footer
│   │   ├── theme-provider.tsx  # Theme configuration
│   │   └── mode-toggle.tsx     # Dark/light mode toggle
│   ├── hooks/                  # Custom React hooks
│   │   └── useCommon.ts        # Generic hooks (useAsync, useLocalStorage, etc.)
│   ├── lib/                    # Utility libraries
│   │   ├── utils.ts            # Common utility functions
│   │   ├── download.ts         # File download utilities
│   │   └── platform.ts         # Platform detection
│   ├── types/                  # TypeScript type definitions
│   │   └── common.ts           # Shared types and interfaces
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
│
├── src-tauri/                   # Tauri backend (Rust)
│   ├── src/                    # Rust source code
│   │   ├── lib.rs              # Library functions
│   │   └── main.rs             # Application entry
│   ├── icons/                  # Application icons
│   ├── capabilities/           # Tauri security capabilities
│   ├── gen/                    # Generated build files
│   │   └── android/            # Android-specific configuration
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── build.rs                # Build script
│
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── eslint.config.js            # ESLint rules
└── components.json             # shadcn/ui components config
```

## 🛠️ Setup

### Prerequisites

- **Node.js** 20+ and npm
- **Rust** toolchain (for Tauri development)
  - Install: https://rustup.rs/
- For Android development:
  - Android SDK & NDK
  - Java Development Kit (JDK)

### Installation

```bash
# Clone or use as template
git clone <repository-url>
cd quran-for-all

# Install dependencies
npm install

# For Android setup (optional)
npm run setup-android
```

## 📚 Available Scripts

### Development

```bash
# Start web development server
npm run dev

# Start Tauri development (desktop app)
npm run tauri dev

# Start Tauri Android development
npm run tauri:android
```

### Building

```bash
# Build web version
npm run build

# Preview production build
npm run preview

# Build Tauri desktop app
npm run tauri build
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 🎨 Theme System

The project includes a built-in dark/light theme system using `next-themes`:

```tsx
import { ThemeProvider } from "./components/theme-provider";
import ModeToggle from "./components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ModeToggle />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## 🧩 Using the Boilerplate

### 1. Start Your Project

Replace the welcome content in `src/App.tsx` with your application logic:

```tsx
function App() {
  return (
    <ThemeProvider>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Your content here */}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
```

### 2. Add Components

Create components in `src/components/`:

```tsx
// src/components/my-feature.tsx
export function MyFeature() {
  return <div>Your feature here</div>;
}
```

### 3. Use Custom Hooks

Generic hooks are available in `src/hooks/useCommon.ts`:

```tsx
import { useAsync, useLocalStorage, useToggle } from "@/hooks/useCommon";

function MyComponent() {
  const [isOpen, toggle] = useToggle(false);
  const [preferences, setPreferences] = useLocalStorage("prefs", {});
  
  return (
    // Your component
  );
}
```

### 4. Define Your Types

Add application-specific types to `src/types/common.ts`:

```tsx
export interface DataModel {
  id: string;
  name: string;
  // ... your fields
}
```

### 5. Configure Tauri

Update `src-tauri/tauri.conf.json` with your app details:

```json
{
  "productName": "Your App Name",
  "identifier": "com.yourcompany.yourapp",
  "version": "1.0.0"
}
```

## 🔐 Tauri Capabilities

Tauri uses a capability-based security model. Configure capabilities in `src-tauri/capabilities/`:

- **default.json** - Base capabilities (usually sufficient for most apps)

To enable specific features (file system, dialog, etc.), update the capabilities file according to Tauri documentation.

## 📦 Adding Dependencies

### Frontend (React packages)

```bash
npm install package-name
```

### Backend (Rust packages)

```bash
cd src-tauri
cargo add package-name
```

## 🚀 Deployment

### Desktop App

```bash
# Build for all platforms
npm run tauri build

# Build for specific platform
npm run tauri build -- --target universal-apple-darwin  # macOS
npm run tauri build -- --target x86_64-pc-windows-msvc  # Windows
npm run tauri build -- --target x86_64-unknown-linux-gnu # Linux
```

### Android App

```bash
npm run tauri build -- --target aarch64-linux-android
```

### Web Version

```bash
npm run build
# Output will be in dist/ directory
```

## 🎯 Quick Tips

- **Add UI Components**: Use `npx shadcn-ui@latest add` to add shadcn/ui components
- **File Downloads**: Use utilities in `src/lib/download.ts` for cross-platform file downloads
- **Platform Detection**: Use `src/lib/platform.ts` to detect the running platform
- **Type Safety**: Always define types in `src/types/` for better maintainability

## 📖 Documentation

- [Tauri Docs](https://tauri.app)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Support

For issues or questions:
1. Check existing documentation
2. Review Tauri and React documentation
3. Open an issue with detailed information

---

**Ready to build something amazing! 🚀**
