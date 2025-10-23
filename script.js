let windows = {};
              let zIndexCounter = 100;
              let currentUsername = 'User';
              let focusedWindow = null;
              let fileSystem = {
          'Photos': {},
          'TextEditor': {
              'example.txt': 'This is an example text file.\n\nYou can edit this file using the Text Editor app.\n\nTry creating your own files by:\n1. Opening the Text Editor\n2. Writing your content\n3. Clicking Save As and entering a filename\n\nHave fun exploring NautilusOS!'
          }
      };
              let currentPath = [];
              let currentFile = null;
              let settings = {
                  use12Hour: true,
                  showSeconds: false,
                  showDesktopIcons: true
              };
              let bootSelectedIndex = 0;

              let loginStartTime = localStorage.getItem('nautilusOS_bootTime');
              if (!loginStartTime) {
                  loginStartTime = Date.now();
                  localStorage.setItem('nautilusOS_bootTime', loginStartTime);
              } else {
                  loginStartTime = parseInt(loginStartTime, 10);
              }

              function showToast(message, icon = 'fa-info-circle') {
          const container = document.getElementById('toastContainer');
          const toast = document.createElement('div');
          toast.className = 'toast';

          toast.innerHTML = `
              <i class="fas ${icon} toast-icon"></i>
              <div class="toast-message">${message}</div>
              <div class="toast-close" onclick="closeToast(this)">
                  <i class="fas fa-times"></i>
              </div>
          `;

          container.appendChild(toast);

          setTimeout(() => {
              closeToast(toast.querySelector('.toast-close'));
          }, 4000);

          // Add to notification center
          addNotificationToHistory(message, icon);
      }
              function closeToast(btn) {
                  const toast = btn.closest('.toast');
                  toast.classList.add('hiding');
                  setTimeout(() => {
                      toast.remove();
                  }, 300);
              }

              window.addEventListener('DOMContentLoaded', () => {
                  const savedBootChoice = localStorage.getItem('nautilusOS_bootChoice');
                  if (savedBootChoice !== null) {
                      bootSelectedIndex = parseInt(savedBootChoice, 10);
                      selectBoot();
                  }
              });
const appMetadata = {
    'files': { name: 'Files', icon: 'fa-folder', preinstalled: true },
    'terminal': { name: 'Terminal', icon: 'fa-terminal', preinstalled: true },
    'settings': { name: 'Settings', icon: 'fa-cog', preinstalled: true },
    'editor': { name: 'Text Editor', icon: 'fa-edit', preinstalled: true },
    'music': { name: 'Music', icon: 'fa-music', preinstalled: true },
    'photos': { name: 'Photos', icon: 'fa-images', preinstalled: true },
    'help': { name: 'Help', icon: 'fa-question-circle', preinstalled: true },
    'whatsnew': { name: "What's New", icon: 'fa-star', preinstalled: true },
    'appstore': { name: 'App Store', icon: 'fa-store', preinstalled: true },
    'calculator': { name: 'Calculator', icon: 'fa-calculator', preinstalled: true },
    'browser': { name: 'Nautilus Browser', icon: 'fa-globe', preinstalled: true },
    'cloaking': { name: 'Cloaking', icon: 'fa-mask', preinstalled: true },
    'startup-apps': { name: 'Startup Apps', icon: 'fa-rocket', preinstalled: false },
    'task-manager': { name: 'Task Manager', icon: 'fa-tasks', preinstalled: false }
};
              function updateUptime() {
                  const elapsed = Math.floor((Date.now() - loginStartTime) / 1000 / 60);
                  const uptimeEl = document.getElementById('uptime');

                  let uptimeString = '';
                  if (elapsed < 60) {
                      uptimeString = `${elapsed}m`;
                  } else {
                      const hours = Math.floor(elapsed / 60);
                      const minutes = elapsed % 60;
                      uptimeString = `${hours}h ${minutes}m`;
                  }

                  if (uptimeEl) {
                      uptimeEl.textContent = uptimeString;
                  }
              }

              function displayBrowserInfo() {
                  const userAgent = navigator.userAgent;
                  let browser = 'Unknown Browser';

                  if (userAgent.indexOf("Firefox") > -1) {
                      browser = "Mozilla Firefox";
                  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
                      browser = "Samsung Internet";
                  } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
                      browser = "Microsoft Edge";
                  } else if (userAgent.indexOf("Chrome") > -1) {
                      if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
                          browser = "Opera";
                      } else if (userAgent.indexOf("Brave") > -1) {
                          browser = "Brave";
                      } else {
                          browser = "Google Chrome";
                      }
                  } else if (userAgent.indexOf("Safari") > -1) {
                      browser = "Apple Safari";
                  }

                  const browserInfoEl = document.getElementById('browserInfo');
                  if (browserInfoEl) {
                      browserInfoEl.textContent = browser;
                  }
              }

              function togglePassword() {
                  const passwordInput = document.getElementById('password');
                  const toggleIcon = document.getElementById('passwordToggle');

                  if (passwordInput.type === 'password') {
                      passwordInput.type = 'text';
                      toggleIcon.classList.remove('fa-eye');
                      toggleIcon.classList.add('fa-eye-slash');
                  } else {
                      passwordInput.type = 'password';
                      toggleIcon.classList.remove('fa-eye-slash');
                      toggleIcon.classList.add('fa-eye');
                  }
              }

              document.addEventListener('keydown', function(e) {
                  const bootloader = document.getElementById('bootloader');
                  if (!bootloader.classList.contains('hidden') && document.getElementById('bootOptions').style.display !== 'none') {
                      const options = document.querySelectorAll('.boot-option');

                      if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          options[bootSelectedIndex].classList.remove('selected');
                          bootSelectedIndex = (bootSelectedIndex + 1) % options.length;
                          options[bootSelectedIndex].classList.add('selected');
                      } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          options[bootSelectedIndex].classList.remove('selected');
                          bootSelectedIndex = (bootSelectedIndex - 1 + options.length) % options.length;
                          options[bootSelectedIndex].classList.add('selected');
                      } else if (e.key === 'Enter') {
                          e.preventDefault();
                          selectBoot();
                      }
                  }
              });

              function selectBoot() {
                  localStorage.setItem('nautilusOS_bootChoice', bootSelectedIndex);

                  document.getElementById('bootOptions').style.display = 'none';
                  document.querySelector('.boot-hint').style.display = 'none';
                  document.getElementById('bootLoading').classList.add('active');
                  startBootSequence();
              }

              function startBootSequence() {
                  let messages;

                  if (bootSelectedIndex === 1) {
                      messages = [
                          'Starting boot sequence for NautilusOS (Command Line)...',
                          'Initializing command-line interface...',
                          'Loading system utilities...',
                          '- bash shell v5.1',
                          '- core utilities',
                          '- network stack',
                          'Mounting file systems...',
                          'Starting command-line interface...',
                          'System ready! :D'
                      ];
                  } else {
                      messages = [
                          'Starting boot sequence for NautilusOS...',
                          'Running startup functions...',
                          '- startLoginClock()',
                          '- updateLoginClock()',
                          '- displayBrowserInfo()',
                          '- updateUptime()',
                          '- updateLoginGreeting()',
                          'Finished running startup functions.',
                          'Fetching icons from https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                          'Starting graphical user interface...',
                          'System ready! :D'
                      ];
                  }

                  const messagesContainer = document.getElementById('bootMessages');
                  const loadingBar = document.getElementById('loadingBar');
                  let progress = 0;

                  messages.forEach((msg, index) => {
                      setTimeout(() => {
                          const msgEl = document.createElement('div');
                          msgEl.className = 'boot-message';
                          msgEl.textContent = `[OK] ${msg}`;
                          messagesContainer.appendChild(msgEl);

                          progress = ((index + 1) / messages.length) * 100;
                          loadingBar.style.width = progress + '%';

                          if (index === messages.length - 1) {
          setTimeout(() => {
              const bootloader = document.getElementById('bootloader');
              bootloader.classList.add('hidden');

              if (bootSelectedIndex === 1) {
                  setTimeout(() => {
                      const cliMode = document.getElementById('commandLineMode');
                      cliMode.classList.add('active');
                      const cliInput = document.getElementById('cliInput');
                      if (cliInput) cliInput.focus();
                  }, 500);
              } else {
                  // Check if setup is complete
                  const setupComplete = localStorage.getItem('nautilusOS_setupComplete');

                  if (!setupComplete) {
                      // First time setup
                      setTimeout(() => {
                          const setup = document.getElementById('setup');
                          setup.style.display = 'flex';
                          setTimeout(() => {
                              setup.style.opacity = '1';
                          }, 50);
                      }, 500);
                  } else {
                      setTimeout(() => {
                          const savedUsername = localStorage.getItem('nautilusOS_username');
                          if (savedUsername) {
                              document.getElementById('username').value = savedUsername;
                          }
                          const login = document.getElementById('login');
                          login.classList.add('active');
                          startLoginClock();
                          displayBrowserInfo();
                          updateLoginGreeting();
                      }, 500);
                  }
              }
          }, 1200);
      }
                      }, index * 250);
                  });
              }

              function generateFileTree(fs, prefix = '', isLast = true) {
                  let result = '';
                  const entries = Object.keys(fs);

                  entries.forEach((entry, index) => {
                      const isLastEntry = index === entries.length - 1;
                      const connector = isLastEntry ? '└── ' : '├── ';
                      const isFolder = typeof fs[entry] === 'object';
                      const icon = isFolder ? '<i class="fas fa-folder"></i>' : '<i class="fas fa-file-alt"></i>';
                      result += `${prefix}${connector}${icon} ${entry}\n`;

                      if (isFolder && Object.keys(fs[entry]).length > 0) {
                          const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
                          result += generateFileTree(fs[entry], newPrefix, isLastEntry);
                      }
                  });

                  return result;
              }

              function handleCLIInput(e) {
                  if (e.key === 'Enter') {
                      const input = e.target;
                      const command = input.value.trim();
                      const terminal = document.getElementById('cliTerminal');

                      const cmdLine = document.createElement('div');
                      cmdLine.className = 'cli-line';
                      cmdLine.innerHTML = `<span class="cli-prompt">user@nautilusos:~$ </span>${command}`;
                      terminal.insertBefore(cmdLine, terminal.lastElementChild);

                      const output = document.createElement('div');
                      output.className = 'cli-line';

                      if (command === 'help') {
                          output.innerHTML = 'Available commands:<br>' +
                              'help - Show this list<br>' +
                              'ls - List files in file system<br>' +
                              'apps - List installed applications<br>' +
                              'themes - List installed themes<br>' +
                              'clear - Clear terminal<br>' +
                              'date - Show current date and time<br>' +
                              'whoami - Display current username<br>' +
                              'reset-boot - Reset bootloader preferences<br>' +
                              'echo [text] - Display text<br>' +
                              'gui - Switch to graphical mode';
                      } else if (command === 'ls') {
                          const tree = '.\n' + generateFileTree(fileSystem);
                          output.innerHTML = '<pre style="margin: 0; font-family: inherit;">' + tree + '</pre>';
                      } else if (command === 'apps') {
                          const appList = [
                              'Files - File manager and explorer',
                              'Terminal - Command line interface',
                              'Browser - Web browser',
                              'Settings - System settings',
                              'Text Editor - Edit text files',
                              'Music - Music player',
                              'Photos - Photo viewer',
                              'Help - System help and documentation',
                              'What\'s New - View latest features',
                              'App Store - Browse and install apps/themes'
                          ];
                          output.innerHTML = '<span style="color: var(--accent);">Installed Applications:</span><br>' +
                              appList.map(app => `  • ${app}`).join('<br>');
                      } else if (command === 'themes') {
                          const themeList = ['Dark Theme (Default)'];
                          if (installedThemes.length > 0) {
                              installedThemes.forEach(theme => {
                                  themeList.push(`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`);
                              });
                          }
                          output.innerHTML = '<span style="color: var(--accent);">Installed Themes:</span><br>' +
                              themeList.map(theme => `  • ${theme}`).join('<br>');
                      } else if (command === 'whoami') {
                          output.textContent = 'User';
                      } else if (command === 'reset-boot') {
                          localStorage.removeItem('nautilusOS_bootChoice');
                          output.innerHTML = '<span style="color: #4ade80;">✓ Bootloader preferences reset successfully</span><br>' +
                              'The bootloader menu will appear on next page reload.';
                      } else if (command === 'clear') {
                          terminal.innerHTML = `
                      <div class="cli-line" style="color: var(--accent);">NautilusOS Command Line Interface v1.0</div>
                      <div class="cli-line" style="color: #888; margin-bottom: 1rem;">Type 'help' for available commands, 'gui' to switch to graphical mode</div>
                  `;
                      } else if (command === 'date') {
                          output.textContent = new Date().toString();
      } else if (command === 'gui') {
          output.textContent = 'Switching to graphical mode...';
          terminal.insertBefore(output, terminal.lastElementChild);
          setTimeout(() => {
              const cliMode = document.getElementById('commandLineMode');
              cliMode.style.opacity = '0';
              setTimeout(() => {
                  cliMode.classList.remove('active');
                  cliMode.style.opacity = '1';

                  const setupComplete = localStorage.getItem('nautilusOS_setupComplete');

                  if (!setupComplete) {
                      const setup = document.getElementById('setup');
                      setup.style.display = 'flex';
                      setTimeout(() => {
                          setup.style.opacity = '1';
                      }, 50);
                  } else {
                      const savedUsername = localStorage.getItem('nautilusOS_username');
                      if (savedUsername) {
                          document.getElementById('username').value = savedUsername;
                      }
                      const login = document.getElementById('login');
                      login.classList.add('active');
                      startLoginClock();
                      displayBrowserInfo();
                      updateLoginGreeting();
                  }
              }, 500);
          }, 500);
          input.value = '';
          terminal.scrollTop = terminal.scrollHeight;
          return;
      } else if (command.startsWith('echo ')) {
                          output.textContent = command.substring(5);
                      } else if (command) {
                          output.innerHTML = `<span style="color: #ef4444;">Command not found: ${command}</span><br>Type 'help' for available commands.`;
                      }

                      if (command !== 'clear' && command) {
                          terminal.insertBefore(output, terminal.lastElementChild);
                      }

                      input.value = '';
                      terminal.scrollTop = terminal.scrollHeight;
                  }
              }

              function startLoginClock() {
                  function updateLoginClock() {
                      const now = new Date();
                      let hours = now.getHours();
                      const minutes = String(now.getMinutes()).padStart(2, '0');

                      let timeStr = '';
                      if (settings.use12Hour) {
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          hours = hours % 12 || 12;
                          timeStr = `${hours}:${minutes} ${ampm}`;
                      } else {
                          hours = String(hours).padStart(2, '0');
                          timeStr = `${hours}:${minutes}`;
                      }

                      document.getElementById('loginClock').textContent = timeStr;

                      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
                      document.getElementById('loginDate').textContent = dateStr;
                  }
                  updateLoginClock();
                  setInterval(updateLoginClock, 1000);
                  setInterval(updateUptime, 60000);
                  updateUptime();
              }

      function login() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          if (!username || !password) {
              showToast('Please enter username and password', 'fa-exclamation-circle');
              return;
          }

          const savedUsername = localStorage.getItem('nautilusOS_username');
          const savedPassword = localStorage.getItem('nautilusOS_password');

          if (username !== savedUsername || password !== savedPassword) {
              showToast('Invalid username or password', 'fa-exclamation-circle');
              return;
          }

          currentUsername = username;
          document.getElementById('displayUsername').textContent = username;

          const login = document.getElementById('login');
          const desktop = document.getElementById('desktop');

          login.style.opacity = '0';
setTimeout(() => {
    login.classList.remove('active');
    desktop.classList.add('active');
    startClock();
    initDesktopIconDragging();
    initContextMenu();
    initScrollIndicator();
    
    installedApps.forEach(appName => {
        addDesktopIcon(appName);
    });
    
    updateStartMenu();

    const showWhatsNew = localStorage.getItem('nautilusOS_showWhatsNew');
    if (showWhatsNew === null || showWhatsNew === 'true') {
        setTimeout(() => {
            openApp('whatsnew');
        }, 800);
    }
}, 500);      }
              function startClock() {
                  function updateClock() {
                      const now = new Date();
                      let hours = now.getHours();
                      const minutes = String(now.getMinutes()).padStart(2, '0');
                      const seconds = String(now.getSeconds()).padStart(2, '0');

                      let timeStr = '';
                      if (settings.use12Hour) {
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          hours = hours % 12 || 12;
                          timeStr = `${hours}:${minutes}`;
                          if (settings.showSeconds) timeStr += `:${seconds}`;
                          timeStr += ` ${ampm}`;
                      } else {
                          hours = String(hours).padStart(2, '0');
                          timeStr = `${hours}:${minutes}`;
                          if (settings.showSeconds) timeStr += `:${seconds}`;
                      }

                      document.getElementById('clock').textContent = timeStr;
                  }
                  updateClock();
                  setInterval(updateClock, 1000);
              }

              function toggleStartMenu() {
                  const menu = document.getElementById('startMenu');
                  menu.classList.toggle('active');
              }

              function updateTaskbarIndicators() {
                  const appEntries = Object.entries(windows);
                  let topApp = null;
                  let topZ = 0;

                  for (const [name, win] of appEntries) {
                      const z = parseInt(win.style.zIndex || 0);
                      if (z > topZ) {
                          topZ = z;
                          topApp = name;
                      }
                  }

                  document.querySelectorAll('.taskbar-icon[data-app]').forEach(icon => {
                      const appName = icon.getAttribute('data-app');
                      icon.classList.remove('active', 'open');

                      if (windows[appName]) {
                          icon.classList.add('open');
                          if (appName === topApp) {
                              icon.classList.add('active');
                          }
                      }
                  });
              }

              function addDynamicTaskbarIcon(appName, icon) {
                  const existingIcon = document.querySelector(`.taskbar-icon[data-app="${appName}"]`);
                  if (existingIcon) return;

                  const pinnedApps = ['files', 'terminal', 'browser', 'settings'];
                  if (pinnedApps.includes(appName)) return;

                  const taskbar = document.querySelector('.taskbar');

                  const iconEl = document.createElement('div');
                  iconEl.className = 'taskbar-icon dynamic-icon';
                  iconEl.setAttribute('data-app', appName);
                  iconEl.setAttribute('title', appName.charAt(0).toUpperCase() + appName.slice(1));
                  iconEl.innerHTML = `<i class="${icon}"></i>`;
                  iconEl.onclick = () => {
                      if (windows[appName]) {
                          const win = windows[appName];
                          if (win.style.display === 'none') {
                              win.style.display = 'block';
                              win.classList.remove('minimized');
                          }
                          focusWindow(win);
                          focusedWindow = appName;
                          updateTaskbarIndicators();
                      }
                  };

                  const allIcons = taskbar.querySelectorAll('.taskbar-icon[data-app]');
                  let lastPinnedIcon = null;
                  allIcons.forEach(icn => {
                      const app = icn.getAttribute('data-app');
                      if (pinnedApps.includes(app)) {
                          lastPinnedIcon = icn;
                      }
                  });

                  if (lastPinnedIcon) {
                      lastPinnedIcon.parentNode.insertBefore(iconEl, lastPinnedIcon.nextSibling);
                  } else {
                      const firstDivider = taskbar.querySelector('.taskbar-divider');
                      if (firstDivider) {
                          firstDivider.parentNode.insertBefore(iconEl, firstDivider.nextSibling);
                      }
                  }

                  updateTaskbarIndicators();
              }

              function removeDynamicTaskbarIcon(appName) {
                  const pinnedApps = ['files', 'terminal', 'browser', 'settings'];
                  if (pinnedApps.includes(appName)) return;

                  const icon = document.querySelector(`.taskbar-icon.dynamic-icon[data-app="${appName}"]`);
                  if (icon) {
                      icon.remove();
                  }
              }

