import { app, BrowserWindow, Tray, Menu, nativeImage, Notification, ipcMain } from 'electron';
import { join } from 'node:path';
import { updateElectronApp } from 'update-electron-app';
import { HomeRSA } from '../../server/controllers/generator';
const rsa = new HomeRSA()


let mainWindow = null
let closeApp = null
let tray = null

if (process.env.NODE_ENV !== 'development') {
  console.log("ENVIRONMENT: ",process.env.NODE_ENV)
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./public/icon.ico",
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
  
  mainWindow.on("close", (event) => {
    if (!closeApp) {
      event.preventDefault()
      mainWindow.hide()
    } else {
      app.quit()
    }
  })
};

const handleQuit = () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

const notify = (title, body) => {
  new Notification({
    title: title,
    body: body
  }).show()
}

app.whenReady().then(() => {
  rsa.initialize().then(() => {
    createWindow();
    ipcMain.handle("notify", (event, title, body) => {
      if (!mainWindow.isFocused()) {
        notify(title, body)
      }
    })
  
    ipcMain.handle("encrypt", (event, msg) => {
      const encryptedMsg = rsa.encrypt(msg)
      console.log(encryptedMsg)
      return "testing123"
    })
    
    const icon = nativeImage.createFromPath(join(__dirname,"icon.png"))
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: 'Quit',
        click: () => {
          closeApp = true
          handleQuit()
        }
      },
      { 
        label: 'Show Window',
        click: () => {
          mainWindow.show()
        }
      },
    ])
    tray.setToolTip('Home Chat')
    tray.setTitle('Home Chat')
    tray.setContextMenu(contextMenu)
    tray.addListener("click", () => mainWindow.show())
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  }).catch((err) => {
    console.error(err)
    app.quit()
  })

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

updateElectronApp()
