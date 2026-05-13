# Gamma Terminal - Desktop Application

## Overview
Gamma Terminal is now available as a native desktop application built with Electron. This provides a professional trading terminal experience with native window management, system tray integration, and offline capabilities.

## Development

### Run in Development Mode
```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server on port 8080
2. Launch Electron and load the app from the dev server
3. Open DevTools automatically

### Build for Production

#### Windows
```bash
npm run electron:build:win
```
Creates: NSIS installer (.exe) and portable version

#### macOS
```bash
npm run electron:build:mac
```
Creates: DMG installer and ZIP archive

#### Linux
```bash
npm run electron:build:linux
```
Creates: AppImage and Debian package (.deb)

#### All Platforms
```bash
npm run electron:build
```

## Architecture

### File Structure
```
electron/
├── main.js          # Electron main process
├── preload.js       # Preload script for secure IPC
└── icon.*           # Application icons (add your own)

src/                 # React application source
dist/                # Built web application
release/             # Packaged desktop applications
```

### Key Components

**Main Process (electron/main.js)**
- Creates and manages the application window
- Handles app lifecycle events
- Provides secure IPC communication
- Loads the app (dev server or built files)

**Preload Script (electron/preload.js)**
- Securely exposes Electron APIs to renderer
- Uses context isolation for security
- No direct Node.js access in renderer

**Renderer Process**
- Your React/Vite application
- Runs in a secure sandbox
- Communicates with main process via IPC

## Configuration

### Window Settings
Edit `electron/main.js` to customize:
- Window size (default: 1400x900)
- Minimum size (default: 1024x768)
- Background color (#000000)
- Frame style

### Build Configuration
Edit `package.json` → `build` section to customize:
- App ID and name
- Target platforms
- Installer options
- File inclusion/exclusion

## Security Features

✅ Context isolation enabled
✅ Node integration disabled
✅ Secure preload script
✅ No remote module usage
✅ IPC communication only through exposed APIs

## Adding Icons

Place your application icons in the `electron/` folder:
- `icon.ico` - Windows (256x256 recommended)
- `icon.icns` - macOS (512x512 recommended)
- `icon.png` - Linux (512x512 recommended)

## Troubleshooting

### Dev server not starting
Make sure port 8080 is available:
```bash
netstat -ano | findstr :8080
```

### Build fails
Clear cache and rebuild:
```bash
rm -rf dist release node_modules/.cache
npm run build
npm run electron:build
```

### White screen in production
Check that the build output is correct:
```bash
npm run build
ls dist/client/index.html  # Should exist
```

## Distribution

After building, distribute the files from the `release/` folder:
- **Windows**: `Gamma Terminal Setup X.X.X.exe` (installer) or `.exe` (portable)
- **macOS**: `Gamma Terminal X.X.X.dmg` (installer) or `.zip`
- **Linux**: `Gamma Terminal-X.X.X.AppImage` or `.deb` package

## Next Steps

1. Add custom application icons
2. Configure auto-updates (optional)
3. Add system tray functionality (optional)
4. Implement native menus (optional)
5. Add global keyboard shortcuts (optional)

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Security Best Practices](https://www.electronjs.org/docs/latest/tutorial/security)