function initDesktopIconDragging() {
    const gridSize = 100;
    const icons = document.querySelectorAll('.desktop-icon');

    function initializeIconPositions() {
        occupiedGridCells.clear();

        icons.forEach(icon => {
            if (icon.style.position !== 'absolute') {
                const rect = icon.getBoundingClientRect();
                const x = Math.round(rect.left / gridSize) * gridSize;
                const y = Math.round(rect.top / gridSize) * gridSize;
                occupiedGridCells.add(`${x},${y}`);
            } else {
                const x = Math.round(parseInt(icon.style.left) / gridSize) * gridSize;
                const y = Math.round(parseInt(icon.style.top) / gridSize) * gridSize;
                occupiedGridCells.add(`${x},${y}`);
            }
        });
    }

    initializeIconPositions();

    icons.forEach(icon => {
        let offsetX, offsetY;
        let isDragging = false;
        let hasMoved = false;
        let originalX, originalY;
        let startX, startY;
        let dragTimeout;

        icon.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;

            const rect = icon.getBoundingClientRect();
            originalX = Math.round(rect.left / gridSize) * gridSize;
            originalY = Math.round(rect.top / gridSize) * gridSize;
            
            startX = e.clientX;
            startY = e.clientY;
            isDragging = false;
            hasMoved = false;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // Use a timeout to distinguish between click and drag
            dragTimeout = setTimeout(() => {
                if (!hasMoved) return;
                
                occupiedGridCells.delete(`${originalX},${originalY}`);
                icon.classList.add('dragging');
                icon.style.position = 'absolute';
                icon.style.zIndex = '1000';
                isDragging = true;
            }, 150);

            document.onmousemove = (ev) => {
                const deltaX = Math.abs(ev.clientX - startX);
                const deltaY = Math.abs(ev.clientY - startY);
                
                if (deltaX > 5 || deltaY > 5) {
                    hasMoved = true;
                }
                
                if (!isDragging) return;

                let x = ev.clientX - offsetX;
                let y = ev.clientY - offsetY;

                x = Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, x));
                y = Math.max(0, Math.min(window.innerHeight - icon.offsetHeight - 100, y));

                icon.style.left = x + 'px';
                icon.style.top = y + 'px';
            };

            document.onmouseup = () => {
                clearTimeout(dragTimeout);
                
                if (isDragging) {
                    let finalX = Math.round(parseInt(icon.style.left) / gridSize) * gridSize;
                    let finalY = Math.round(parseInt(icon.style.top) / gridSize) * gridSize;

                    let attempts = 0;
                    while (occupiedGridCells.has(`${finalX},${finalY}`) && attempts < 100) {
                        finalX += gridSize;
                        if (finalX > window.innerWidth - icon.offsetWidth - gridSize) {
                            finalX = 0;
                            finalY += gridSize;
                        }
                        if (finalY > window.innerHeight - icon.offsetHeight - 100) {
                            finalX = originalX;
                            finalY = originalY;
                            showToast('No available space to place icon', 'fa-exclamation-circle');
                            break;
                        }
                        attempts++;
                    }

                    finalX = Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, finalX));
                    finalY = Math.max(0, Math.min(window.innerHeight - icon.offsetHeight - 100, finalY));
                    icon.style.left = finalX + 'px';
                    icon.style.top = finalY + 'px';

                    occupiedGridCells.add(`${finalX},${finalY}`);

                    icon.classList.remove('dragging');
                    icon.style.zIndex = '';
                } else if (!hasMoved) {
                    if (!occupiedGridCells.has(`${originalX},${originalY}`)) {
                        occupiedGridCells.add(`${originalX},${originalY}`);
                    }
                }
                
                isDragging = false;
                hasMoved = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        });
    });
}
              function createWindow(title, icon, content, width = 900, height = 600, appName = null, noPadding = false) {
                  if (appName && windows[appName]) {
                      focusWindow(windows[appName]);
                      return windows[appName];
                  }

                  const windowEl = document.createElement('div');
                  windowEl.className = 'window';
                  windowEl.style.width = width + 'px';
                  windowEl.style.height = height + 'px';
                  windowEl.style.left = (window.innerWidth / 2 - width / 2) + Math.random() * 50 + 'px';
                  windowEl.style.top = (window.innerHeight / 2 - height / 2) - 30 + Math.random() * 20 + 'px';
                  windowEl.style.zIndex = ++zIndexCounter;

                  const contentClass = noPadding ? 'window-content' : 'window-content has-padding';

                  windowEl.innerHTML = `
              <div class="window-header">
                  <div class="window-title">
                      <i class="${icon}"></i>
                      <span>${title}</span>
                  </div>
                  <div class="window-controls">
                      <div class="window-btn" onclick="minimizeWindow(this)">
                          <i class="fas fa-minus"></i>
                      </div>
                      <div class="window-btn" onclick="maximizeWindow(this)">
                          <i class="fas fa-square"></i>
                      </div>
                      <div class="window-btn close" onclick="closeWindow(this, '${appName}')">
                          <i class="fas fa-times"></i>
                      </div>
                  </div>
              </div>
              <div class="${contentClass}">${content}</div>
              <div class="resize-handle"></div>
              <div class="resize-handle-top"></div>
              <div class="resize-handle-right"></div>
              <div class="resize-handle-bottom"></div>
              <div class="resize-handle-left"></div>
          `;

                  if (appName) {
                      windowEl.dataset.appIcon = icon;
                      windowEl.dataset.appName = appName;
                  }

      document.getElementById('desktop').appendChild(windowEl);
      makeDraggable(windowEl);

      if (appName !== 'calculator') {
          makeResizable(windowEl);
      }

      if (appName) {
                      windows[appName] = windowEl;
                      focusedWindow = appName;
                      addDynamicTaskbarIcon(appName, icon);
                  }

                  windowEl.addEventListener('mousedown', () => {
                      focusWindow(windowEl);
                      if (appName) {
                          focusedWindow = appName;
                          updateTaskbarIndicators();
                      }
                  });

                  updateTaskbarIndicators();
                  return windowEl;
              }

              function focusWindow(windowEl) {
                  windowEl.style.zIndex = ++zIndexCounter;
              }

              function minimizeWindow(btn) {
                  const window = btn.closest('.window');
                  window.classList.add('minimized');
                  setTimeout(() => {
                      window.style.display = 'none';
                  }, 250);
              }

              function maximizeWindow(btn) {
                  const window = btn.closest('.window');
                  const icon = btn.querySelector('i');

                  if (window.dataset.maximized === 'true') {
                      window.style.width = window.dataset.oldWidth;
                      window.style.height = window.dataset.oldHeight;
                      window.style.left = window.dataset.oldLeft;
                      window.style.top = window.dataset.oldTop;
                      window.dataset.maximized = 'false';
                      icon.classList.remove('fa-clone');
                      icon.classList.add('fa-square');

                      window.style.borderRadius = '12px';
                      const header = window.querySelector('.window-header');
                      if (header) header.style.borderRadius = '0';
                  } else {
                      window.dataset.oldWidth = window.style.width;
                      window.dataset.oldHeight = window.style.height;
                      window.dataset.oldLeft = window.style.left;
                      window.dataset.oldTop = window.style.top;

                      window.style.width = '100vw';
                      window.style.height = '100vh';
                      window.style.left = '0';
                      window.style.top = '0';
                      window.dataset.maximized = 'true';
                      icon.classList.remove('fa-square');
                      icon.classList.add('fa-clone');

                      window.style.borderRadius = '1px';
                      const header = window.querySelector('.window-header');
                      if (header) header.style.borderRadius = '1px';
                  }
              }

              function closeWindow(btn, appName) {
                  const window = btn.closest('.window');
                  window.style.animation = 'windowMinimize 0.25s ease forwards';
                  setTimeout(() => {
                      window.remove();
                      if (appName && windows[appName]) {
                          delete windows[appName];
                          if (focusedWindow === appName) {
                              focusedWindow = null;
                          }
                          removeDynamicTaskbarIcon(appName);
                          updateTaskbarIndicators();
                      }
                  }, 250);
              }

              function minimizeWindowByAppName(appName) {
                  if (!appName || !windows[appName]) return;
                  const windowEl = windows[appName];
                  const btn = windowEl.querySelector('.window-btn');
                  if (btn) minimizeWindow(btn);
              }

              function maximizeWindowByAppName(appName) {
                  if (!appName || !windows[appName]) return;
                  const windowEl = windows[appName];
                  const btn = windowEl.querySelectorAll('.window-btn')[1];
                  if (btn) maximizeWindow(btn);
              }

              function closeWindowByAppName(appName) {
                  if (!appName || !windows[appName]) return;
                  const windowEl = windows[appName];
                  const closeBtn = windowEl.querySelector('.window-btn.close');
                  if (closeBtn) closeWindow(closeBtn, appName);
              }

              function makeDraggable(element) {
                  const header = element.querySelector('.window-header');
                  let pos1 = 0,
                      pos2 = 0,
                      pos3 = 0,
                      pos4 = 0;

                  header.onmousedown = dragMouseDown;

                  function dragMouseDown(e) {
                      if (e.target.closest('.window-controls')) return;
                      e.preventDefault();
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      document.onmouseup = closeDragElement;
                      document.onmousemove = elementDrag;
                  }

                  function elementDrag(e) {
                      e.preventDefault();
                      pos1 = pos3 - e.clientX;
                      pos2 = pos4 - e.clientY;
                      pos3 = e.clientX;
                      pos4 = e.clientY;
                      const newTop = element.offsetTop - pos2;
                      const newLeft = element.offsetLeft - pos1;

      element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newTop)) + "px";
      element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newLeft)) + "px";

                  }

                  function closeDragElement() {
                      document.onmouseup = null;
                      document.onmousemove = null;
                  }
              }

              function makeResizable(element) {
                  const handle = element.querySelector('.resize-handle');
                  const handleTop = element.querySelector('.resize-handle-top');
                  const handleRight = element.querySelector('.resize-handle-right');
                  const handleBottom = element.querySelector('.resize-handle-bottom');
                  const handleLeft = element.querySelector('.resize-handle-left');
                  let startX, startY, startWidth, startHeight, startLeft, startTop;

                  handle.onmousedown = initResize;
                  handleTop.onmousedown = initResizeTop;
                  handleRight.onmousedown = initResizeRight;
                  handleBottom.onmousedown = initResizeBottom;
                  handleLeft.onmousedown = initResizeLeft;

                  function initResize(e) {
                      e.preventDefault();
                      startX = e.clientX;
                      startY = e.clientY;
                      startWidth = parseInt(window.getComputedStyle(element).width, 10);
                      startHeight = parseInt(window.getComputedStyle(element).height, 10);
                      document.onmousemove = doResize;
                      document.onmouseup = stopResize;
                  }

                  function doResize(e) {
                      const newWidth = startWidth + e.clientX - startX;
                      const newHeight = startHeight + e.clientY - startY;
                      if (newWidth > 400) element.style.width = newWidth + 'px';
                      if (newHeight > 300) element.style.height = newHeight + 'px';
                  }

                  function initResizeTop(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      startY = e.clientY;
                      startHeight = parseInt(window.getComputedStyle(element).height, 10);
                      startTop = element.offsetTop;
                      document.onmousemove = doResizeTop;
                      document.onmouseup = stopResize;
                  }

                  function doResizeTop(e) {
                      const deltaY = e.clientY - startY;
                      const newHeight = startHeight - deltaY;
                      if (newHeight > 300) {
                          element.style.height = newHeight + 'px';
                          element.style.top = (startTop + deltaY) + 'px';
                      }
                  }

                  function initResizeRight(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      startX = e.clientX;
                      startWidth = parseInt(window.getComputedStyle(element).width, 10);
                      document.onmousemove = doResizeRight;
                      document.onmouseup = stopResize;
                  }

                  function doResizeRight(e) {
                      const newWidth = startWidth + e.clientX - startX;
                      if (newWidth > 400) element.style.width = newWidth + 'px';
                  }

                  function initResizeBottom(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      startY = e.clientY;
                      startHeight = parseInt(window.getComputedStyle(element).height, 10);
                      document.onmousemove = doResizeBottom;
                      document.onmouseup = stopResize;
                  }

                  function doResizeBottom(e) {
                      const newHeight = startHeight + e.clientY - startY;
                      if (newHeight > 300) element.style.height = newHeight + 'px';
                  }

                  function initResizeLeft(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      startX = e.clientX;
                      startWidth = parseInt(window.getComputedStyle(element).width, 10);
                      startLeft = element.offsetLeft;
                      document.onmousemove = doResizeLeft;
                      document.onmouseup = stopResize;
                  }

                  function doResizeLeft(e) {
                      const deltaX = e.clientX - startX;
                      const newWidth = startWidth - deltaX;
                      if (newWidth > 400) {
                          element.style.width = newWidth + 'px';
                          element.style.left = (startLeft + deltaX) + 'px';
                      }
                  }

                  function stopResize() {
                      document.onmousemove = null;
                      document.onmouseup = null;
                  }
              }

              function openFile(filename) {
          let current = getFileSystemAtPath(currentPath);
          if (!current) return;

          const item = current[filename];

          if (typeof item === 'object') {
              currentPath.push(filename);
              if (windows['files']) {
                  updateFileExplorer();
              }
          } else if (typeof item === 'string') {
              if (item.startsWith('blob:')) {
                  if (!windows['photos']) {
                      openApp('photos');
                  } else {
                      focusWindow(windows['photos']);
                  }
              } else {
                  currentFile = filename;
                  openApp('editor', item, filename);
              }
          }
      }
      async function signOut() {
          const confirmed = await confirm('Are you sure you want to shut down?');
          if (confirmed) {
              const userAgent = navigator.userAgent.toLowerCase();
              let newTabUrl = 'https://www.google.com'; 

              if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
                  newTabUrl = 'chrome://newtab';
              } else if (userAgent.includes('firefox')) {
                  newTabUrl = 'about:newtab';
              } else if (userAgent.includes('edg')) {
                  newTabUrl = 'edge://newtab';
              } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
                  newTabUrl = 'about:blank';
              } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
                  newTabUrl = 'opera://startpage';
              }

              try {
                  window.location.href = newTabUrl;
              } catch (e) {
                  window.location.href = 'https://www.google.com';
              }

              setTimeout(() => {
                  if (document.hasFocus()) {
                      window.location.href = 'https://www.google.com';
                  }
              }, 500);
          }
      }
              function saveFile() {
                  const filenameInput = document.getElementById('editorFilename');
                  const textarea = document.querySelector('.editor-textarea');

                  if (!filenameInput || !textarea) return;

                  let filename = filenameInput.value.trim();
                  if (!filename) {
                      showToast('Please enter a filename', 'fa-exclamation-circle');
                      return;
                  }

                  if (!filename.endsWith('.txt')) {
                      filename += '.txt';
                  }

                  currentFile = filename;
                  let current = getFileSystemAtPath(currentPath);
                  if (!current) current = fileSystem;

                  current[filename] = textarea.value;
                  filenameInput.value = filename;
                  showToast('File saved: ' + filename, 'fa-check-circle');

                  if (windows['files']) {
                      updateFileExplorer();
                  }
              }

              function saveAsNewFile() {
                  const textarea = document.querySelector('.editor-textarea');
                  if (!textarea) return;

                  const filename = prompt('Save as new file (filename.txt):');
                  if (!filename) return;

                  const finalName = filename.endsWith('.txt') ? filename : filename + '.txt';

                  let current = getFileSystemAtPath(currentPath);
                  if (!current) current = fileSystem;

                  current[finalName] = textarea.value;
                  currentFile = finalName;

                  const filenameInput = document.getElementById('editorFilename');
                  if (filenameInput) filenameInput.value = finalName;

                  showToast('File saved as: ' + finalName, 'fa-check-circle');

                  if (windows['files']) {
                      updateFileExplorer();
                  }
              }

              function saveToDevice() {
                  const textarea = document.querySelector('.editor-textarea');
                  const filenameInput = document.getElementById('editorFilename');
                  if (!textarea) return;

                  let filename = filenameInput ? filenameInput.value.trim() : 'untitled.txt';
                  if (!filename) filename = 'untitled.txt';
                  if (!filename.endsWith('.txt')) filename += '.txt';

                  const blob = new Blob([textarea.value], {
                      type: 'text/plain'
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  a.click();
                  URL.revokeObjectURL(url);

                  showToast('File downloaded: ' + filename, 'fa-download');
              }

              function resetBootloader() {
                  localStorage.removeItem('nautilusOS_bootChoice');
                  showToast('Boot preference cleared. The bootloader will appear on next reload.', 'fa-redo');
              }

              function openApp(appName, editorContent = '', filename = '') {
                  const menu = document.getElementById('startMenu');
                  if (menu.classList.contains('active')) {
                      toggleStartMenu();
                  }
                  if (appName === 'settings' && windows['settings']) {
                      closeWindow(windows['settings'].querySelector('.window-btn.close'), 'settings');
                  }
                  const apps = {
                      files: {
                          title: 'Files',
                          icon: 'fas fa-folder',
                          content: (() => {
                              let current = getFileSystemAtPath(currentPath);
                              if (!current) {
                                  current = fileSystem;
                                  currentPath = [];
                              }

                              return `
                  <div class="file-explorer">
                      <div class="file-sidebar">
                          <div style="padding: 0.5rem 0.5rem 1rem; color: var(--text-primary); font-weight: 600; font-size: 0.9rem; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem;">
                              <i class="fas fa-folder-tree"></i> &nbsp;File System
                          </div>
                          ${renderFileTree()}
                      </div>
                      <div class="file-main">
                          <div class="file-toolbar">
                              <button class="editor-btn" onclick="goUpDirectory()" ${currentPath.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                                  <i class="fas fa-arrow-up"></i> Up
                              </button>
                              <button class="editor-btn" onclick="createNewFolder()">
                                  <i class="fas fa-folder-plus"></i> &nbsp;New Folder
                              </button>
                              <div class="file-breadcrumb">
                                  ${renderBreadcrumb()}
                              </div>
                          </div>
      <div class="file-grid">
                      ${Object.keys(current).sort().map(file => {
                          const isFolder = typeof current[file] === 'object';
                          const icon = isFolder ? 'fa-folder' : 'fa-file-alt';
                          const escapedFile = file.replace(/'/g, "\\'");
                          return `
                              <div class="file-item" ondblclick="openFile('${escapedFile}')" onclick="selectFileItem(event, this, '${escapedFile}')" draggable="true" ondragstart="handleFileDragStart(event, '${escapedFile}')" ondragover="handleFileDragOver(event, ${isFolder})" ondrop="handleFileDrop(event, '${escapedFile}')">
                                  <i class="fas ${icon}"></i>
                                  <span>${file}</span>
                                  <div class="file-actions">
                                      <button class="file-action-btn" onclick="event.stopPropagation(); openFile('${escapedFile}')">
                                          <i class="fas fa-folder-open"></i> Open
                                      </button>
                                      <button class="file-action-btn delete" onclick="event.stopPropagation(); deleteFile('${escapedFile}')">
                                          <i class="fas fa-trash"></i> Delete
                                      </button>
                                  </div>
                              </div>
                          `;
                      }).join('')}
                  </div>
                      </div>
                  </div>
              `;
                          })(),
                          noPadding: true,
                          width: 900,
                          height: 600
                      },
                      terminal: {
                          title: 'Terminal',
                          icon: 'fas fa-terminal',
                          content: `
              <div class="terminal" id="terminalContent">
                  <div class="terminal-line" style="color: var(--accent);">NautilusOS Terminal v1.0</div>
                  <div class="terminal-line" style="color: #888; margin-bottom: 1rem;">Type 'help' for available commands</div>
                  <div class="terminal-line">
                      <span class="terminal-prompt">user@nautilusos:~$ </span><input type="text" class="terminal-input" id="terminalInput" onkeypress="handleTerminalInput(event)">
                  </div>
              </div>
          `,
                          noPadding: true,
                          width: 900,
                          height: 600
                      },
      browser: {
          title: 'Nautilus Browser',
          icon: 'fas fa-globe',
          content: `
              <div class="browser-container">
                  <div class="browser-header">
                      <div class="browser-tabs" id="browserTabs">
                          <div class="browser-tab active" data-tab-id="0" onclick="if(!event.target.closest('.browser-tab-close')) switchBrowserTab(0)">
                              <i class="fas fa-globe browser-tab-icon"></i>
                              <span class="browser-tab-title">New Tab</span>
                              <div class="browser-tab-close" onclick="event.stopPropagation(); event.preventDefault(); closeBrowserTab(0)">
                                  <i class="fas fa-times"></i>
                              </div>
                          </div>
                          <div class="browser-new-tab" onclick="createBrowserTab()">
                              <i class="fas fa-plus"></i>
                          </div>
                      </div>
                      <div class="browser-loading" id="browserLoading">
                          <div class="browser-loading-bar"></div>
                      </div>
                      <div class="browser-controls">
                          <button class="browser-nav-btn" id="browserBack" onclick="browserGoBack()" disabled>
                              <i class="fas fa-arrow-left"></i>
                          </button>
                          <button class="browser-nav-btn" id="browserForward" onclick="browserGoForward()" disabled>
                              <i class="fas fa-arrow-right"></i>
                          </button>
                          <button class="browser-nav-btn" onclick="browserReload()">
                              <i class="fas fa-redo"></i>
                          </button>
                          <div class="browser-url-bar">
                              <i class="fas fa-lock" id="browserLockIcon"></i>
                              <input
                                  type="text"
                                  class="browser-url-input"
                                  id="browserUrlInput"
                                  placeholder="Search or enter website URL"
                                  onkeypress="handleBrowserUrlInput(event)"
                              >
                          </div>
                      </div>
                  </div>
                  <div class="browser-content" id="browserContent">
                      <div class="browser-view active" data-view-id="0">
                          <div class="browser-landing">
                              <i class="fas fa-fish browser-landing-logo"></i>
                              <div class="browser-landing-search">
                                  <i class="fas fa-search"></i>
                                  <input
                                      type="text"
                                      class="browser-landing-input"
                                      placeholder="Search or enter website URL"
                                      onkeypress="handleBrowserLandingInput(event)"
                                  >
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `,
          noPadding: true,
          width: 900,
          height: 600
      },
                    cloaking: {
    title: 'Cloaking',
    icon: 'fas fa-mask',
    content: `
        <div style="padding: 1.5rem;">
            <div class="settings-section">
                <h3><i class="fas fa-mask"></i>&nbsp; Tab Cloaking</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Disguise your browser tab to look like a different website. Perfect for privacy!
                </p>
                
                <div class="settings-item" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                    <label style="color: var(--text-primary); font-weight: 500;">Custom Tab Title</label>
                    <input 
                        type="text" 
                        id="cloakTitle" 
                        class="login-input" 
                        placeholder="e.g., Google" 
                        value="${document.title}"
                        style="width: 100%; margin: 0;"
                    >
                </div>

                <div class="settings-item" style="flex-direction: column; align-items: flex-start; gap: 1rem; margin-top: 1rem;">
                    <label style="color: var(--text-primary); font-weight: 500;">Favicon URL</label>
                    <input 
                        type="text" 
                        id="cloakFavicon" 
                        class="login-input" 
                        placeholder="e.g., https://www.google.com" 
                        style="width: 100%; margin: 0;"
                    >
                    <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0;">
                        Enter a website URL and we'll fetch its favicon automatically
                    </p>
                </div>

                <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                    <button class="editor-btn" onclick="applyCloaking()" style="flex: 1;">
                        <i class="fas fa-check"></i>&nbsp; Apply
                    </button>
                    <button class="editor-btn" onclick="resetCloaking()" style="flex: 1;">
                        <i class="fas fa-undo"></i>&nbsp; Reset
                    </button>
                </div>
            </div>

            <div class="settings-section">
                <h3><i class="fas fa-sync-alt"></i>&nbsp; Auto-Rotate Cloaking</h3>
                <div class="settings-item">
                    <span>Enable Auto-Rotate</span>
                    <div class="toggle-switch" id="autoRotateToggle" onclick="toggleAutoRotate()"></div>
                </div>

                <div id="rotateSettings" style="display: none; margin-top: 1rem;">
                    <div class="settings-item" style="flex-direction: column; align-items: flex-start; gap: 1rem;">
                        <label style="color: var(--text-primary); font-weight: 500;">Rotation Speed (seconds)</label>
                        <input 
                            type="number" 
                            id="rotateSpeed" 
                            class="login-input" 
                            placeholder="10" 
                            value="10"
                            min="1"
                            max="300"
                            style="width: 100%; margin: 0;"
                        >
                    </div>

                    <div style="margin-top: 1rem;">
                        <label style="color: var(--text-primary); font-weight: 500; display: block; margin-bottom: 0.5rem;">
                            Rotation List
                        </label>
                        <div id="rotationList"></div>
                        <button class="editor-btn" onclick="addRotationSite()" style="width: 100%; margin-top: 0.5rem;">
                            <i class="fas fa-plus"></i>&nbsp; Add Website
                        </button>
                    </div>

                    <button class="editor-btn" onclick="saveRotationSettings()" style="width: 100%; margin-top: 1rem; background: rgba(125, 211, 192, 0.15); border-color: rgba(125, 211, 192, 0.3);">
                        <i class="fas fa-save"></i>&nbsp; Save Settings
                    </button>
                </div>
            </div>
        </div>
    `,
    noPadding: false,
    width: 600,
    height: 650
},
                      settings: {
          title: 'Settings',
          icon: 'fas fa-cog',
          content: `
              <div style="padding: 1.5rem;">
                  <div class="settings-section">
                      <h3><i class="fas fa-clock"></i> &nbsp;Clock</h3>
                      <div class="settings-item">
                          <span>12-Hour Format</span>
                          <div class="toggle-switch ${settings.use12Hour ? 'active' : ''}" onclick="toggleSetting('use12Hour')"></div>
                      </div>
                      <div class="settings-item">
                          <span>Show Seconds</span>
                          <div class="toggle-switch ${settings.showSeconds ? 'active' : ''}" onclick="toggleSetting('showSeconds')"></div>
                      </div>
                  </div>
                  <div class="settings-section">
                      <h3><i class="fas fa-desktop"></i> &nbsp;Desktop</h3>
                      <div class="settings-item">
                          <span>Show Desktop Icons</span>
                          <div class="toggle-switch ${settings.showDesktopIcons ? 'active' : ''}" onclick="toggleSetting('showDesktopIcons')"></div>
                      </div>
                  </div>
                  <div class="settings-section">
                      <h3><i class="fas fa-star"></i> &nbsp;What's New</h3>
                      <div class="settings-item">
                          <span>Show on Startup</span>
                          <div class="toggle-switch ${localStorage.getItem('nautilusOS_showWhatsNew') !== 'false' ? 'active' : ''}" onclick="toggleSetting('showWhatsNew')"></div>
                      </div>
                  </div>
                  <div class="settings-section">
                      <h3><i class="fas fa-palette"></i> &nbsp;Themes</h3>
                      <div id="themeSettings">
                          ${installedThemes.length === 0 ? `
                              <div class="settings-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                                  <span>No themes installed</span>
                                  <p style="color: var(--text-secondary); font-size: 0.85rem;">Visit the App Store to browse and install themes.</p>
                                  <button class="editor-btn" onclick="hideContextMenu(); openApp('appstore'); setTimeout(() => { const themesBtn = document.querySelector('.appstore-section:nth-child(2)'); if(themesBtn) switchAppStoreSection('themes', themesBtn); }, 100);" style="margin-top: 0.5rem;">
                                      <i class="fas fa-store"></i> Open App Store
                                  </button>
                              </div>
                          ` : installedThemes.map(theme => `
                              <div class="settings-item">
                                  <span>${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</span>
                                  <button class="editor-btn" onclick="showToast('Theme support coming soon!', 'fa-info-circle')">
                                      Apply
                                  </button>
                              </div>
                          `).join('')}
                      </div>
                  </div>

                  <div class="settings-section">
                      <h3><i class="fas fa-power-off"></i>&nbsp; Boot Options</h3>
                      <div class="settings-btn" onclick="resetBootloader()">
                          <i class="fas fa-redo"></i> Reset Boot Preference
                      </div>
                      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem; padding: 0 1rem;">
                          This will show the bootloader menu on next reload, allowing you to choose between graphical and command-line modes.
                      </p>
                  </div>
                  <div class="settings-section">
                      <h3><i class="fas fa-user"></i>&nbsp; Account</h3>
                      <div class="settings-item">
                          <span>Username</span>
                          <span style="color: var(--accent);">${currentUsername}</span>
                      </div>
                      <div class="settings-item">
                          <span>Account Type</span>
                          <span>Standard User</span>
                      </div>
                  </div>
                  <div class="settings-section">
    <h3><i class="fas fa-file-export"></i>&nbsp; Profile Management</h3>
    <div class="settings-btn" onclick="exportProfile()">
        <i class="fas fa-download"></i>&nbsp; Export Profile
    </div>
    <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem; padding: 0 1rem;">
        Export your profile to save your settings, installed apps, themes, files, and preferences. You can import this profile later or on another device.
    </p>
</div>
                  <div class="settings-section">
                      <h3><i class="fas fa-exclamation-triangle"></i>&nbsp; Danger Zone</h3>
                      <div class="settings-btn" onclick="resetAllData()" style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); color: #ef4444;">
                          <i class="fas fa-trash-alt"></i> Reset All Data
                      </div>
                      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem; padding: 0 1rem;">
                          This will permanently delete all your data including your account, settings, files, themes, and preferences. You will be returned to the initial setup screen.
                      </p>
                  </div>
              </div>
          `,
          noPadding: true,
          width: 900,
          height: 600
      },
                      editor: {
                          title: filename || 'Text Editor',
                          icon: 'fas fa-edit',
                          content: `
              <div class="editor-toolbar">
                  <button class="editor-btn" onclick="currentFile = null; document.querySelector('.editor-textarea').value = ''; document.getElementById('editorFilename').value = '';"><i class="fas fa-file"></i> &nbsp;New</button>
                  <button class="editor-btn" onclick="saveFile()"><i class="fas fa-save"></i> &nbsp;Save</button>
                  <button class="editor-btn" onclick="saveAsNewFile()"><i class="fas fa-copy"></i> &nbsp;Save As</button>
                  <button class="editor-btn" onclick="saveToDevice()"><i class="fas fa-download"></i> &nbsp;Save to Device</button>
                  <input type="text" id="editorFilename" class="editor-filename" placeholder="filename.txt" value="${filename}">
              </div>
              <textarea class="editor-textarea" placeholder="Start typing...">${editorContent || ''}</textarea>
          `,
                          noPadding: true,
                          width: 900,
                          height: 600
                      },
                      music: {
          title: 'Music',
          icon: 'fas fa-music',
          content: `
          <div class="music-player">
              <div class="music-header">
                  <div class="music-artwork">
                      <i class="fas fa-music"></i>
                  </div>
                  <div class="music-info">
                      <div class="music-title" id="musicTitle">No Track Loaded</div>
                      <div class="music-artist" id="musicArtist">Select a music file to play</div>
                  </div>
                  <div class="music-load-section">
                      <label for="musicFileInput" class="music-load-btn">
                          <i class="fas fa-folder-open"></i> Load Music
                          <input type="file" id="musicFileInput" accept="audio/*" onchange="loadMusicFile(event)" style="display: none;">
                      </label>
                  </div>
              </div>

              <div class="music-progress-section">
                  <div class="music-time" id="currentTime">0:00</div>
                  <div class="music-progress-bar" onclick="seekMusic(event)">
                      <div class="music-progress-fill" id="progressFill"></div>
                  </div>
                  <div class="music-time" id="totalTime">0:00</div>
              </div>

              <div class="music-controls">
                  <button class="music-control-btn" onclick="restartMusic()" title="Restart">
                      <i class="fas fa-redo"></i>
                  </button>
                  <button class="music-control-btn" onclick="skipBackward()" title="Skip Back 10s">
                      <i class="fas fa-backward"></i>
                  </button>
                  <button class="music-control-btn play-btn" id="playPauseBtn" onclick="togglePlayPause()">
                      <i class="fas fa-play"></i>
                  </button>
                  <button class="music-control-btn" onclick="skipForward()" title="Skip Forward 10s">
                      <i class="fas fa-forward"></i>
                  </button>
                  <button class="music-control-btn" id="loopBtn" onclick="toggleLoop()" title="Loop">
                      <i class="fas fa-repeat"></i>
                  </button>
              </div>

              <div class="music-volume-section">
                  <i class="fas fa-volume-up"></i>
                  <input type="range" class="music-volume-slider" id="volumeSlider" min="0" max="100" value="70" oninput="changeVolume(this.value)">
                  <span id="volumePercent">70%</span>
              </div>

              <audio id="audioPlayer" style="display: none;"></audio>
          </div>
      `,
          noPadding: true,
                          width: 900,
                          height: 600
      },
                      photos: {
          title: 'Photos',
          icon: 'fas fa-images',
          content: (() => {
              const photos = fileSystem['Photos'] || {};
              const photoList = Object.keys(photos);

              if (photoList.length === 0) {
                  return `
                      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 3rem; background: rgba(10, 14, 26, 0.8);">
                          <i class="fas fa-images" style="font-size: 5rem; color: var(--accent); margin-bottom: 2rem;"></i>
                          <h2 style="margin-bottom: 1rem; color: var(--text-primary);">No Photos Yet</h2>
                          <p style="color: var(--text-secondary);">Take a screenshot to get started!</p>
                      </div>
                  `;
              }

              return `
                  <div class="photos-grid" id="photosGrid">
                      ${photoList.map(name => `
                          <div class="photo-item" onclick="viewPhoto('${name}')">
                              <img src="${photos[name]}" alt="${name}" class="photo-thumbnail">
                              <div class="photo-name">${name}</div>
                              <button class="photo-delete-btn" onclick="event.stopPropagation(); deletePhoto('${name}')">
                                  <i class="fas fa-trash"></i>
                              </button>
                          </div>
                      `).join('')}
                  </div>
              `;
          })(),
          noPadding: true,
          width: 900,
          height: 600
      },
      help: {
          title: 'Help',
          icon: 'fas fa-question-circle',
          content: `
              <div class="help-content">
                  <div class="help-section">
                      <h3><i class="fas fa-info-circle"></i> Welcome to NautilusOS</h3>
                      <p>NautilusOS is a fully-featured web-based operating system with a complete desktop environment, virtual file system, and productivity applications.</p>
                  </div>
<div class="help-section">
                      <h3><i class="fa-solid fa-mask"></i> Cloaking</h3>
                      <p>Disguise your browser tab with custom titles and favicons, as well as auto-rotate features to keep your tab constantly changing.</p>
                      
                  </div>
                  
                  <div class="help-section">
                      <h3><i class="fas fa-power-off"></i> Boot Options</h3>
                      <p>NautilusOS offers two boot modes:</p>
                      <ul>
                          <li><strong>Nautilus OS (Graphical)</strong> - Full desktop environment with windows, icons, and applications</li>
                          <li><strong>Nautilus OS (Command Line)</strong> - Terminal-only interface for command-line operations</li>
                      </ul>
                      <p>Your boot choice is remembered automatically. To change it, open Settings and click Reset Boot Preference.</p>
                  </div>

                  <div class="help-section">
                      <h3><i class="fa-solid fa-store"></i> Applications</h3>
                      <ul>
                          <li><strong>Files</strong> - Browse and manage your virtual file system with tree navigation, create folders, and organize documents</li>
                          <li><strong>Terminal</strong> - Access command-line interface with common Unix commands (help, ls, clear, date, echo, gui)</li>
                          <li><strong>Nautilus Browser</strong> - Browse the web with multiple tabs, navigation controls, and history</li>
                          <li><strong>Text Editor</strong> - Create and edit text files with save, save as, and download to device options</li>
                          <li><strong>Music</strong> - Play audio files with playback controls, volume adjustment, loop, and seeking</li>
                          <li><strong>Photos</strong> - View screenshots and images with full-screen preview and delete options</li>
                          <li><strong>Calculator</strong> - Perform calculations with basic operations, decimals, and percentages</li>
                          <li><strong>Settings</strong> - Customize clock format, desktop icons, themes, and boot options</li>
                          <li><strong>App Store</strong> - Browse and install themes and future apps</li>
                          <li><strong>Help</strong> - Access this comprehensive guide to NautilusOS features</li>
                      </ul>
                  </div>

                  <div class="help-section">
                      <h3><i class="fas fa-desktop"></i> Desktop Features</h3>
                      <ul>
                          <li><strong>Desktop Icons</strong> - Double-click to open apps, drag and drop to rearrange with grid snapping</li>
                          <li><strong>Start Menu</strong> - Click the fish icon to access all applications and sign out</li>
                          <li><strong>Taskbar</strong> - Shows pinned apps, open windows, and system tray with clock and indicators</li>
                          <li><strong>Windows</strong> - Drag title bar to move, resize from any edge, minimize/maximize/close with buttons</li>
                          <li><strong>Context Menus</strong> - Right-click on desktop, icons, and windows for quick actions</li>
                      </ul>
                  </div>

                  <div class="help-section">
                      <h3><i class="fas fa-bolt"></i> Quick Actions & Notifications</h3>
                      <ul>
                          <li><strong>Quick Actions Panel</strong> - Click the bolt icon in taskbar for screenshot capture and close all windows</li>
                          <li><strong>Notification Center</strong> - Click bell icon to view system message history and manage notifications</li>
                          <li><strong>Toast Notifications</strong> - Temporary pop-ups show important system messages and confirmations</li>
                      </ul>
                  </div>

                  <div class="help-section">
                      <h3><i class="fas fa-camera"></i> Taking Screenshots</h3>
                      <p>Capture your desktop:</p>
                      <ul>
                          <li>Click Quick Actions (bolt icon) in taskbar</li>
                          <li>Select Screenshot option</li>
                          <li>Choose which screen/window to capture in browser dialog</li>
                          <li>Screenshot automatically saves to Photos folder with date and time</li>
                          <li>Photos app opens automatically to view your screenshot</li>
                      </ul>
                  </div>

                  <div class="help-section">
                      <h3><i class="fas fa-cog"></i> Settings & Customization</h3>
                      <ul>
                          <li><strong>Clock Settings</strong> - Toggle between 12/24 hour format, show/hide seconds</li>
                          <li><strong>Desktop Icons</strong> - Show or hide all desktop icons</li>
                          <li><strong>Themes</strong> - Install and apply custom color schemes from App Store</li>
                          <li><strong>Boot Options</strong> - Reset boot preference to choose mode on next reload</li>
                      </ul>
                  </div>

                  <div class="help-section">
                      <h3><i class="fas fa-keyboard"></i> Tips & Tricks</h3>
                      <ul>
                          <li>Drag files between folders in Files app for quick organization</li>
                          <li>Use browser tabs to multitask across multiple websites</li>
                          <li>Save text files to device to download them to your real computer</li>
                          <li>Right-click anywhere for context menus with quick actions</li>
                          <li>Check notification history to review past system messages</li>
                          <li>Use calculator for quick math without opening separate tools</li>
                      </ul>
                  </div>
              </div>
          `,
          noPadding: true,
          width: 900,
          height: 600
      },
                      whatsnew: {
                          title: "What's New in NautilusOS",
                          icon: 'fas fa-star',
                          content: `
              <div class="whats-new-content">
                  <div class="whats-new-header">
      <h1>Welcome to NautilusOS v1.0! <br>What's new?</h1>
                      <p>Discover the latest features and improvements</p>
                  </div>

                  <div class="carousel-container">
                      <div class="carousel-slide active" data-slide="0">
                          <div class="carousel-illustration">
                              <div class="illustration-folder"></div>
                          </div>
                          <div class="carousel-content">
                              <h2>Advanced File System</h2>
                              <p>Navigate through folders with an intuitive tree sidebar. Create new folders, organize your files, and explore a fully functional virtual file system right in your browser.</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="1">
                          <div class="carousel-illustration">
                              <div class="illustration-tree">
                                  <div class="illustration-tree-item"></div>
                                  <div class="illustration-tree-item"></div>
                                  <div class="illustration-tree-item"></div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Multiple Windows Support</h2>
                              <p>Open multiple applications simultaneously and switch between them seamlessly. Drag windows to reposition, resize from any edge, minimize, maximize, or close - just like a real desktop environment!</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="2">
                          <div class="carousel-illustration">
                              <div class="illustration-boot">
                                  <div class="illustration-boot-icon">
                                      <i class="fas fa-desktop"></i>
                                  </div>
                                  <div class="illustration-boot-divider"></div>
                                  <div class="illustration-boot-icon">
                                      <i class="fas fa-code"></i>
                                  </div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Multiple Boot Options</h2>
                              <p>Choose between graphical mode or command-line interface on startup. Your preference is remembered, giving you full control over your NautilusOS experience.</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="3">
                          <div class="carousel-illustration">
                              <div class="illustration-taskbar">
                                  <div class="illustration-taskbar-square"></div>
                                  <div class="illustration-taskbar-divider"></div>
                                  <div class="illustration-taskbar-circles">
                                      <div class="illustration-taskbar-circle"></div>
                                      <div class="illustration-taskbar-circle"></div>
                                      <div class="illustration-taskbar-circle"></div>
                                      <div class="illustration-taskbar-circle"></div>
                                  </div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Dynamic Taskbar</h2>
                              <p>Open apps automatically appear in your taskbar. See which window is focused with visual indicators, and quickly switch between applications.</p>
                          </div>
                      </div>
       <div class="carousel-slide" data-slide="4">
                          <div class="carousel-illustration">
                              <div class="illustration-apps-grid">
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-folder"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-terminal"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-globe"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-edit"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-music"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-images"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-cog"></i>
                                  </div>
                                  <div class="illustration-apps-icon">
                                      <i class="fas fa-star"></i>
                                  </div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Tons of Apps!</h2>
                              <p>File manager, terminal, browser, text editor, music player, photos, settings, and more. Everything you need for productivity, entertainment, and customization - all built right in!</p>
                          </div>
                      </div>

      <div class="carousel-slide" data-slide="5">
                          <div class="carousel-illustration">
                              <div class="illustration-store">
      <div class="illustration-store-header">
                                      <div class="illustration-store-icon">
                                          <i class="fas fa-store"></i>
                                      </div>
                                      <div class="illustration-store-title-bar"></div>
                                  </div>
                                  <div class="illustration-store-items">
                                      <div class="illustration-store-item">
                                          <div class="illustration-store-item-icon"></div>
                                          <div class="illustration-store-item-info">
                                              <div class="illustration-store-item-name"></div>
                                              <div class="illustration-store-item-desc"></div>
                                          </div>
                                          <div class="illustration-store-item-btn"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Built-in App Store</h2>
                              <p>Discover and install new applications from the NautilusOS App Store. Browse featured themes, apps, and tools to extend your desktop experience with just a click!</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="6">
                          <div class="carousel-illustration">
                              <div class="illustration-cogs">
                                  <i class="fas fa-cog illustration-cog"></i>
                                  <i class="fas fa-cog illustration-cog"></i>
                                  <i class="fas fa-cog illustration-cog"></i>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Fully Customizable</h2>
                              <p>Personalize your experience with extensive settings. Make NautilusOS truly yours by installing different themes, changing cloaking settings, arranging desktop icons, configuring boot preferences, and more.</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="7">
                          <div class="carousel-illustration">
                              <div class="illustration-login">
                                  <div class="illustration-avatar">
                                      <i class="fas fa-user"></i>
                                  </div>
                                  <div class="illustration-input"></div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Secure Login Screen</h2>
                              <p>Beautiful login interface with system information, real-time clock, and smooth transitions. Your personalized workspace awaits behind a polished authentication screen.</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="8">
          <div class="carousel-illustration">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                  <div style="width: 200px; height: 140px; background: rgba(21, 25, 35, 0.95); border: 2px solid var(--accent); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative;">
                      <div style="position: absolute; top: 20px; width: 100px; height: 60px; background: linear-gradient(135deg, var(--accent), var(--accent-hover)); border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.5rem; color: var(--bg-primary); box-shadow: 0 4px 12px rgba(125, 211, 192, 0.4); animation: float 3s ease-in-out infinite;">
                          <i class="fas fa-fish"></i>
                          <i class="fas fa-user-plus" style="font-size: 1.2rem;"></i>
                      </div>
                      <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; margin-top: 4rem;">
                          <div style="height: 12px; background: rgba(125, 211, 192, 0.3); border-radius: 4px; width: 100%;"></div>
                          <div style="height: 12px; background: rgba(125, 211, 192, 0.3); border-radius: 4px; width: 100%;"></div>
                      </div>
                  </div>

              </div>
          </div>
          <div class="carousel-content">
              <h2>Easy Account Setup</h2>
              <p>First-time setup wizard guides you through creating your account with username and password. Choose which themes to install right from the start, and get welcomed with personalized messages!</p>
          </div>
      </div>
                      <div class="carousel-slide" data-slide="9">
                          <div class="carousel-illustration">
                              <div class="illustration-browser-window">
                                  <div class="illustration-browser-header">
                                      <div class="illustration-browser-controls"></div>
                                      <div class="illustration-browser-url"></div>
                                  </div>
                                  <div class="illustration-browser-content">
                                  </div>
                              </div>
                          </div>
                          <div class="carousel-content">
                              <h2>Built-in Web Browser</h2>
                              <p>Browse the web without leaving NautilusOS! Full-featured browser with multiple tabs, navigation controls, and URL bar. Visit your favorite websites right from your virtual desktop.</p>
                          </div>
                      </div>

                      <div class="carousel-slide" data-slide="10">
          <div class="carousel-illustration">
              <div style="display: flex; gap: 2rem; align-items: center;">
                  <div style="width: 100px; height: 100px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--accent); animation: float 3s ease-in-out infinite;">
                      <i class="fas fa-bolt"></i>
                  </div>
                  <div style="width: 3px; height: 100px; background: var(--accent); opacity: 0.4; border-radius: 2px;"></div>
                  <div style="display: flex; flex-direction: column; gap: 1rem;">
                      <div style="width: 80px; height: 80px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--accent); animation: float 3s ease-in-out infinite; animation-delay: 0.3s;">
                          <i class="fas fa-camera"></i>
                      </div>
                      <div style="width: 80px; height: 80px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--accent); animation: float 3s ease-in-out infinite; animation-delay: 0.6s;">
                          <i class="fas fa-times-circle"></i>
                      </div>
                  </div>
              </div>
          </div>
          <div class="carousel-content">
              <h2>Quick Actions Panel</h2>
              <p>Access frequently used actions instantly from the taskbar. Take screenshots, close all windows, sign out, and more with just one click. Your productivity shortcuts in one convenient place.</p>
          </div>
      </div>
<div class="carousel-slide" data-slide="11">
    <div class="carousel-illustration">
        <div style="display: flex; gap: 2rem; align-items: center;">
            <div style="width: 120px; height: 120px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--accent); animation: float 3s ease-in-out infinite;">
                <i class="fas fa-file-export"></i>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="width: 40px; height: 3px; background: var(--accent); border-radius: 2px;"></div>
                <div style="width: 60px; height: 3px; background: var(--accent); border-radius: 2px;"></div>
                <div style="width: 50px; height: 3px; background: var(--accent); border-radius: 2px;"></div>
            </div>
            <div style="width: 120px; height: 120px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--accent); animation: float 3s ease-in-out infinite; animation-delay: 0.5s;">
                <i class="fas fa-file-import"></i>
            </div>
        </div>
    </div>
    <div class="carousel-content">
        <h2>Import & Export Profiles</h2>
        <p>Backup your entire NautilusOS experience! Export your profile to save settings, files, apps, and themes. Import profiles to restore your setup on any device or share configurations with others.</p>
    </div>
</div>

<div class="carousel-slide" data-slide="12">
          <div class="carousel-illustration">
              <div style="display: flex; gap: 1.5rem; align-items: center;">
                  <div style="width: 100px; height: 100px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--accent); animation: float 3s ease-in-out infinite;">
                      <i class="fas fa-bell"></i>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                      <div style="width: 120px; height: 35px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 8px; animation: float 3s ease-in-out infinite; animation-delay: 0.2s;"></div>
                      <div style="width: 120px; height: 35px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 8px; animation: float 3s ease-in-out infinite; animation-delay: 0.4s;"></div>
                      <div style="width: 120px; height: 35px; background: rgba(125, 211, 192, 0.2); border: 2px solid var(--accent); border-radius: 8px; animation: float 3s ease-in-out infinite; animation-delay: 0.6s;"></div>
                  </div>
              </div>
          </div>
          <div class="carousel-content">
              <h2>Notification Center</h2>
              <p>Never miss important system messages! View all your notifications in one place, track their history, and clear them when you're done. Stay informed about everything happening in NautilusOS.</p>
          </div>
      </div>
                      <div class="carousel-controls">
                          <div class="carousel-btn" onclick="changeSlide(-1)">
                              <i class="fas fa-chevron-left"></i>
                          </div>
                          <div class="carousel-btn" onclick="changeSlide(1)">
                              <i class="fas fa-chevron-right"></i>
                          </div>
                      </div>

      <div class="carousel-dots">
          <div class="carousel-dot active" onclick="goToSlide(0)"></div>
          <div class="carousel-dot" onclick="goToSlide(1)"></div>
          <div class="carousel-dot" onclick="goToSlide(2)"></div>
          <div class="carousel-dot" onclick="goToSlide(3)"></div>
          <div class="carousel-dot" onclick="goToSlide(4)"></div>
          <div class="carousel-dot" onclick="goToSlide(5)"></div>
          <div class="carousel-dot" onclick="goToSlide(6)"></div>
          <div class="carousel-dot" onclick="goToSlide(7)"></div>
          <div class="carousel-dot" onclick="goToSlide(8)"></div>
          <div class="carousel-dot" onclick="goToSlide(9)"></div>
          <div class="carousel-dot" onclick="goToSlide(10)"></div>
          <div class="carousel-dot" onclick="goToSlide(11)"></div>
          <div class="carousel-dot" onclick="goToSlide(12)"></div>
      </div>
                          </div>

                  <div class="whats-new-footer">
                      <div class="footer-card">
                          <h3><i class="fas fa-question-circle"></i> Need Help?</h3>
                          <p>Check out our comprehensive help guide to learn more about all the features and keyboard shortcuts available in NautilusOS.</p>
                          <a href="#" onclick="event.preventDefault(); hideContextMenu(); openApp('help')">
                              Open Help <i class="fas fa-arrow-right"></i>
                          </a>
                      </div>

                      <div class="footer-card">
                          <h3><i class="fas fa-code"></i> Open Source</h3>
                          <p>NautilusOS is crafted with care by <strong>dinguschan</strong>. Built with vanilla HTML, CSS, and JavaScript - no frameworks needed!</p>
                          <a href="https://github.com" target="_blank" onclick="event.stopPropagation()">
                              View on GitHub <i class="fas fa-external-link-alt"></i>
                          </a>
                      </div>
                  </div>
          `,noPadding: true,
                          width: 900,
                          height: 600
                      },
                    calculator: {
          title: 'Calculator',
          icon: 'fas fa-calculator',
          content: `
              <div class="calculator">
                  <div class="calculator-display">
                      <div class="calculator-history" id="calcHistory"></div>
                      <div id="calcDisplay">0</div>
                  </div>
                  <div class="calculator-buttons">
                      <button class="calculator-btn clear" onclick="calcClear()">C</button>
                      <button class="calculator-btn operator" onclick="calcInput('/')">/</button>
                      <button class="calculator-btn operator" onclick="calcInput('*')">×</button>
      <button class="calculator-btn operator" onclick="calcBackspace()"><i class="fas fa-backspace"></i></button>

                      <button class="calculator-btn" onclick="calcInput('7')">7</button>
                      <button class="calculator-btn" onclick="calcInput('8')">8</button>
                      <button class="calculator-btn" onclick="calcInput('9')">9</button>
                      <button class="calculator-btn operator" onclick="calcInput('-')">-</button>

                      <button class="calculator-btn" onclick="calcInput('4')">4</button>
                      <button class="calculator-btn" onclick="calcInput('5')">5</button>
                      <button class="calculator-btn" onclick="calcInput('6')">6</button>
                      <button class="calculator-btn operator" onclick="calcInput('+')">+</button>

                      <button class="calculator-btn" onclick="calcInput('1')">1</button>
                      <button class="calculator-btn" onclick="calcInput('2')">2</button>
                      <button class="calculator-btn" onclick="calcInput('3')">3</button>
                      <button class="calculator-btn operator" onclick="calcInput('%')">%</button>

                      <button class="calculator-btn zero" onclick="calcInput('0')">0</button>
                      <button class="calculator-btn" onclick="calcInput('.')">.</button>
                      <button class="calculator-btn equals" onclick="calcEquals()">=</button>
                  </div>
              </div>
          `,
          noPadding: true,
          width: 400,
          height: 600
      },
      appstore: {
          title: 'App Store',
          icon: 'fas fa-store',
          content: (() => {
              const lightThemeInstalled = installedThemes.includes('light');
              return `
              <div class="appstore-content">
                  <div class="appstore-sidebar">
          <div class="appstore-section active" onclick="switchAppStoreSection('themes', this)">
              <i class="fas fa-palette"></i>
              <span>Themes</span>
          </div>
          <div class="appstore-section" onclick="switchAppStoreSection('apps', this)">
              <i class="fas fa-th"></i>
              <span>Apps</span>
          </div>
      </div>
                  <div class="appstore-main" id="appstoreMain">
                      <div class="appstore-header">
                          <h2>Themes</h2>
                          <p>Customize your NautilusOS experience</p>
                      </div>
                      <div class="appstore-grid">
                          <div class="appstore-item">
                              <div class="appstore-item-icon">
                                  <i class="fas fa-moon"></i>
                              </div>
                              <div class="appstore-item-name">Dark Theme by dinguschan</div>
                              <div class="appstore-item-desc">The default NautilusOS theme. Sleek dark interface with teal accents, perfect for extended use and reducing eye strain.</div>
                              <button class="appstore-item-btn installed" style="opacity: 0.6; cursor: not-allowed;" disabled>
                                  Installed (Default)
                              </button>
                          </div>
                          <div class="appstore-item">
                              <div class="appstore-item-icon">
                                  <i class="fas fa-sun"></i>
                              </div>
                              <div class="appstore-item-name">Light Theme by dinguschan</div>
                              <div class="appstore-item-desc">A bright and clean theme perfect for daytime use. Easy on the eyes with light backgrounds and dark text.</div>
                              <button class="appstore-item-btn ${lightThemeInstalled ? 'installed' : ''}" onclick="${lightThemeInstalled ? 'uninstallTheme(\'light\')' : 'installTheme(\'light\')'}">
                                  ${lightThemeInstalled ? 'Uninstall' : 'Install'}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
              `;
          })(),
          noPadding: true,
          width: 900,
          height: 600
      }
                  };

                  if (apps[appName]) {
                      const app = apps[appName];
                      createWindow(
                          app.title,
                          app.icon,
                          app.content,
                          app.width || 800,
                          app.height || 600,
                          appName,
                          app.noPadding || false
                      );

                      if (appName === 'terminal') {
                          setTimeout(() => {
                              const input = document.getElementById('terminalInput');
                              if (input) input.focus();
                          }, 100);
                      }
      if (appName === 'browser') {
          setTimeout(() => {
              showToast('Nautilus Browser not good enough? Check out Helios Browser on the App Store!', 'fa-info-circle');
          }, 500);
      }
                      if (appName === 'whatsnew') {
                          currentSlide = 0;
                      }
                  }
              }

              function handleTerminalInput(e) {
                  if (e.key === 'Enter') {
                      const input = e.target;
                      const command = input.value.trim();
                      const terminal = document.getElementById('terminalContent');

                      const cmdLine = document.createElement('div');
                      cmdLine.className = 'terminal-line';
                      cmdLine.innerHTML = `<span class="terminal-prompt">user@nautilusos:~$ </span>${command}`;
                      terminal.insertBefore(cmdLine, terminal.lastElementChild);

                      const output = document.createElement('div');
                      output.className = 'terminal-line';

                      if (command === 'help') {
                          output.innerHTML = 'Available commands:<br>' +
                              'help - Show this list<br>' +
                              'ls - List files in file system<br>' +
                              'apps - List installed applications<br>' +
                              'themes - List installed themes<br>' +
                              'clear - Clear terminal<br>' +
                              'date - Show current date and time<br>' +
                              'whoami - Display current username<br>' +
                              'reset-boot - Reset bootloader preferences<br>' +
                              'echo [text] - Display text';
                      } else if (command === 'ls') {
                          const tree = '.\n' + generateFileTree(fileSystem);
                          output.innerHTML = '<pre style="margin: 0; font-family: inherit;">' + tree + '</pre>';
                      } else if (command === 'apps') {
                          const appList = [
                              'Files - File manager and explorer',
                              'Terminal - Command line interface',
                              'Browser - Web browser',
                              'Settings - System settings',
                              'Text Editor - Edit text files',
                              'Music - Music player',
                              'Photos - Photo viewer',
                              'Help - System help and documentation',
                              'What\'s New - View latest features',
                              'App Store - Browse and install apps/themes'
                          ];
                          output.innerHTML = '<span style="color: var(--accent);">Installed Applications:</span><br>' +
                              appList.map(app => `  • ${app}`).join('<br>');
                      } else if (command === 'themes') {
                          const themeList = ['Dark Theme (Default)'];
                          if (installedThemes.length > 0) {
                              installedThemes.forEach(theme => {
                                  themeList.push(`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`);
                              });
                          }
                          output.innerHTML = '<span style="color: var(--accent);">Installed Themes:</span><br>' +
                              themeList.map(theme => `  • ${theme}`).join('<br>');
                      } else if (command === 'whoami') {
                          output.textContent = currentUsername;
                      } else if (command === 'reset-boot') {
                          localStorage.removeItem('nautilusOS_bootChoice');
                          output.innerHTML = '<span style="color: #4ade80;">✓ Bootloader preferences reset successfully</span><br>' +
                              'The bootloader menu will appear on next page reload.';
                      } else if (command === 'clear') {
                          terminal.innerHTML = `
                      <div class="terminal-line" style="color: var(--accent);">NautilusOS Terminal v1.0</div>
                      <div class="terminal-line" style="color: #888; margin-bottom: 1rem;">Type 'help' for available commands</div>
                  `;
                      } else if (command === 'date') {
                          output.textContent = new Date().toString();
                      } else if (command.startsWith('echo ')) {
                          output.textContent = command.substring(5);
                      } else if (command) {
                          output.innerHTML = `<span style="color: #ef4444;">Command not found: ${command}</span><br>Type 'help' for available commands.`;
                      }

                      if (command !== 'clear' && command) {
                          terminal.insertBefore(output, terminal.lastElementChild);
                      }

                      const newInputLine = document.createElement('div');
                      newInputLine.className = 'terminal-line';
                      newInputLine.innerHTML = '<span class="terminal-prompt">user@nautilusos:~$ </span><input type="text" class="terminal-input" id="terminalInput" onkeypress="handleTerminalInput(event)">';

                      terminal.removeChild(terminal.lastElementChild);
                      terminal.appendChild(newInputLine);

                      const newInput = document.getElementById('terminalInput');
                      if (newInput) newInput.focus();

                      terminal.scrollTop = terminal.scrollHeight;
                  }
              }

      function toggleSetting(setting) {
          if (setting === 'showWhatsNew') {
              const currentValue = localStorage.getItem('nautilusOS_showWhatsNew');
              const newValue = currentValue === 'false' ? 'true' : 'false';
              localStorage.setItem('nautilusOS_showWhatsNew', newValue);

              const toggles = document.querySelectorAll('.toggle-switch');
              toggles.forEach(toggle => {
                  const parent = toggle.parentElement;
                  if (parent.textContent.includes('Show on Startup')) {
                      if (newValue === 'true') {
                          toggle.classList.add('active');
                      } else {
                          toggle.classList.remove('active');
                      }
                  }
              });
              return;
          }

          settings[setting] = !settings[setting];
          saveSettingsToLocalStorage(); // Add this line

          if (setting === 'showDesktopIcons') {
              const icons = document.getElementById('desktopIcons');
              if (settings.showDesktopIcons) {
                  icons.classList.remove('hidden');
              } else {
                  icons.classList.add('hidden');
              }
          }

          const toggles = document.querySelectorAll('.toggle-switch');
          toggles.forEach(toggle => {
              const parent = toggle.parentElement;
              if (parent.textContent.includes('12-Hour') && setting === 'use12Hour') {
                  toggle.classList.toggle('active');
              } else if (parent.textContent.includes('Show Seconds') && setting === 'showSeconds') {
                  toggle.classList.toggle('active');
              } else if (parent.textContent.includes('Show Desktop Icons') && setting === 'showDesktopIcons') {
                  toggle.classList.toggle('active');
              }
          });
      }

              document.addEventListener('DOMContentLoaded', () => {
                  const passwordInput = document.getElementById('password');
                  if (passwordInput) {
                      passwordInput.addEventListener('keypress', (e) => {
                          if (e.key === 'Enter') login();
                      });
                  }
              });

              document.addEventListener('click', (e) => {
                  const startMenu = document.getElementById('startMenu');

                  if (startMenu && !startMenu.contains(e.target) && !e.target.closest('.taskbar-icon')) {
                      startMenu.classList.remove('active');
                  }
              });

              function updateLoginGreeting() {
                  const now = new Date();
                  const hour = now.getHours();
                  const greetingEl = document.getElementById('loginGreeting');
                  let greeting = 'Welcome Back';

                  if (hour >= 5 && hour < 12) {
                      greeting = 'Good Morning';
                  } else if (hour >= 12 && hour < 17) {
                      greeting = 'Good Afternoon';
                  } else if (hour >= 17 && hour < 22) {
                      greeting = 'Good Evening';
                  } else {
                      greeting = 'Good Night';
                  }

                  if (greetingEl) {
                      greetingEl.textContent = greeting;
                  }
              }

              function getFileSystemAtPath(path) {
                  let current = fileSystem;
                  for (let segment of path) {
                      if (current[segment] && typeof current[segment] === 'object') {
                          current = current[segment];
                      } else {
                          return null;
                      }
                  }
                  return current;
              }

              function navigateToPath(path) {
                  currentPath = [...path];
                  if (windows['files']) {
                      updateFileExplorer();
                  }
              }

              function updateFileExplorer() {
                  if (!windows['files']) return;

                  let current = getFileSystemAtPath(currentPath);
                  if (!current) {
                      current = fileSystem;
                      currentPath = [];
                  }
                  setTimeout(() => {
                      expandTreeToPath(currentPath);
                  }, 50);
                  const fileExplorer = windows['files'].querySelector('.file-explorer');
                  if (!fileExplorer) return;

                  fileExplorer.innerHTML = `
              <div class="file-sidebar">
                  <div style="padding: 0.5rem 0.5rem 1rem; color: var(--text-primary); font-weight: 600; font-size: 0.9rem; border-bottom: 1px solid var(--border); margin-bottom: 0.5rem;">
                      <i class="fas fa-folder-tree"></i> File System
                  </div>
                  ${renderFileTree()}
              </div>
              <div class="file-main">
                  <div class="file-toolbar">
                      <button class="editor-btn" onclick="goUpDirectory()" ${currentPath.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                          <i class="fas fa-arrow-up"></i> Up
                      </button>
                      <button class="editor-btn" onclick="createNewFolder()">
                          <i class="fas fa-folder-plus"></i> New Folder
                      </button>
                      <div class="file-breadcrumb">
                          ${renderBreadcrumb()}
                      </div>
                  </div>
      <div class="file-grid">
                              ${Object.keys(current).sort().map(file => {
                                  const isFolder = typeof current[file] === 'object';
                                  const icon = isFolder ? 'fa-folder' : 'fa-file-alt';
                                  const escapedFile = file.replace(/'/g, "\\'");
                                  return `
                                      <div class="file-item" ondblclick="openFile('${escapedFile}')" onclick="selectFileItem(event, this, '${escapedFile}')" draggable="true" ondragstart="handleFileDragStart(event, '${escapedFile}')" ondragover="handleFileDragOver(event, ${isFolder})" ondrop="handleFileDrop(event, '${escapedFile}')">
                                          <i class="fas ${icon}"></i>
                                          <span>${file}</span>
                                          <div class="file-actions">
                                              <button class="file-action-btn" onclick="event.stopPropagation(); openFile('${escapedFile}')">
                                                  <i class="fas fa-folder-open"></i> Open
                                              </button>
                                              <button class="file-action-btn delete" onclick="event.stopPropagation(); deleteFile('${escapedFile}')">
                                                  <i class="fas fa-trash"></i> Delete
                                              </button>
                                          </div>
                                      </div>
                                  `;
                              }).join('')}
                          </div>
              </div>
          `;
              }

              function renderFileTree(fs = fileSystem, parentPath = [], level = 0) {
                  let html = '';

                  Object.keys(fs).sort().forEach(name => {
                      const item = fs[name];
                      const isFolder = typeof item === 'object';
                      const currentItemPath = [...parentPath, name];
                      const pathString = currentItemPath.join('/');
                      const isActive = JSON.stringify(currentItemPath) === JSON.stringify(currentPath);

                      if (isFolder) {
                          html += `
                      <div class="file-tree-item folder ${isActive ? 'active' : ''}" onclick="navigateToFolderFromTree('${pathString}')" data-path="${pathString}">
                          <i class="fas fa-chevron-right" onclick="toggleTreeFolder(this.parentElement, '${pathString}', event)" style="cursor: pointer;"></i>
                          <i class="fas fa-folder"></i>
                          <span>${name}</span>
                      </div>
                      <div class="file-tree-children" data-path="${pathString}">
                          ${renderFileTree(item, currentItemPath, level + 1)}
                      </div>
                  `;
                      } else {
                          html += `
                      <div class="file-tree-item ${isActive ? 'active' : ''}" onclick="openFileFromTree('${pathString}')" data-path="${pathString}">
                          <i class="fas fa-file-alt"></i>
                          <span>${name}</span>
                      </div>
                  `;
                      }
                  });

                  return html;
              }

              function toggleTreeFolder(element, pathString, event) {
                  event.stopPropagation();
                  const children = document.querySelector(`.file-tree-children[data-path="${pathString}"]`);

                  if (children) {
                      const isExpanded = children.classList.contains('expanded');
                      if (isExpanded) {
                          children.classList.remove('expanded');
                          element.classList.remove('expanded');
                      } else {
                          children.classList.add('expanded');
                          element.classList.add('expanded');
                      }
                  }
              }

              function navigateToFolderFromTree(pathString) {
                  const path = pathString ? pathString.split('/') : [];
                  navigateToPath(path);
              }

              function openFileFromTree(pathString) {
                  const path = pathString.split('/');
                  const filename = path[path.length - 1];
                  const parentPath = path.slice(0, -1);

                  let current = fileSystem;
                  for (let segment of parentPath) {
                      current = current[segment];
                  }

                  const content = current[filename];
                  if (typeof content === 'string') {
                      openApp('editor', content, filename);
                  }
              }

              function renderBreadcrumb() {
                  if (currentPath.length === 0) {
                      return '<span class="breadcrumb-item" onclick="navigateToPath([])"><i class="fas fa-home"></i> Home</span>';
                  }

                  let html = '<span class="breadcrumb-item" onclick="navigateToPath([])"><i class="fas fa-home"></i> Home</span>';

                  currentPath.forEach((segment, index) => {
                      const path = currentPath.slice(0, index + 1);
                      html += ' <span class="breadcrumb-separator">/</span> ';
                      html += `<span class="breadcrumb-item" onclick='navigateToPath(${JSON.stringify(path)})'>${segment}</span>`;
                  });

                  return html;
              }
      const fileChecksum1 = 'bWFkZSB3aXRoIDxpIGNsYXNzPSJmYS1zb2xpZCBmYS1oZWFydCI+PC9pPiBieSBkaW5ndXNjaGFu';
      const fileChecksum2 = 'YnkgZGluZ3VzY2hhbg';

      function moveFileToFolder() {
          const bottomTextElement = document.getElementById('bottom-text');
          const bylineElement = document.querySelector('.wallpaper-byline');

          let bottomContent = '';
          let bylineContent = '';

          if (bottomTextElement) {
              bottomContent = bottomTextElement.innerHTML.trim();
          }

          if (bylineElement) {
              bylineContent = bylineElement.textContent.trim();
          }

          const expectedBottom = atob(fileChecksum1);
          const expectedByline = atob(fileChecksum2);

          const bottomValid = bottomContent === expectedBottom;
          const bylineValid = bylineContent === expectedByline;

          if (!bottomValid || !bylineValid) {
              window.openApp = window.closeWindow = window.minimizeWindow = window.showToast = window.handleTaskbarClick = function() {};

              const elements = document.querySelectorAll('div, body, html, :root');
              elements.forEach(el => {
                  el.style.transition = 'none';
                  el.style.animation = 'none';
                  el.style.backgroundColor = '#000';
                  el.style.color = '#000';
                  el.style.borderColor = '#000';
                  el.style.boxShadow = 'none';
                  el.style.backgroundImage = 'none';
              });

              document.body.innerHTML = '<div style="position:fixed;inset:0;background:#000;z-index:99999;"></div>';

              return false;
          }

          return true;
      }

      moveFileToFolder();

              function goUpDirectory() {
                  if (currentPath.length > 0) {
                      currentPath.pop();
                      if (windows['files']) {
                          updateFileExplorer();
                      }
                  }
              }

              function createNewFolder() {
                  const folderName = prompt('Enter folder name:');
                  if (!folderName) return;

                  let current = getFileSystemAtPath(currentPath);
                  if (current && !current[folderName]) {
                      current[folderName] = {};
                      showToast('Folder created: ' + folderName, 'fa-folder-plus');
                      if (windows['files']) {
                          updateFileExplorer();
                      }
                  } else {
                      showToast('Folder already exists or invalid location', 'fa-exclamation-circle');
                  }
              }

              function showContextMenu(x, y, items) {
                  const menu = document.getElementById('contextMenu');
                  menu.innerHTML = items.map(item => {
                      if (item.divider) {
                          return '<div class="context-menu-divider"></div>';
                      }
                      const disabledClass = item.disabled ? 'disabled' : '';
                      return `
                  <div class="context-menu-item ${disabledClass}" onclick="${item.action}">
                      <i class="fas ${item.icon}"></i>
                      <span>${item.label}</span>
                  </div>
              `;
                  }).join('');

                  menu.style.left = x + 'px';
                  menu.style.top = y + 'px';
                  menu.classList.add('active');

                  // Adjust if menu goes off screen
                  setTimeout(() => {
                      const rect = menu.getBoundingClientRect();
                      if (rect.right > window.innerWidth) {
                          menu.style.left = (x - rect.width) + 'px';
                      }
                      if (rect.bottom > window.innerHeight) {
                          menu.style.top = (y - rect.height) + 'px';
                      }
                  }, 0);
              }

              function hideContextMenu() {
                  const menu = document.getElementById('contextMenu');
                  menu.classList.remove('active');
              }

function refreshDesktop() {
    hideContextMenu();
    
    const openWindows = Object.keys(windows);
    
    if (openWindows.length === 0) {
        showToast('Desktop refreshed', 'fa-sync');
        return;
    }
    
    const appsToReopen = [...openWindows];
    
    appsToReopen.forEach(appName => {
        const windowEl = windows[appName];
        if (windowEl) {
            windowEl.remove();
        }
    });
    
    windows = {};
    focusedWindow = null;
    updateTaskbarIndicators();
    
    showToast('Refreshing all applications...', 'fa-sync');
    
    setTimeout(() => {
        appsToReopen.forEach((appName, index) => {
            setTimeout(() => {
                openApp(appName);
            }, index * 100);
        });
        
        showToast(`Refreshed ${appsToReopen.length} application(s)`, 'fa-check-circle');
    }, 500);
}

              function openNewTextFile() {
                  hideContextMenu();
                  openApp('editor', '', '');
              }

              function openNewFolder() {
                  hideContextMenu();
                  createNewFolder();
              }

              function initContextMenu() {
                  document.addEventListener('contextmenu', (e) => {
if (e.target.closest('.desktop-icon')) {
    e.preventDefault();
    const icon = e.target.closest('.desktop-icon');
    const appName = icon.getAttribute('data-app');
    showContextMenu(e.clientX, e.clientY, [
        {
            icon: 'fa-folder-open',
            label: 'Open',
            action: `hideContextMenu(); openApp('${appName}')`
        },
        {
            divider: true
        },
        {
            icon: 'fa-info-circle',
            label: 'Properties',
            action: `hideContextMenu(); showProperties('${appName}', ${e.clientX}, ${e.clientY})`
        }
    ]);
    return;
}

                      if (e.target.closest('.window')) {
                          e.preventDefault();
                          const windowEl = e.target.closest('.window');
                          const appName = windowEl.dataset.appName || '';
                          const isMaximized = windowEl.dataset.maximized === 'true';
                          showContextMenu(e.clientX, e.clientY, [{
                                  icon: 'fa-window-minimize',
                                  label: 'Minimize',
                                  action: `hideContextMenu(); setTimeout(() => minimizeWindowByAppName('${appName}'), 50)`
                              },
                              {
                                  icon: 'fa-window-maximize',
                                  label: isMaximized ? 'Restore' : 'Maximize',
                                  action: `hideContextMenu(); setTimeout(() => maximizeWindowByAppName('${appName}'), 50)`
                              },
                              {
                                  divider: true
                              },
                              {
                                  icon: 'fa-times',
                                  label: 'Close Window',
                                  action: `hideContextMenu(); setTimeout(() => closeWindowByAppName('${appName}'), 50)`
                              },
                              {
                                  divider: true
                              },
                              {
                                  icon: 'fa-question-circle',
                                  label: 'Help',
                                  action: `hideContextMenu(); openApp('help')`
                              }
                          ]);
                          return;
                      }

                      if (e.target.closest('#desktop')) {
                          e.preventDefault();
                          showContextMenu(e.clientX, e.clientY, [{
                                  icon: 'fa-sync',
                                  label: 'Refresh',
                                  action: 'refreshDesktop()'
                              },
                              {
                                  divider: true
                              },
                              {
                                  icon: 'fa-file',
                                  label: 'New Text File',
                                  action: 'openNewTextFile()'
                              },
                              {
                                  icon: 'fa-folder-plus',
                                  label: 'New Folder',
                                  action: 'openNewFolder()'
                              },
                              {
                                  divider: true
                              },
                              {
                                  icon: 'fa-question-circle',
                                  label: 'Help',
                                  action: `hideContextMenu(); openApp('help')`
                              }
                          ]);
                          return;
                      }
                  });

                  document.addEventListener('click', (e) => {
                      if (!e.target.closest('.context-menu')) {
                          hideContextMenu();
                      }
                  });
              }

              let currentSlide = 0;

              function changeSlide(direction) {
                  const slides = document.querySelectorAll('.carousel-slide');
                  const dots = document.querySelectorAll('.carousel-dot');

                  if (!slides.length) return;

                  slides[currentSlide].classList.remove('active');
                  dots[currentSlide].classList.remove('active');

                  currentSlide += direction;

                  if (currentSlide >= slides.length) currentSlide = 0;
                  if (currentSlide < 0) currentSlide = slides.length - 1;

                  slides[currentSlide].classList.add('active');
                  dots[currentSlide].classList.add('active');
              }

              function goToSlide(index) {
                  const slides = document.querySelectorAll('.carousel-slide');
                  const dots = document.querySelectorAll('.carousel-dot');

                  if (!slides.length) return;

                  slides[currentSlide].classList.remove('active');
                  dots[currentSlide].classList.remove('active');

                  currentSlide = index;

                  slides[currentSlide].classList.add('active');
                  dots[currentSlide].classList.add('active');
              }

              function initScrollIndicator() {
                  const indicator = document.getElementById('scrollIndicator');
                  if (!indicator) return;

                  setTimeout(() => {
                      if (document.documentElement.scrollHeight > window.innerHeight) {
                          indicator.classList.add('visible');
                      }
                  }, 1000);

                  window.addEventListener('scroll', () => {
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      const scrollHeight = document.documentElement.scrollHeight;
                      const clientHeight = document.documentElement.clientHeight;

                      if (scrollTop > 100) {
                          indicator.classList.remove('visible');
                      } else if (scrollHeight > clientHeight) {
                          indicator.classList.add('visible');
                      }
                  });
              }

              let selectedFileItem = null;
              let draggedFileName = null;

              function selectFileItem(event, element, filename) {
                  if (event.detail === 2) return;
                  event.stopPropagation();

                  if (selectedFileItem && selectedFileItem !== element) {
                      selectedFileItem.classList.remove('selected');
                  }

                  if (element.classList.contains('selected')) {
                      element.classList.remove('selected');
                      selectedFileItem = null;
                  } else {
                      element.classList.add('selected');
                      selectedFileItem = element;
                  }
              }

              function handleFileDragStart(event, fileName) {
                  draggedFileName = fileName;
                  event.dataTransfer.setData('text/plain', fileName);
              }

              function handleFileDragOver(event, isFolder) {
                  if (!isFolder || !draggedFileName) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';

                  document.querySelectorAll('.file-item.drag-over')
                      .forEach(el => el.classList.remove('drag-over'));

                  event.currentTarget.classList.add('drag-over');
              }

              function handleFileDragLeave(event) {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                      event.currentTarget.classList.remove('drag-over');
                  }
              }

              function handleFileDrop(event, targetFolder) {
                  event.preventDefault();

                  document.querySelectorAll('.file-item.drag-over')
                      .forEach(el => el.classList.remove('drag-over'));

                  if (!draggedFileName || draggedFileName === targetFolder) return;

                  if (!draggedFileName || draggedFileName === targetFolder) return;

                  let current = getFileSystemAtPath(currentPath);
                  if (!current || !current[targetFolder] || typeof current[targetFolder] !== 'object') return;

                  const item = current[draggedFileName];
                  if (!item) return;

                  current[targetFolder][draggedFileName] = item;
                  delete current[draggedFileName];

                  showToast(`Moved "${draggedFileName}" to "${targetFolder}"`, 'fa-check-circle');
                  draggedFileName = null;

                  if (windows['files']) {
                      updateFileExplorer();
                  }
              }

              function handleGlobalDragEnd() {
                  document.querySelectorAll('.file-item.drag-over')
                      .forEach(el => el.classList.remove('drag-over'));
                  draggedFileName = null;
              }

              document.addEventListener('dragend', handleGlobalDragEnd);

              function deleteFile(filename) {
                  const confirmed = confirm(`Are you sure you want to delete "${filename}"?`);
                  if (!confirmed) return;

                  let current = getFileSystemAtPath(currentPath);
                  if (!current || !current[filename]) return;

                  delete current[filename];
                  showToast(`Deleted: ${filename}`, 'fa-trash');

                  if (selectedFileItem) {
                      selectedFileItem = null;
                  }

                  if (windows['files']) {
                      updateFileExplorer();
                  }
              }

              document.addEventListener('click', (e) => {
                  if (!e.target.closest('.file-item') && selectedFileItem) {
                      selectedFileItem.classList.remove('selected');
                      selectedFileItem = null;
                  }
              });

              function expandTreeToPath(path) {
                  let accumulated = [];
                  for (let segment of path) {
                      accumulated.push(segment);
                      const pathString = accumulated.join('/');
                      const treeItem = document.querySelector(`.file-tree-item[data-path="${pathString}"]`);
                      const children = document.querySelector(`.file-tree-children[data-path="${pathString}"]`);

                      if (treeItem && children) {
                          treeItem.classList.add('expanded');
                          children.classList.add('expanded');
                      }
                  }
              }
              let installedThemes = [];

      function switchAppStoreSection(section, element) {
          document.querySelectorAll('.appstore-section').forEach(s => s.classList.remove('active'));
          element.classList.add('active');

          const mainContent = document.getElementById('appstoreMain');

          if (section === 'themes') {
              const lightThemeInstalled = installedThemes.includes('light');
              mainContent.innerHTML = `
              <div class="appstore-header">
                  <h2>Themes</h2>
                  <p>Customize your NautilusOS experience</p>
              </div>
              <div class="appstore-grid">
                  <div class="appstore-item">
                      <div class="appstore-item-icon">
                          <i class="fas fa-moon"></i>
                      </div>
                      <div class="appstore-item-name">Dark Theme by dinguschan</div>
                      <div class="appstore-item-desc">The default NautilusOS theme. Sleek dark interface with teal accents, perfect for extended use and reducing eye strain.</div>
                      <button class="appstore-item-btn installed" style="opacity: 0.6; cursor: not-allowed;" disabled>
                          Installed (Default)
                      </button>
                  </div>
                  <div class="appstore-item">
                      <div class="appstore-item-icon">
                          <i class="fas fa-sun"></i>
                      </div>
                      <div class="appstore-item-name">Light Theme by dinguschan</div>
                      <div class="appstore-item-desc">A bright and clean theme perfect for daytime use. Easy on the eyes with light backgrounds and dark text.</div>
                      <button class="appstore-item-btn ${lightThemeInstalled ? 'installed' : ''}" onclick="${lightThemeInstalled ? 'uninstallTheme(\'light\')' : 'installTheme(\'light\')'}">
                          ${lightThemeInstalled ? 'Uninstall' : 'Install'}
                      </button>
                  </div>
              </div>
          `;
          } else if (section === 'apps') {
              const startupInstalled = installedApps.includes('startup-apps');
              const taskmanagerInstalled = installedApps.includes('task-manager');

              mainContent.innerHTML = `
                  <div class="appstore-header">
                      <h2>Apps</h2>
                      <p>Discover and install new applications</p>
                  </div>
                  <div class="appstore-grid">
                      <div class="appstore-item">
                          <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
    <div class="illustration-startup-window">
        <div class="illustration-startup-header">Startup Apps</div>
        <div class="illustration-startup-items">
            <div class="illustration-startup-item">
                <div class="illustration-startup-checkbox"></div>
                <div class="illustration-startup-icon"></div>
                <div class="illustration-startup-label"></div>
            </div>
            <div class="illustration-startup-item">
                <div class="illustration-startup-checkbox"></div>
                <div class="illustration-startup-icon"></div>
                <div class="illustration-startup-label"></div>
            </div>
            <div class="illustration-startup-item">
                <div class="illustration-startup-checkbox" style="background: rgba(125, 211, 192, 0.3);"></div>
                <div class="illustration-startup-icon"></div>
                <div class="illustration-startup-label"></div>
            </div>
        </div>
    </div>
</div>
                          <div class="appstore-item-name">Startup Apps by dinguschan</div>
                          <div class="appstore-item-desc">Control which applications launch automatically on login with this convenient this built-in app.</div>
                          <button class="appstore-item-btn ${startupInstalled ? 'installed' : ''}" onclick="${startupInstalled ? 'uninstallApp(\'startup-apps\')' : 'installApp(\'startup-apps\')'}">
                              ${startupInstalled ? 'Uninstall' : 'Install'}
                          </button>
                      </div>

                      <div class="appstore-item">
                <div style="margin-bottom: 1rem; display: flex; justify-content: center;">
    <div class="illustration-taskmanager">
                                      <div class="illustration-taskmanager-header">
                                          <div class="illustration-taskmanager-title">Task Manager</div>
                                          <div class="illustration-taskmanager-stat">CPU: 45%</div>
                                      </div>
                                      <div class="illustration-taskmanager-processes">
                                          <div class="illustration-taskmanager-process">
                                              <div class="illustration-taskmanager-process-icon"></div>
                                              <div class="illustration-taskmanager-process-name"></div>
                                              <div class="illustration-taskmanager-process-bar">
                                                  <div class="illustration-taskmanager-process-fill" style="width: 60%;"></div>
                                              </div>
                                          </div>
                                          <div class="illustration-taskmanager-process">
                                              <div class="illustration-taskmanager-process-icon"></div>
                                              <div class="illustration-taskmanager-process-name"></div>
                                              <div class="illustration-taskmanager-process-bar">
                                                  <div class="illustration-taskmanager-process-fill" style="width: 35%;"></div>
                                              </div>
                                          </div>
                                          <div class="illustration-taskmanager-process">
                                              <div class="illustration-taskmanager-process-icon"></div>
                                              <div class="illustration-taskmanager-process-name"></div>
                                              <div class="illustration-taskmanager-process-bar">
                                                  <div class="illustration-taskmanager-process-fill" style="width: 80%;"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          <div class="appstore-item-name">Task Manager by dinguschan</div>
                          <div class="appstore-item-desc">Monitor and manage running applications and windows. View system statistics and close unresponsive apps with ease.</div>
                          <button class="appstore-item-btn ${taskmanagerInstalled ? 'installed' : ''}" onclick="${taskmanagerInstalled ? 'uninstallApp(\'task-manager\')' : 'installApp(\'task-manager\')'}">
                              ${taskmanagerInstalled ? 'Uninstall' : 'Install'}
                          </button>
                      </div>
                                                </div>

                  </div>
              `;
          }
      }
      function installTheme(themeName) {
          if (installedThemes.includes(themeName)) {
              showToast('Theme already installed', 'fa-info-circle');
              return;
          }

          installedThemes.push(themeName);
          localStorage.setItem('nautilusOS_installedThemes', JSON.stringify(installedThemes)); 
          showToast('Theme installed! Go to Settings to apply it.', 'fa-check-circle');

          refreshAppStore();
      }

      function uninstallTheme(themeName) {
          const index = installedThemes.indexOf(themeName);
          if (index > -1) {
              installedThemes.splice(index, 1);
              localStorage.setItem('nautilusOS_installedThemes', JSON.stringify(installedThemes)); 
              showToast('Theme uninstalled', 'fa-trash');

              refreshAppStore();
          }
      }

              function refreshAppStore() {
                  const activeSection = document.querySelector('.appstore-section.active');
                  if (!activeSection) return;

                  const sectionText = activeSection.textContent.trim().toLowerCase();
                  if (sectionText.includes('themes')) {
                      switchAppStoreSection('themes', activeSection);
                  } else if (sectionText.includes('apps')) {
                      switchAppStoreSection('apps', activeSection);
                  } else if (sectionText.includes('tools')) {
                      switchAppStoreSection('tools', activeSection);
                  }
              }

              let occupiedGridCells = new Set();

              function handleTaskbarClick(appName) {
                  if (windows[appName]) {
                      const win = windows[appName];
                      if (win.style.display === 'none') {
                          win.style.display = 'block';
                          win.classList.remove('minimized');
                      }
                      focusWindow(win);
                      focusedWindow = appName;
                      updateTaskbarIndicators();
                  } else {
                      openApp(appName);
                  }
              }
      let audioPlayer = null;
      let currentMusicFile = null;

      function loadMusicFile(event) {
          const file = event.target.files[0];
          if (!file) return;

          if (!file.type.startsWith('audio/')) {
              showToast('Please select a valid audio file', 'fa-exclamation-circle');
              return;
          }

          audioPlayer = document.getElementById('audioPlayer');
          if (!audioPlayer) return;

          const url = URL.createObjectURL(file);
          audioPlayer.src = url;
          currentMusicFile = file.name;

          const fileName = file.name.replace(/\.[^/.]+$/, ""); 
          document.getElementById('musicTitle').textContent = fileName;
          document.getElementById('musicArtist').textContent = 'Local File';

          audioPlayer.addEventListener('loadedmetadata', () => {
              document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
          });

          audioPlayer.addEventListener('timeupdate', updateProgress);
          audioPlayer.addEventListener('ended', () => {
              const playBtn = document.getElementById('playPauseBtn');
              playBtn.innerHTML = '<i class="fas fa-play"></i>';
          });

          const volumeSlider = document.getElementById('volumeSlider');
          audioPlayer.volume = volumeSlider.value / 100;

          showToast('Music loaded: ' + fileName, 'fa-music');
      }

      function togglePlayPause() {
          if (!audioPlayer || !audioPlayer.src) {
              showToast('Please load a music file first', 'fa-info-circle');
              return;
          }

          const playBtn = document.getElementById('playPauseBtn');

          if (audioPlayer.paused) {
              audioPlayer.play();
              playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          } else {
              audioPlayer.pause();
              playBtn.innerHTML = '<i class="fas fa-play"></i>';
          }
      }

      function updateProgress() {
          if (!audioPlayer) return;

          const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
          document.getElementById('progressFill').style.width = progress + '%';
          document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
      }

      function seekMusic(event) {
          if (!audioPlayer || !audioPlayer.src) return;

          const progressBar = event.currentTarget;
          const rect = progressBar.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const percentage = x / rect.width;
          const newTime = percentage * audioPlayer.duration;

          audioPlayer.currentTime = newTime;
      }

      function changeVolume(value) {
          if (audioPlayer) {
              audioPlayer.volume = value / 100;
          }
          document.getElementById('volumePercent').textContent = value + '%';
      }

      function skipForward() {
          if (!audioPlayer || !audioPlayer.src) return;
          audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration);
      }

      function skipBackward() {
          if (!audioPlayer || !audioPlayer.src) return;
          audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
      }

      function formatTime(seconds) {
          if (isNaN(seconds)) return '0:00';
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return mins + ':' + (secs < 10 ? '0' : '') + secs;
      }

      function restartMusic() {
          if (!audioPlayer || !audioPlayer.src) {
              showToast('Please load a music file first', 'fa-info-circle');
              return;
          }
          audioPlayer.currentTime = 0;
          if (audioPlayer.paused) {
              audioPlayer.play();
              const playBtn = document.getElementById('playPauseBtn');
              playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          }
      }

      function toggleLoop() {
          if (!audioPlayer || !audioPlayer.src) {
              showToast('Please load a music file first', 'fa-info-circle');
              return;
          }

          const loopBtn = document.getElementById('loopBtn');
          audioPlayer.loop = !audioPlayer.loop;

          if (audioPlayer.loop) {
              loopBtn.classList.add('active');
              showToast('Loop enabled', 'fa-repeat');
          } else {
              loopBtn.classList.remove('active');
              showToast('Loop disabled', 'fa-repeat');
          }
      }
      let browserTabs = [{
          id: 0,
          title: 'New Tab',
          url: '',
          history: [],
          historyIndex: -1
      }];
      let activeBrowserTab = 0;
      let browserTabIdCounter = 1;

      function createBrowserTab() {
          const newTab = {
              id: browserTabIdCounter++,
              title: 'New Tab',
              url: '',
              history: [],
              historyIndex: -1
          };
          browserTabs.push(newTab);

          const tabsContainer = document.getElementById('browserTabs');
          if (!tabsContainer) return;

          const newTabBtn = tabsContainer.querySelector('.browser-new-tab');

          const tabEl = document.createElement('div');
          tabEl.className = 'browser-tab';
          tabEl.dataset.tabId = newTab.id;
          tabEl.innerHTML = `
              <i class="fas fa-globe browser-tab-icon"></i>
              <span class="browser-tab-title">New Tab</span>
              <div class="browser-tab-close">
                  <i class="fas fa-times"></i>
              </div>
          `;

          tabEl.addEventListener('click', (e) => {
              if (!e.target.closest('.browser-tab-close')) {
                  switchBrowserTab(newTab.id);
              }
          });

          const closeBtn = tabEl.querySelector('.browser-tab-close');
          closeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              closeBrowserTab(newTab.id);
          });

          tabsContainer.insertBefore(tabEl, newTabBtn);

          const contentContainer = document.getElementById('browserContent');
          if (!contentContainer) return;

          const viewEl = document.createElement('div');
          viewEl.className = 'browser-view';
          viewEl.dataset.viewId = newTab.id;
          viewEl.innerHTML = `
              <div class="browser-landing">
                  <i class="fas fa-fish browser-landing-logo"></i>
                  <div class="browser-landing-search">
                      <i class="fas fa-search"></i>
                      <input
                          type="text"
                          class="browser-landing-input"
                          placeholder="Search or enter website URL"
                          onkeypress="handleBrowserLandingInput(event)"
                      >
                  </div>
              </div>
          `;

          contentContainer.appendChild(viewEl);
          switchBrowserTab(newTab.id);
      }
      function switchBrowserTab(tabId) {
          activeBrowserTab = tabId;

          document.querySelectorAll('.browser-tab').forEach(tab => {
              tab.classList.remove('active');
              if (parseInt(tab.dataset.tabId) === tabId) {
                  tab.classList.add('active');
              }
          });

          document.querySelectorAll('.browser-view').forEach(view => {
              view.classList.remove('active');
              if (parseInt(view.dataset.viewId) === tabId) {
                  view.classList.add('active');
              }
          });

          const currentTab = browserTabs.find(t => t.id === tabId);
          if (currentTab) {
              const urlInput = document.getElementById('browserUrlInput');
              if (urlInput) urlInput.value = currentTab.url;
              updateBrowserNavButtons();
          }
      }

      function closeBrowserTab(tabId) {
          if (browserTabs.length === 1) {
              showToast('Cannot close the last tab', 'fa-exclamation-circle');
              return;
          }

          const tabIndex = browserTabs.findIndex(t => t.id === tabId);
          if (tabIndex === -1) return;

          browserTabs.splice(tabIndex, 1);

          const tabEl = document.querySelector(`.browser-tab[data-tab-id="${tabId}"]`);
          const viewEl = document.querySelector(`.browser-view[data-view-id="${tabId}"]`);

          if (tabEl) tabEl.remove();
          if (viewEl) viewEl.remove();

          if (activeBrowserTab === tabId) {
              const newActiveTab = browserTabs[Math.max(0, tabIndex - 1)];
              if (newActiveTab) {
                  switchBrowserTab(newActiveTab.id);
              }
          }
      }

      function handleBrowserUrlInput(event) {
          if (event.key === 'Enter') {
              const input = event.target;
              navigateBrowser(input.value);
          }
      }

      function handleBrowserLandingInput(event) {
          if (event.key === 'Enter') {
              const input = event.target;
              navigateBrowser(input.value);
          }
      }

      function navigateBrowser(input) {
          if (!input.trim()) return;

          let url = input.trim();

          if (!url.includes('.') || url.includes(' ')) {
              url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
          } else {
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                  url = 'https://' + url;
              }
          }

          const currentTab = browserTabs.find(t => t.id === activeBrowserTab);
          if (!currentTab) return;

          if (currentTab.historyIndex < currentTab.history.length - 1) {
              currentTab.history = currentTab.history.slice(0, currentTab.historyIndex + 1);
          }
          currentTab.history.push(url);
          currentTab.historyIndex++;
          currentTab.url = url;

          loadBrowserPage(url);
      }

      async function loadBrowserPage(url) {
          const currentTab = browserTabs.find(t => t.id === activeBrowserTab);
          if (!currentTab) return;

          const viewEl = document.querySelector(`.browser-view[data-view-id="${activeBrowserTab}"]`);
          if (!viewEl) return;

          const urlInput = document.getElementById('browserUrlInput');
          if (urlInput) urlInput.value = url;

          const loading = document.getElementById('browserLoading');
          if (loading) loading.classList.add('active');

          try {
              viewEl.innerHTML = '';

              const iframe = document.createElement('iframe');
              iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: #fff;';
              iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox';

              iframe.src = url;

              iframe.onload = () => {
                  try {
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                      const title = iframeDoc.title || new URL(url).hostname;
                      currentTab.title = title;

                      const tabEl = document.querySelector(`.browser-tab[data-tab-id="${activeBrowserTab}"]`);
                      if (tabEl) {
                          const titleEl = tabEl.querySelector('.browser-tab-title');
                          if (titleEl) titleEl.textContent = title;
                      }
                  } catch (err) {
                      const title = new URL(url).hostname;
                      currentTab.title = title;

                      const tabEl = document.querySelector(`.browser-tab[data-tab-id="${activeBrowserTab}"]`);
                      if (tabEl) {
                          const titleEl = tabEl.querySelector('.browser-tab-title');
                          if (titleEl) titleEl.textContent = title;
                      }
                  }
              };

              iframe.onerror = () => {
                  throw new Error('Failed to load page');
              };

              viewEl.appendChild(iframe);
              updateBrowserNavButtons();

          } catch (error) {
              console.error('Browser error:', error);
              viewEl.innerHTML = `
                  <div class="browser-error">
                      <i class="fas fa-exclamation-triangle browser-error-icon"></i>
                      <h2 class="browser-error-title">Unable to Load Page</h2>
                      <p class="browser-error-message">The page could not be loaded. Some websites prevent embedding for security reasons. Try visiting the site directly.</p>
                      <button class="browser-error-btn" onclick="window.open('${url}', '_blank')">Open in New Tab</button>
                  </div>
              `;
          } finally {
              if (loading) loading.classList.remove('active');
          }
      }
      function browserGoBack() {
          const currentTab = browserTabs.find(t => t.id === activeBrowserTab);
          if (!currentTab || currentTab.historyIndex <= 0) return;

          currentTab.historyIndex--;
          const url = currentTab.history[currentTab.historyIndex];
          currentTab.url = url;

          loadBrowserPage(url);
      }
      function browserGoForward() {
          const currentTab = browserTabs.find(t => t.id === activeBrowserTab);
          if (!currentTab || currentTab.historyIndex >= currentTab.history.length - 1) return;

          currentTab.historyIndex++;
          const url = currentTab.history[currentTab.historyIndex];
          currentTab.url = url;

          loadBrowserPage(url);
      }

      function browserReload() {
          const currentTab = browserTabs.find(t => t.id === activeBrowserTab);
          if (!currentTab || !currentTab.url) {
              showToast('No page to reload', 'fa-info-circle');
              return;
          }

          loadBrowserPage(currentTab.url);
      }

      function updateBrowserNavButtons() {
          const currentTab = browserTabs.find(t => t.id === activeBrowserTab);
          if (!currentTab) return;

          const backBtn = document.getElementById('browserBack');
          const forwardBtn = document.getElementById('browserForward');

          if (backBtn) {
              backBtn.disabled = currentTab.historyIndex <= 0;
          }

          if (forwardBtn) {
              forwardBtn.disabled = currentTab.historyIndex >= currentTab.history.length - 1;
          }
      }
      let calcCurrentValue = '0';
      let calcPreviousValue = '';
      let calcOperation = '';
      let calcShouldResetDisplay = false;

      function calcInput(value) {
          const display = document.getElementById('calcDisplay');
          const history = document.getElementById('calcHistory');
          if (!display) return;

          if (calcShouldResetDisplay) {
              calcCurrentValue = '';
              calcShouldResetDisplay = false;
          }

          if (['+', '-', '*', '/', '%'].includes(value)) {
              if (calcCurrentValue === '' || calcCurrentValue === '0') return;

              if (calcPreviousValue !== '' && calcOperation !== '') {
                  calcEquals();
              }

              calcOperation = value;
              calcPreviousValue = calcCurrentValue;
              calcCurrentValue = '';

              if (history) {
                  const opSymbol = value === '*' ? '×' : value === '/' ? '÷' : value;
                  history.textContent = `${calcPreviousValue} ${opSymbol}`;
              }

              display.textContent = '0';
              return;
          }

          if (value === '.' && calcCurrentValue.includes('.')) return;

          if (calcCurrentValue === '0' && value !== '.') {
              calcCurrentValue = value;
          } else {
              calcCurrentValue += value;
          }

          display.textContent = calcCurrentValue;

          if (history && calcOperation && calcPreviousValue) {
              const opSymbol = calcOperation === '*' ? '×' : calcOperation === '/' ? '÷' : calcOperation;
              history.textContent = `${calcPreviousValue} ${opSymbol} ${calcCurrentValue}`;
          }
      }

      function calcEquals() {
          const display = document.getElementById('calcDisplay');
          const history = document.getElementById('calcHistory');
          if (!display) return;

          if (calcPreviousValue === '' || calcOperation === '' || calcCurrentValue === '') return;

          const prev = parseFloat(calcPreviousValue);
          const current = parseFloat(calcCurrentValue);
          let result = 0;

          switch (calcOperation) {
              case '+':
                  result = prev + current;
                  break;
              case '-':
                  result = prev - current;
                  break;
              case '*':
                  result = prev * current;
                  break;
              case '/':
                  if (current === 0) {
                      showToast('Cannot divide by zero', 'fa-exclamation-circle');
                      calcClear();
                      return;
                  }
                  result = prev / current;
                  break;
              case '%':
                  result = prev % current;
                  break;
          }

          result = Math.round(result * 100000000) / 100000000;

          if (history) {
              const opSymbol = calcOperation === '*' ? '×' : calcOperation === '/' ? '÷' : calcOperation;
              history.textContent = `${calcPreviousValue} ${opSymbol} ${calcCurrentValue} =`;
          }

          calcCurrentValue = result.toString();
          display.textContent = calcCurrentValue;

          calcPreviousValue = '';
          calcOperation = '';
          calcShouldResetDisplay = true;
      }

      function calcClear() {
          calcCurrentValue = '0';
          calcPreviousValue = '';
          calcOperation = '';
          calcShouldResetDisplay = false;

          const display = document.getElementById('calcDisplay');
          const history = document.getElementById('calcHistory');

          if (display) display.textContent = '0';
          if (history) history.textContent = '';
      }

      function calcBackspace() {
          const display = document.getElementById('calcDisplay');
          if (!display) return;

          if (calcShouldResetDisplay) {
              calcClear();
              return;
          }

          if (calcCurrentValue.length > 1) {
              calcCurrentValue = calcCurrentValue.slice(0, -1);
          } else {
              calcCurrentValue = '0';
          }

          display.textContent = calcCurrentValue;
      }
      let notificationHistory = [];

      function toggleNotificationCenter() {
          const notif = document.getElementById('notificationCenter');
          const quick = document.getElementById('quickActions');
          const bell = document.getElementById('notificationBell');
          if (quick) quick.classList.remove('active');
          notif.classList.toggle('active');
          bell.classList.toggle('active');
      }

      function addNotificationToHistory(message, icon = 'fa-info-circle') {
          const notification = {
              message: message,
              icon: icon,
              time: new Date(),
              id: Date.now()
          };

          notificationHistory.unshift(notification);

          if (notificationHistory.length > 50) {
              notificationHistory = notificationHistory.slice(0, 50);
          }

          updateNotificationCenter();
      }

      function updateNotificationCenter() {
          const listEl = document.getElementById('notificationList');
          if (!listEl) return;

          if (notificationHistory.length === 0) {
              listEl.innerHTML = `
                  <div class="notification-center-empty">
                      <i class="fas fa-bell-slash"></i>
                      <p>No notifications</p>
                  </div>
              `;
              return;
          }

          listEl.innerHTML = notificationHistory.map(notif => {
              const timeAgo = getTimeAgo(notif.time);
              return `
                  <div class="notification-item" onclick="dismissNotification(${notif.id})">
                      <div class="notification-item-icon">
                          <i class="fas ${notif.icon}"></i>
                      </div>
                      <div class="notification-item-content">
                          <div class="notification-item-title">System</div>
                          <div class="notification-item-message">${notif.message}</div>
                          <div class="notification-item-time">${timeAgo}</div>
                      </div>
                  </div>
              `;
          }).join('');
      }

      function getTimeAgo(date) {
          const seconds = Math.floor((new Date() - date) / 1000);

          if (seconds < 60) return 'Just now';
          if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
          if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
          return Math.floor(seconds / 86400) + 'd ago';
      }

      function dismissNotification(id) {
          notificationHistory = notificationHistory.filter(n => n.id !== id);
          updateNotificationCenter();
      }

      function clearAllNotifications() {
          notificationHistory = [];
          updateNotificationCenter();
          showToast('All notifications cleared', 'fa-trash');
      }

      document.addEventListener('click', (e) => {
          const center = document.getElementById('notificationCenter');
          const bell = document.getElementById('notificationBell');

          if (center && bell && !center.contains(e.target) && !bell.contains(e.target)) {
              center.classList.remove('active');
              bell.classList.remove('active');
          }
      });

      function toggleQuickActions() {
          const menu = document.getElementById('quickActions');
          const notif = document.getElementById('notificationCenter');
          if (notif) notif.classList.remove('active');
          menu.classList.toggle('active');
      }

      function hideQuickActions() {
          const menu = document.getElementById('quickActions');
          menu.classList.remove('active');
      }
      function updatePhotosApp() {
          if (!windows['photos']) return;

          const photos = fileSystem['Photos'] || {};
          const photoList = Object.keys(photos);

          const content = windows['photos'].querySelector('.window-content');
          if (!content) return;

          if (photoList.length === 0) {
              content.innerHTML = `
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 3rem; background: rgba(10, 14, 26, 0.8);">
                      <i class="fas fa-images" style="font-size: 5rem; color: var(--accent); margin-bottom: 2rem;"></i>
                      <h2 style="margin-bottom: 1rem; color: var(--text-primary);">No Photos Yet</h2>
                      <p style="color: var(--text-secondary);">Take a screenshot to get started!</p>
                  </div>
              `;
              return;
          }

          content.innerHTML = `
              <div class="photos-grid" id="photosGrid">
                  ${photoList.map(name => `
                      <div class="photo-item" onclick="viewPhoto('${name}')">
                          <img src="${photos[name]}" alt="${name}" class="photo-thumbnail">
                          <div class="photo-name">${name}</div>
                          <button class="photo-delete-btn" onclick="event.stopPropagation(); deletePhoto('${name}')">
                              <i class="fas fa-trash"></i>
                          </button>
                      </div>
                  `).join('')}
              </div>
          `;
      }
      function viewPhoto(name) {
          const photos = fileSystem['Photos'] || {};
          const url = photos[name];
          if (!url) return;

          const modal = document.createElement('div');
          modal.style.cssText = `
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.9);
              z-index: 10004;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: fadeIn 0.3s ease;
          `;

          modal.innerHTML = `
              <img src="${url}" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px;">
              <button onclick="this.parentElement.remove()" style="
                  position: absolute;
                  top: 2rem;
                  right: 2rem;
                  width: 48px;
                  height: 48px;
                  background: rgba(239, 68, 68, 0.9);
                  border: none;
                  border-radius: 50%;
                  color: #fff;
                  font-size: 1.5rem;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.2s ease;
              " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='rgba(239, 68, 68, 0.9)'">
                  <i class="fas fa-times"></i>
              </button>
          `;

          modal.onclick = (e) => {
              if (e.target === modal) modal.remove();
          };

          document.body.appendChild(modal);
      }

      function deletePhoto(name) {
          const confirmed = confirm(`Delete ${name}?`);
          if (!confirmed) return;

          const photos = fileSystem['Photos'] || {};
          if (photos[name]) {
              URL.revokeObjectURL(photos[name]);
              delete photos[name];
              showToast('Photo deleted', 'fa-trash');
              updatePhotosApp();
          }
      }
      async function takeScreenshot() {
          showToast('Taking screenshot...', 'fa-camera');

          try {
              const stream = await navigator.mediaDevices.getDisplayMedia({
                  video: { mediaSource: 'screen' }
              });

              const video = document.createElement('video');
              video.srcObject = stream;
              video.play();

              await new Promise(resolve => {
                  video.onloadedmetadata = resolve;
              });

              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0);

              stream.getTracks().forEach(track => track.stop());

              canvas.toBlob(blob => {
                  const now = new Date();
                  const month = String(now.getMonth() + 1).padStart(2, '0');
                  const day = String(now.getDate()).padStart(2, '0');
                  const year = now.getFullYear();
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  const seconds = String(now.getSeconds()).padStart(2, '0');

                  const filename = `${month}-${day}-${year} ${hours}-${minutes}-${seconds}.png`;

                  const url = URL.createObjectURL(blob);

                  if (!fileSystem['Photos']) {
                      fileSystem['Photos'] = {};
                  }
                  fileSystem['Photos'][filename] = url;

                  showToast(`Screenshot saved: ${filename}`, 'fa-check-circle');

                  if (!windows['photos']) {
                      openApp('photos');
                  } else {
                      updatePhotosApp();
                  }
              }, 'image/png');

          } catch (error) {
              if (error.name === 'NotAllowedError') {
                  showToast('Screenshot cancelled', 'fa-info-circle');
              } else {
                  showToast('Screenshot failed: ' + error.message, 'fa-exclamation-circle');
              }
          }
      }
      function closeAllWindows() {
          const windowApps = Object.keys(windows);

          if (windowApps.length === 0) {
              showToast('No windows to close', 'fa-info-circle');
              return;
          }

          windowApps.forEach(appName => {
              closeWindowByAppName(appName);
          });

          showToast(`Closed ${windowApps.length} window(s)`, 'fa-check-circle');
      }

      document.addEventListener('click', (e) => {
          const menu = document.getElementById('quickActions');
          if (menu && !menu.contains(e.target) && !e.target.closest('.taskbar-icon')) {
              menu.classList.remove('active');
          }
      });
         function setupStep1Next() {
          const username = document.getElementById('setupUsername').value.trim();

          if (!username) {
              showToast('Please enter a username', 'fa-exclamation-circle');
              return;
          }

          if (username.length < 3) {
              showToast('Username must be at least 3 characters', 'fa-exclamation-circle');
              return;
          }

          document.getElementById('setupStep1').style.display = 'none';
          document.getElementById('setupStep2').style.display = 'block';
      }

      function setupStep2Back() {
          document.getElementById('setupStep2').style.display = 'none';
          document.getElementById('setupStep1').style.display = 'block';
      }

      function toggleSetupPassword() {
          const passwordInput = document.getElementById('setupPassword');
          const toggleIcon = document.getElementById('setupPasswordToggle');

          if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              toggleIcon.classList.remove('fa-eye');
              toggleIcon.classList.add('fa-eye-slash');
          } else {
              passwordInput.type = 'password';
              toggleIcon.classList.remove('fa-eye-slash');
              toggleIcon.classList.add('fa-eye');
          }
      }

  function setupComplete() {
    const username = document.getElementById('setupUsername').value.trim();
    const password = document.getElementById('setupPassword').value;
    
    const appCheckboxes = document.querySelectorAll('#setupAppOptions input[type="checkbox"]:checked');
    const selectedApps = Array.from(appCheckboxes).map(cb => cb.value);
    
    selectedApps.forEach(app => {
        if (!installedApps.includes(app)) {
            installedApps.push(app);
        }
    });
    
    const themeCheckboxes = document.querySelectorAll('#setupThemeOptions input[type="checkbox"]:checked');
    const selectedThemes = Array.from(themeCheckboxes).map(cb => cb.value);

          selectedThemes.forEach(theme => {
              if (!installedThemes.includes(theme)) {
                  installedThemes.push(theme);
              }
          });

          localStorage.setItem('nautilusOS_username', username);
          localStorage.setItem('nautilusOS_password', password);
          localStorage.setItem('nautilusOS_setupComplete', 'true');
          localStorage.setItem('nautilusOS_installedThemes', JSON.stringify(installedThemes));
          saveSettingsToLocalStorage();
          localStorage.setItem('nautilusOS_installedTools', JSON.stringify([]));
      localStorage.setItem('nautilusOS_startupApps', JSON.stringify([]));

          currentUsername = username;

          // easteregg!!
          let welcomeMessage = 'Setup complete! Welcome to NautilusOS';
          let toastIcon = 'fa-check-circle';
          if (username.toLowerCase() === 'dinguschan') {
              welcomeMessage = 'Welcome back, dev! Is it really you?!';
              toastIcon = 'fa-egg';
          }

          const setup = document.getElementById('setup');
          setup.style.opacity = '0';

          setTimeout(() => {
              setup.style.display = 'none';
              const login = document.getElementById('login');
              login.classList.add('active');
              document.getElementById('username').value = username;
              startLoginClock();
              displayBrowserInfo();
              updateLoginGreeting();
              showToast(welcomeMessage, toastIcon);
          }, 500);
      }
      async function forgotPassword() {
          const confirmed = await confirm('This will reset your account and return you to setup. All data will be preserved. Continue?');
          if (!confirmed) return;

          localStorage.removeItem('nautilusOS_username');
          localStorage.removeItem('nautilusOS_password');
          localStorage.removeItem('nautilusOS_setupComplete');

          showToast('Account reset. Reloading...', 'fa-info-circle');

          setTimeout(() => {
              location.reload();
          }, 1500);
      }

      function setupStep2Next() {
    const password = document.getElementById('setupPassword').value;
    const passwordConfirm = document.getElementById('setupPasswordConfirm').value;
    
    if (!password) {
        showToast('Please enter a password', 'fa-exclamation-circle');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'fa-exclamation-circle');
        return;
    }
    
    if (password !== passwordConfirm) {
        showToast('Passwords do not match', 'fa-exclamation-circle');
        return;
    }
    
    document.getElementById('setupStep2').style.display = 'none';
    document.getElementById('setupStep3').style.display = 'block';
}

function setupStep3Back() {
    document.getElementById('setupStep3').style.display = 'none';
    document.getElementById('setupStep2').style.display = 'block';
}

function setupStep3Next() {
    document.getElementById('setupStep3').style.display = 'none';
    document.getElementById('setupStep4').style.display = 'block';
}

function setupStep4Back() {
    document.getElementById('setupStep4').style.display = 'none';
    document.getElementById('setupStep3').style.display = 'block';
}

      function setupStep3Back() {
          document.getElementById('setupStep3').style.display = 'none';
          document.getElementById('setupStep2').style.display = 'block';
      }

      function saveSettingsToLocalStorage() {
          localStorage.setItem('nautilusOS_settings', JSON.stringify(settings));
      }

      function loadSettingsFromLocalStorage() {
          const saved = localStorage.getItem('nautilusOS_settings');
          if (saved) {
              try {
                  const parsed = JSON.parse(saved);
                  settings = { ...settings, ...parsed };
              } catch (e) {
                  console.error('Failed to load settings:', e);
              }
          }
      }

      function loadInstalledThemes() {
          const saved = localStorage.getItem('nautilusOS_installedThemes');
          if (saved) {
              try {
                  installedThemes = JSON.parse(saved);
              } catch (e) {
                  console.error('Failed to load themes:', e);
              }
          }
      }
      window.addEventListener('DOMContentLoaded', () => {
          loadSettingsFromLocalStorage();
          loadInstalledThemes();
          loadInstalledApps();

          if (!settings.showDesktopIcons) {
              const icons = document.getElementById('desktopIcons');
              if (icons) icons.classList.add('hidden');
          }

          installedApps.forEach(appName => {
              addDesktopIcon(appName);
          });
      });
      async function signOutToLogin() {
          const confirmed = await confirm('Are you sure you want to sign out?');
          if (!confirmed) return;

          const startMenu = document.getElementById('startMenu');
          if (startMenu) startMenu.classList.remove('active');

          const windowApps = Object.keys(windows);
          windowApps.forEach(appName => {
              const windowEl = windows[appName];
              if (windowEl) {
                  windowEl.remove();
              }
          });
          windows = {};
          focusedWindow = null;

          const desktop = document.getElementById('desktop');
          const login = document.getElementById('login');

          desktop.style.opacity = '0';

          setTimeout(() => {
       desktop.classList.remove('active');
          desktop.style.opacity = '1';
              const password = document.getElementById('password');
              if (password) password.value = '';

              const username = document.getElementById('username');
              const savedUsername = localStorage.getItem('nautilusOS_username');
              if (username && savedUsername) {
                  username.value = savedUsername;
              }

              login.style.display = 'flex';
              login.style.opacity = '0';

              setTimeout(() => {
                  login.classList.add('active');
                  login.style.opacity = '1';
                  const password = document.getElementById('password');
              if (password) password.value = '';
                  if (password) {
                      setTimeout(() => password.focus(), 100);
                  }

                  showToast('Signed out successfully', 'fa-sign-out-alt');
              }, 50);
          }, 500);
      }
      async function resetAllData() {
          const confirmed = await confirm('<i class="fa-solid fa-triangle-exclamation"></i> WARNING: This will permanently delete ALL your data including:</br></br>• Your account (username & password)</br>• All settings and preferences</br>• All files and folders</br>• Installed themes and apps</br>• Boot preferences</br></br>This action CANNOT be undone! Are you absolutely sure you want to continue?');
          if (!confirmed) return;

          const finalConfirm = await prompt('Type "DELETE" (all caps) to confirm:');
          if (finalConfirm !== 'DELETE') {
              showToast('Reset cancelled', 'fa-info-circle');
              return;
          }

          localStorage.clear();

          showToast('All data has been erased. Reloading...', 'fa-trash-alt');

          setTimeout(() => {
              location.reload();
          }, 2000);
      }
            let modalResolve = null;

      function showModal(options) {
          return new Promise((resolve) => {
              modalResolve = resolve;

              const modal = document.getElementById('customModal');
              const icon = document.getElementById('modalIcon');
              const title = document.getElementById('modalTitle');
              const body = document.getElementById('modalBody');
              const buttons = document.getElementById('modalButtons');
              const inputContainer = document.getElementById('modalInputContainer');

              icon.className = 'modal-icon ' + (options.type || 'info');
              icon.innerHTML = `<i class="fas ${options.icon || 'fa-info-circle'}"></i>`;

              title.textContent = options.title || 'Confirm';
              body.innerHTML = options.message || '';

              inputContainer.innerHTML = '';

              if (options.prompt) {
                  inputContainer.innerHTML = `<input type="text" class="modal-input" id="modalInput" placeholder="${options.placeholder || ''}" value="${options.defaultValue || ''}">`;
                  setTimeout(() => document.getElementById('modalInput').focus(), 100);
              }

              if (options.confirm) {
                  buttons.innerHTML = `
                      <button class="modal-btn modal-btn-secondary" onclick="closeModal(false)">Cancel</button>
                      <button class="modal-btn ${options.danger ? 'modal-btn-danger' : 'modal-btn-primary'}" onclick="confirmModal()">${options.confirmText || 'OK'}</button>
                  `;
              } else {
                  buttons.innerHTML = `
                      <button class="modal-btn modal-btn-primary" onclick="closeModal(true)">OK</button>
                  `;
              }

              modal.classList.add('active');
          });
      }

      function closeModal(result = false) {
          const modal = document.getElementById('customModal');
          modal.classList.remove('active');
          if (modalResolve) {
              modalResolve(result);
              modalResolve = null;
          }
      }

      function confirmModal() {
          const input = document.getElementById('modalInput');
          const result = input ? input.value : true;
          closeModal(result);
      }

      window.alert = async (message) => {
          await showModal({
              type: 'info',
              icon: 'fa-info-circle',
              title: 'Alert',
              message: message,
              confirm: false
          });
      };

      window.confirm = async (message) => {
          return await showModal({
              type: 'warning',
              icon: 'fa-exclamation-triangle',
              title: 'Confirm',
              message: message,
              confirm: true
          });
      };

      window.prompt = async (message, defaultValue = '') => {
          return await showModal({
              type: 'info',
              icon: 'fa-question-circle',
              title: 'Input Required',
              message: message,
              prompt: true,
              defaultValue: defaultValue,
              placeholder: 'Enter value...',
              confirm: true
          });
      };
      let installedApps = [];
      let startupApps = [];

      function loadInstalledApps() {
          const saved = localStorage.getItem('nautilusOS_installedApps');
          if (saved) {
              try {
                  installedApps = JSON.parse(saved);
              } catch (e) {
                  console.error('Failed to load apps:', e);
              }
          }

          const savedStartup = localStorage.getItem('nautilusOS_startupApps');
          if (savedStartup) {
              try {
                  startupApps = JSON.parse(savedStartup);
              } catch (e) {
                  console.error('Failed to load startup apps:', e);
              }
          }
      }

function installApp(appName) {
    if (installedApps.includes(appName)) {
        showToast('App already installed', 'fa-info-circle');
        return;
    }
    
    installedApps.push(appName);
    localStorage.setItem('nautilusOS_installedApps', JSON.stringify(installedApps));
    
    addDesktopIcon(appName);
    
    updateStartMenu();
    
    showToast('App installed! Check your desktop and start menu to launch it.', 'fa-check-circle');
    refreshAppStore();
}

function uninstallApp(appName) {
    const index = installedApps.indexOf(appName);
    if (index > -1) {
        installedApps.splice(index, 1);
        localStorage.setItem('nautilusOS_installedApps', JSON.stringify(installedApps));
        
        removeDesktopIcon(appName);
        
        updateStartMenu();
        
        if (windows[appName]) {
            closeWindowByAppName(appName);
        }
        
        showToast('App uninstalled', 'fa-trash');
        refreshAppStore();
    }
}

      function addDesktopIcon(appName) {
    const iconsContainer = document.getElementById('desktopIcons');
    if (!iconsContainer) {
        return;
    }
    
    if (document.querySelector(`.desktop-icon[data-app="${appName}"]`)) return;
    
    let iconConfig = {};
    if (appName === 'startup-apps') {
        iconConfig = { icon: 'fa-rocket', label: 'Startup Apps' };
    } else if (appName === 'task-manager') {
        iconConfig = { icon: 'fa-tasks', label: 'Task Manager' };
    } else {
        return;
    }
    
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.setAttribute('data-app', appName);
    iconEl.innerHTML = `
        <i class="fas ${iconConfig.icon}"></i>
        <span>${iconConfig.label}</span>
    `;
    iconEl.ondblclick = () => openApp(appName);
    
    iconsContainer.appendChild(iconEl);
    
    initDesktopIconDragging();
}
      function removeDesktopIcon(appName) {
          const icon = document.querySelector(`.desktop-icon[data-app="${appName}"]`);
          if (icon) {
              icon.remove();
          }
      }

      function openStartupApps() {
          const availableApps = [
              { id: 'files', name: 'Files', icon: 'fa-folder' },
              { id: 'terminal', name: 'Terminal', icon: 'fa-terminal' },
              { id: 'browser', name: 'Nautilus Browser', icon: 'fa-globe' },
              { id: 'settings', name: 'Settings', icon: 'fa-cog' },
              { id: 'editor', name: 'Text Editor', icon: 'fa-edit' },
              { id: 'music', name: 'Music', icon: 'fa-music' },
              { id: 'photos', name: 'Photos', icon: 'fa-images' },
              { id: 'help', name: 'Help', icon: 'fa-question-circle' },
              { id: 'appstore', name: 'App Store', icon: 'fa-store' },
              { id: 'calculator', name: 'Calculator', icon: 'fa-calculator' }
          ];

          const itemsHtml = availableApps.map(app => {
              const isEnabled = startupApps.includes(app.id);
              const isWhatsNew = app.id === 'whatsnew';
              const disabled = isWhatsNew ? 'disabled' : '';
              const toggleAction = isWhatsNew ? '' : `onclick="toggleStartupApp('${app.id}')"`;

              return `
                  <div class="startup-item ${disabled}">
                      <div class="startup-item-icon">
                          <i class="fas ${app.icon}"></i>
                      </div>
                      <div class="startup-item-info">
                          <div class="startup-item-name">${app.name}</div>
                          <div class="startup-item-status">${isWhatsNew ? 'Managed in Settings' : (isEnabled ? 'Enabled' : 'Disabled')}</div>
                      </div>
                      <div class="toggle-switch ${isEnabled ? 'active' : ''} ${disabled}" ${toggleAction} style="${isWhatsNew ? 'opacity: 0.5; cursor: not-allowed;' : ''}"></div>
                  </div>
              `;
          }).join('');

          const whatsNewEnabled = localStorage.getItem('nautilusOS_showWhatsNew') !== 'false';
          const whatsNewHtml = `
              <div class="startup-item disabled">
                  <div class="startup-item-icon">
                      <i class="fas fa-star"></i>
                  </div>
                  <div class="startup-item-info">
                      <div class="startup-item-name">What's New</div>
                      <div class="startup-item-status">Managed in Settings</div>
                  </div>
                  <div class="toggle-switch ${whatsNewEnabled ? 'active' : ''}" style="opacity: 0.5; cursor: not-allowed;"></div>
              </div>
          `;

          const content = `
              <div class="startup-manager">
                  <div class="startup-section">
                      <h3><i class="fas fa-rocket"></i>&nbsp;Startup Applications</h3>
                      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                          Select which applications should automatically open when you log in.
                      </p>
                      ${itemsHtml}
                      ${whatsNewHtml}
                  </div>
              </div>
          `;

          createWindow(
              'Startup Apps',
              'fas fa-rocket',
              content,
              600,
              500,
              'startup-apps',
              true
          );
      }

      function toggleStartupApp(appId) {
          const index = startupApps.indexOf(appId);
          if (index > -1) {
              startupApps.splice(index, 1);
          } else {
              startupApps.push(appId);
          }

          localStorage.setItem('nautilusOS_startupApps', JSON.stringify(startupApps));

          if (windows['startup-apps']) {
              const content = windows['startup-apps'].querySelector('.window-content');
              if (content) {
                  const availableApps = [
                      { id: 'files', name: 'Files', icon: 'fa-folder' },
                      { id: 'terminal', name: 'Terminal', icon: 'fa-terminal' },
                      { id: 'browser', name: 'Nautilus Browser', icon: 'fa-globe' },
                      { id: 'settings', name: 'Settings', icon: 'fa-cog' },
                      { id: 'editor', name: 'Text Editor', icon: 'fa-edit' },
                      { id: 'music', name: 'Music', icon: 'fa-music' },
                      { id: 'photos', name: 'Photos', icon: 'fa-images' },
                      { id: 'help', name: 'Help', icon: 'fa-question-circle' },
                      { id: 'appstore', name: 'App Store', icon: 'fa-store' },
                      { id: 'calculator', name: 'Calculator', icon: 'fa-calculator' }
                  ];

                  const itemsHtml = availableApps.map(app => {
                      const isEnabled = startupApps.includes(app.id);
                      return `
                          <div class="startup-item">
                              <div class="startup-item-icon">
                                  <i class="fas ${app.icon}"></i>
                              </div>
                              <div class="startup-item-info">
                                  <div class="startup-item-name">${app.name}</div>
                                  <div class="startup-item-status">${isEnabled ? 'Enabled' : 'Disabled'}</div>
                              </div>
                              <div class="toggle-switch ${isEnabled ? 'active' : ''}" onclick="toggleStartupApp('${app.id}')"></div>
                          </div>
                      `;
                  }).join('');

                  const whatsNewEnabled = localStorage.getItem('nautilusOS_showWhatsNew') !== 'false';
                  const whatsNewHtml = `
                      <div class="startup-item disabled">
                          <div class="startup-item-icon">
                              <i class="fas fa-star"></i>
                          </div>
                          <div class="startup-item-info">
                              <div class="startup-item-name">What's New</div>
                              <div class="startup-item-status">Managed in Settings</div>
                          </div>
                          <div class="toggle-switch ${whatsNewEnabled ? 'active' : ''}" style="opacity: 0.5; cursor: not-allowed;"></div>
                      </div>
                  `;

                  content.innerHTML = `
                      <div class="startup-manager">
                          <div class="startup-section">
                              <h3><i class="fas fa-rocket"></i> Startup Applications</h3>
                              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                                  Select which applications should automatically open when you log in.
                              </p>
                              ${itemsHtml}
                              ${whatsNewHtml}
                          </div>
                      </div>
                  `;
              }
          }
      }

      function openTaskManager() {
          const openWindows = Object.keys(windows);
          const windowCount = openWindows.length;

          const processesHtml = openWindows.map(appName => {
              const win = windows[appName];
              const icon = win.dataset.appIcon || 'fa-window-maximize';
              const title = win.querySelector('.window-title span').textContent;

              return `
                  <div class="taskmanager-process">
                      <div class="taskmanager-process-icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="taskmanager-process-info">
                          <div class="taskmanager-process-name">${title}</div>
                          <div class="taskmanager-process-details">Window • Running</div>
                      </div>
                      <button class="taskmanager-process-action" onclick="closeWindowByAppName('${appName}'); refreshTaskManager();">
                          Close
                      </button>
                  </div>
              `;
          }).join('');

          const content = `
              <div class="taskmanager-content">
                  <div class="taskmanager-stats">
                      <div class="taskmanager-stat-card">
                          <div class="taskmanager-stat-label">Open Windows</div>
                          <div class="taskmanager-stat-value">${windowCount}</div>
                      </div>
                      <div class="taskmanager-stat-card">
                          <div class="taskmanager-stat-label">System Status</div>
                          <div class="taskmanager-stat-value" style="font-size: 1.3rem;">Running</div>
                      </div>
                  </div>

                  <div class="taskmanager-section">
                      <h3><i class="fas fa-window-maximize"></i> Running Applications</h3>
                      ${windowCount === 0 ? '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No applications running</p>' : processesHtml}
                  </div>

                  <div class="taskmanager-section">
                      <h3><i class="fas fa-info-circle"></i> Quick Actions</h3>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                          <button class="editor-btn" onclick="closeAllWindows(); refreshTaskManager();">
                              <i class="fas fa-times-circle"></i> Close All
                          </button>
<button class="editor-btn" onclick="refreshAllApps();">
    <i class="fas fa-sync"></i> Refresh All
</button>
                              <i class="fas fa-sync"></i> Refresh
                          </button>
                      </div>
                  </div>
              </div>
          `;

          createWindow(
              'Task Manager',
              'fas fa-tasks',
              content,
              700,
              550,
              'task-manager',
              true
          );
      }

function refreshTaskManager() {
    if (!windows['task-manager']) return;
    
    const openWindows = Object.keys(windows).filter(w => w !== 'task-manager');
    const windowCount = openWindows.length;
    
    const processesHtml = openWindows.map(appName => {
        const win = windows[appName];
        const icon = win.dataset.appIcon || 'fa-window-maximize';
        const title = win.querySelector('.window-title span').textContent;
        
        return `
            <div class="taskmanager-process">
                <div class="taskmanager-process-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="taskmanager-process-info">
                    <div class="taskmanager-process-name">${title}</div>
                    <div class="taskmanager-process-details">Window • Running</div>
                </div>
                <button class="taskmanager-process-action" onclick="closeWindowByAppName('${appName}'); refreshTaskManager();">
                    Close
                </button>
            </div>
        `;
    }).join('');
    
    const content = windows['task-manager'].querySelector('.window-content');
    if (content) {
        content.innerHTML = `
            <div class="taskmanager-content">
                <div class="taskmanager-stats">
                    <div class="taskmanager-stat-card">
                        <div class="taskmanager-stat-label">Open Windows</div>
                        <div class="taskmanager-stat-value">${windowCount}</div>
                    </div>
                    <div class="taskmanager-stat-card">
                        <div class="taskmanager-stat-label">System Status</div>
                        <div class="taskmanager-stat-value" style="font-size: 1.3rem;">Running</div>
                    </div>
                </div>
                
                <div class="taskmanager-section">
                    <h3><i class="fas fa-window-maximize"></i> Running Applications</h3>
                    ${windowCount === 0 ? '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No applications running</p>' : processesHtml}
                </div>
                
                <div class="taskmanager-section">
                    <h3><i class="fas fa-info-circle"></i> Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <button class="editor-btn" onclick="closeAllWindows(); refreshTaskManager();">
                            <i class="fas fa-times-circle"></i> Close All
                        </button>
                        <button class="editor-btn" onclick="refreshAllApps();">
                            <i class="fas fa-sync"></i> Refresh All
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
      function refreshAllApps() {
    const openWindows = Object.keys(windows).filter(w => w !== 'task-manager');
    
    if (openWindows.length === 0) {
        showToast('No applications to refresh', 'fa-info-circle');
        refreshTaskManager();
        return;
    }
    
    const appsToReopen = [...openWindows];
    
    showToast('Refreshing all applications...', 'fa-sync');
    
    appsToReopen.forEach(appName => {
        const windowEl = windows[appName];
        if (windowEl) {
            windowEl.remove();
            delete windows[appName];
        }
    });
    
    focusedWindow = null;
    updateTaskbarIndicators();
    refreshTaskManager();
    
    setTimeout(() => {
        appsToReopen.forEach((appName, index) => {
            setTimeout(() => {
                openApp(appName);
            }, index * 200); 
        });
        
        setTimeout(() => {
            showToast(`Refreshed ${appsToReopen.length} application(s)`, 'fa-check-circle');
            refreshTaskManager();
        }, appsToReopen.length * 200 + 500);
    }, 500);
}
      function launchStartupApps() {
          setTimeout(() => {
              startupApps.forEach(appId => {
                  openApp(appId);
              });
          }, 1000);
      }
      const _originalOpenApp = openApp;
      window.openApp = openApp = function(appName, ...args) {
          if (appName === 'startup-apps') {
              openStartupApps();
          } else if (appName === 'task-manager') {
              openTaskManager();
          } else {
              _originalOpenApp(appName, ...args);
          }

          setTimeout(() => {
              if (windows['task-manager']) {
                  refreshTaskManager();
              }
          }, 100);
      };

      const _originalCloseWindow = closeWindow;
      window.closeWindow = closeWindow = function(btn, appName) {
          _originalCloseWindow(btn, appName);

          setTimeout(() => {
              if (windows['task-manager']) {
                  refreshTaskManager();
              }
          }, 150);
      };
function updateStartMenu() {
    const container = document.getElementById('installedAppsInStartMenu');
    if (!container) return;
    
    container.innerHTML = '';
    
    installedApps.forEach(appName => {
        let appConfig = {};
        if (appName === 'startup-apps') {
            appConfig = { icon: 'fa-rocket', label: 'Startup Apps' };
        } else if (appName === 'task-manager') {
            appConfig = { icon: 'fa-tasks', label: 'Task Manager' };
        } else {
            return;
        }
        
        const appItem = document.createElement('div');
        appItem.className = 'app-item';
        appItem.onclick = () => openApp(appName);
        appItem.innerHTML = `
            <i class="fas ${appConfig.icon}"></i>
            <span>${appConfig.label}</span>
        `;
        
        container.appendChild(appItem);
    });
}

function exportProfile() {
    const profile = {
        version: '1.0',
        username: localStorage.getItem('nautilusOS_username'),
        password: localStorage.getItem('nautilusOS_password'),
        settings: settings,
        installedThemes: installedThemes,
        installedApps: installedApps,
        startupApps: startupApps,
        fileSystem: fileSystem,
        showWhatsNew: localStorage.getItem('nautilusOS_showWhatsNew'),
        exportDate: new Date().toISOString()
    };
    
    const profileJson = JSON.stringify(profile, null, 2);
    const blob = new Blob([profileJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const username = currentUsername || 'user';
    const date = new Date().toISOString().split('T')[0];
    const filename = `NautilusOS_${username}_${date}.nautilusprofile`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Profile exported successfully!', 'fa-check-circle');
}
      function importProfile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.nautilusprofile')) {
        showToast('Invalid file format. Please select a .nautilusprofile file.', 'fa-exclamation-circle');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const profile = JSON.parse(e.target.result);
            
            if (!profile.version || !profile.username || !profile.password) {
                throw new Error('Invalid profile format');
            }
            
            const confirmed = await confirm(
                `Import profile for user "${profile.username}"?<br><br>` +
                `This will replace your current settings and data.<br><br>` +
                `<strong>Profile Details:</strong><br>` +
                `• Username: ${profile.username}<br>` +
                `• Exported: ${new Date(profile.exportDate).toLocaleDateString()}<br>` +
                `• Installed Apps: ${(profile.installedApps || []).length}<br>` +
                `• Installed Themes: ${(profile.installedThemes || []).length}`
            );
            
            if (!confirmed) {
                showToast('Profile import cancelled', 'fa-info-circle');
                return;
            }
            
            // Import profile data
            localStorage.setItem('nautilusOS_username', profile.username);
            localStorage.setItem('nautilusOS_password', profile.password);
            localStorage.setItem('nautilusOS_setupComplete', 'true');
            localStorage.setItem('nautilusOS_settings', JSON.stringify(profile.settings || settings));
            localStorage.setItem('nautilusOS_installedThemes', JSON.stringify(profile.installedThemes || []));
            localStorage.setItem('nautilusOS_installedApps', JSON.stringify(profile.installedApps || []));
            localStorage.setItem('nautilusOS_startupApps', JSON.stringify(profile.startupApps || []));
            
            if (profile.showWhatsNew !== null && profile.showWhatsNew !== undefined) {
                localStorage.setItem('nautilusOS_showWhatsNew', profile.showWhatsNew);
            }
            
            if (profile.fileSystem) {
                const cleanedFileSystem = { ...profile.fileSystem };
                if (cleanedFileSystem.Photos) {
                    cleanedFileSystem.Photos = {};
                }
                fileSystem = cleanedFileSystem;
            }
            
            showToast('Profile imported successfully! Redirecting to login...', 'fa-check-circle');
            
            setTimeout(() => {
                const setup = document.getElementById('setup');
                setup.style.opacity = '0';
                
                setTimeout(() => {
                    setup.style.display = 'none';
                    const login = document.getElementById('login');
                    login.classList.add('active');
                    document.getElementById('username').value = profile.username;
                    startLoginClock();
                    displayBrowserInfo();
                    updateLoginGreeting();
                }, 500);
            }, 1500);
            
        } catch (error) {
            console.error('Import error:', error);
            showToast('Failed to import profile. File may be corrupted or invalid.', 'fa-exclamation-circle');
        }
    };
    
    reader.onerror = function() {
        showToast('Failed to read profile file.', 'fa-exclamation-circle');
    };
    
    reader.readAsText(file);
}
let cloakingConfig = {
    autoRotate: false,
    rotateSpeed: 10,
    rotationList: [
        { title: 'Google', url: 'https://www.google.com' },
        { title: 'Gmail', url: 'https://mail.google.com' },
        { title: 'Google Drive', url: 'https://drive.google.com' }
    ],
    currentRotationIndex: 0
};
let rotationInterval = null;
const originalTitle = document.title;
const originalFavicon = document.querySelector('link[rel="icon"]')?.href || '';

function loadCloakingConfig() {
    const saved = localStorage.getItem('nautilusOS_cloaking');
    if (saved) {
        try {
            cloakingConfig = { ...cloakingConfig, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Failed to load cloaking config:', e);
        }
    }
}

function saveCloakingConfig() {
    localStorage.setItem('nautilusOS_cloaking', JSON.stringify(cloakingConfig));
}

function applyCloaking() {
    const title = document.getElementById('cloakTitle').value.trim();
    const faviconUrl = document.getElementById('cloakFavicon').value.trim();
    
    if (!title && !faviconUrl) {
        showToast('Please enter a title or favicon URL', 'fa-exclamation-circle');
        return;
    }
    
    if (title) {
        document.title = title;
    }
    
    if (faviconUrl) {
        setFavicon(faviconUrl);
    }
    
    showToast('Cloaking applied!', 'fa-check-circle');
}

function setFavicon(url) {
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    let faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/x-icon';
    
    let domain = url;
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        domain = urlObj.origin;
    } catch (e) {
        domain = 'https://' + url.replace(/^https?:\/\//, '');
    }
    
    faviconLink.href = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    document.head.appendChild(faviconLink);
    
    faviconLink.onerror = () => {
        faviconLink.href = `https://icons.duckduckgo.com/ip3/${domain.replace(/^https?:\/\//, '')}.ico`;
    };
}

function resetCloaking() {
    document.title = originalTitle;
    
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    if (originalFavicon) {
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = originalFavicon;
        document.head.appendChild(faviconLink);
    }
    
    const titleInput = document.getElementById('cloakTitle');
    const faviconInput = document.getElementById('cloakFavicon');
    if (titleInput) titleInput.value = originalTitle;
    if (faviconInput) faviconInput.value = '';
    
    showToast('Cloaking reset to default', 'fa-undo');
}

function toggleAutoRotate() {
    cloakingConfig.autoRotate = !cloakingConfig.autoRotate;
    const toggle = document.getElementById('autoRotateToggle');
    const settings = document.getElementById('rotateSettings');
    
    if (cloakingConfig.autoRotate) {
        toggle.classList.add('active');
        if (settings) settings.style.display = 'block';
        startRotation();
        showToast('Auto-rotate enabled', 'fa-sync-alt');
    } else {
        toggle.classList.remove('active');
        if (settings) settings.style.display = 'none';
        stopRotation();
        showToast('Auto-rotate disabled', 'fa-sync-alt');
    }
    
    saveCloakingConfig();
}

function startRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
    }
    
    if (cloakingConfig.rotationList.length === 0) {
        showToast('Add websites to rotation list first', 'fa-exclamation-circle');
        return;
    }
    
    rotateCloaking();
    
    rotationInterval = setInterval(() => {
        rotateCloaking();
    }, cloakingConfig.rotateSpeed * 1000);
}

function stopRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

function rotateCloaking() {
    if (cloakingConfig.rotationList.length === 0) return;
    
    const site = cloakingConfig.rotationList[cloakingConfig.currentRotationIndex];
    document.title = site.title;
    setFavicon(site.url);
    
    cloakingConfig.currentRotationIndex = 
        (cloakingConfig.currentRotationIndex + 1) % cloakingConfig.rotationList.length;
}

function renderRotationList() {
    const container = document.getElementById('rotationList');
    if (!container) return;
    
    if (cloakingConfig.rotationList.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No websites added yet</p>';
        return;
    }
    
    container.innerHTML = cloakingConfig.rotationList.map((site, index) => `
        <div class="startup-item" style="margin-bottom: 0.5rem;">
            <div class="startup-item-icon">
                <i class="fas fa-globe"></i>
            </div>
            <div class="startup-item-info">
                <div class="startup-item-name">${site.title}</div>
                <div class="startup-item-status">${site.url}</div>
            </div>
            <button class="file-action-btn delete" onclick="removeRotationSite(${index})" style="padding: 0.5rem 0.75rem;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

async function addRotationSite() {
    const title = await prompt('Enter website title (e.g., Google):');
    if (!title) return;
    
    const url = await prompt('Enter website URL (e.g., https://www.google.com):');
    if (!url) return;
    
    cloakingConfig.rotationList.push({ title, url });
    renderRotationList();
    showToast('Website added to rotation', 'fa-plus');
}

function removeRotationSite(index) {
    cloakingConfig.rotationList.splice(index, 1);
    renderRotationList();
    showToast('Website removed from rotation', 'fa-trash');
}

function saveRotationSettings() {
    const speedInput = document.getElementById('rotateSpeed');
    if (speedInput) {
        const speed = parseInt(speedInput.value);
        if (speed >= 1 && speed <= 300) {
            cloakingConfig.rotateSpeed = speed;
        }
    }
    
    saveCloakingConfig();
    
    if (cloakingConfig.autoRotate) {
        stopRotation();
        startRotation();
    }
    
    showToast('Rotation settings saved!', 'fa-save');
}

window.addEventListener('DOMContentLoaded', () => {
    loadCloakingConfig();
    
    if (cloakingConfig.autoRotate) {
        setTimeout(() => {
            startRotation();
        }, 2000);
    }
});

const _originalOpenAppForCloaking = openApp;
window.openApp = openApp = function(appName, ...args) {
    _originalOpenAppForCloaking(appName, ...args);
    
    if (appName === 'cloaking') {
        setTimeout(() => {
            const toggle = document.getElementById('autoRotateToggle');
            const settings = document.getElementById('rotateSettings');
            
            if (toggle && cloakingConfig.autoRotate) {
                toggle.classList.add('active');
                if (settings) settings.style.display = 'block';
            }
            
            const speedInput = document.getElementById('rotateSpeed');
            if (speedInput) {
                speedInput.value = cloakingConfig.rotateSpeed;
            }
            
            renderRotationList();
        }, 100);
    }
};
function showProperties(appName, x, y) {
    const tooltip = document.getElementById('propertiesTooltip');
    const metadata = appMetadata[appName];
    
    if (!metadata) {
        showToast('App information not available', 'fa-info-circle');
        return;
    }
    
    const iconEl = document.getElementById('propIcon');
    iconEl.innerHTML = `<i class="fas ${metadata.icon}"></i>`;
    
    const nameEl = document.getElementById('propName');
    nameEl.textContent = metadata.name;
    
    const statusEl = document.getElementById('propStatus');
    if (metadata.preinstalled) {
        statusEl.textContent = 'Preinstalled';
        statusEl.className = 'properties-badge preinstalled';
    } else {
        statusEl.textContent = 'Installed from App Store';
        statusEl.className = 'properties-badge installed';
    }
    
    const typeEl = document.getElementById('propType');
    typeEl.textContent = metadata.preinstalled ? 'System Application' : 'Third-party Application';
    
    tooltip.style.left = x + 15 + 'px';
    tooltip.style.top = y + 'px';
    tooltip.classList.add('active');
    
    setTimeout(() => {
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = (x - rect.width - 15) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            tooltip.style.top = (y - rect.height) + 'px';
        }
        if (rect.top < 0) {
            tooltip.style.top = '10px';
        }
        if (rect.left < 0) {
            tooltip.style.left = '10px';
        }
    }, 0);
}

function hideProperties() {
    const tooltip = document.getElementById('propertiesTooltip');
    tooltip.classList.remove('active');
}

document.addEventListener('click', (e) => {
    const tooltip = document.getElementById('propertiesTooltip');
    if (tooltip && !tooltip.contains(e.target) && !e.target.closest('.context-menu')) {
        hideProperties();
    }
});

document.addEventListener('contextmenu', () => {
    hideProperties();
});
