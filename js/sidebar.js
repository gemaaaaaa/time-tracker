import { icons } from './icons.js';

export class Sidebar {
  constructor() {
    this.isExpanded = true;
    this.sidebarEl = null;
    this.contentAreaEl = null;
    this.toggleBtnEl = null;
    this.toggleIconEl = null;
    this.menuItems = [
      { id: 'timer', icon: icons.timer, text: 'Timer' },
      { id: 'stats', icon: icons.stats, text: 'Statistics' },
      { id: 'settings', icon: icons.settings, text: 'Settings' }
    ];
    
    this.init();
  }
  
  init() {
    this.createSidebar();
    this.addEventListeners();
    this.setInitialState();
  }
  
  createSidebar() {
    this.sidebarEl = document.createElement('aside');
    this.sidebarEl.className = 'sidebar sidebar-expanded fixed top-0 left-0 h-full bg-sidebar-bg text-sidebar-text z-10 shadow-lg';
    this.sidebarEl.setAttribute('aria-label', 'Main sidebar navigation');
    
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between h-16 px-4 border-b border-sidebar-border';
    
    const logo = document.createElement('div');
    logo.className = 'flex items-center';
    
    const logoText = document.createElement('h1');
    logoText.className = 'text-xl font-bold menu-item-text ml-2 text-primary';
    logoText.textContent = 'Pomodoro';
    
    logo.appendChild(logoText);
    header.appendChild(logo);
    this.sidebarEl.appendChild(header);
    
    this.toggleBtnEl = document.createElement('button');
    this.toggleBtnEl.className = 'toggle-btn';
    this.toggleBtnEl.setAttribute('aria-label', 'Toggle sidebar');
    
    this.toggleIconEl = document.createElement('span');
    this.toggleIconEl.className = 'toggle-icon';
    this.toggleIconEl.innerHTML = icons.chevronLeft;
    
    this.toggleBtnEl.appendChild(this.toggleIconEl);
    this.sidebarEl.appendChild(this.toggleBtnEl);
    
    const nav = document.createElement('nav');
    nav.className = 'mt-6';
    nav.setAttribute('aria-label', 'Main navigation');
    
    const menuList = document.createElement('ul');
    menuList.className = 'space-y-2';
    
    this.menuItems.forEach(item => {
      const menuItem = document.createElement('li');
      
      const menuLink = document.createElement('a');
      menuLink.href = '#' + item.id;
      menuLink.className = 'menu-item';
      menuLink.setAttribute('aria-label', item.text);
      
      const menuIcon = document.createElement('span');
      menuIcon.className = 'menu-icon';
      menuIcon.innerHTML = item.icon;
      
      const menuText = document.createElement('span');
      menuText.className = 'menu-item-text';
      menuText.textContent = item.text;
      
      if (item.id === 'timer') {
        menuLink.classList.add('active');
      }
      
      menuLink.appendChild(menuIcon);
      menuLink.appendChild(menuText);
      menuItem.appendChild(menuLink);
      menuList.appendChild(menuItem);
    });
    
    nav.appendChild(menuList);
    this.sidebarEl.appendChild(nav);
    
    this.contentAreaEl = document.createElement('main');
    this.contentAreaEl.className = 'content-area content-area-expanded min-h-screen p-8 bg-primary-bg';
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="max-w-4xl mx-auto">
        <div class="bg-secondary-bg rounded-lg shadow-md p-8 text-center">
          <div class="flex items-center justify-center gap-4 mb-8">
            <button id="modeToggleBtn" class="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:bg-accent transition-all duration-300">
              ${icons.chevronLeft}
            </button>
            <div class="text-6xl font-bold text-gray-800" id="timer">00:00:00</div>
          </div>
          <div class="flex justify-center gap-4">
            <button id="startBtn" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-gray-800 transition-colors">
              Start
            </button>
            <button id="resetBtn" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Reset
            </button>
          </div>
          <div id="pomodoroStats" class="mt-8 grid grid-cols-3 gap-4 hidden">
            <div class="bg-accent/30 p-4 rounded-lg">
              <h3 class="font-medium text-gray-800">Focus Time</h3>
              <p class="text-2xl font-bold text-gray-800">25:00</p>
            </div>
            <div class="bg-accent/30 p-4 rounded-lg">
              <h3 class="font-medium text-gray-800">Break Time</h3>
              <p class="text-2xl font-bold text-gray-800">5:00</p>
            </div>
            <div class="bg-accent/30 p-4 rounded-lg">
              <h3 class="font-medium text-gray-800">Sessions</h3>
              <p class="text-2xl font-bold text-gray-800" id="sessions">0</p>
            </div>
          </div>
          
          <hr class="my-8 border-gray-300" />
          
          <div class="projects-section">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-left">Projects</h2>
              <button id="addProjectBtn" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-gray-800 transition-colors">
                Add Project
              </button>
            </div>
            
            <div id="projectsList" class="space-y-4">
              <!-- Project items will be added here dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.contentAreaEl.appendChild(content);
    
    document.body.appendChild(this.sidebarEl);
    document.body.appendChild(this.contentAreaEl);
  }
  
  addEventListeners() {
    this.toggleBtnEl.addEventListener('click', () => {
      this.toggleSidebar();
    });
    
    const menuLinks = this.sidebarEl.querySelectorAll('.menu-item');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        menuLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      });
    });
    
    this.sidebarEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isExpanded) {
        this.toggleSidebar();
      }
    });
    
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    
    if (this.isExpanded) {
      this.sidebarEl.classList.remove('sidebar-collapsed');
      this.sidebarEl.classList.add('sidebar-expanded');
      this.contentAreaEl.classList.remove('content-area-collapsed');
      this.contentAreaEl.classList.add('content-area-expanded');
      this.toggleIconEl.classList.remove('toggle-icon-collapsed');
    } else {
      this.sidebarEl.classList.remove('sidebar-expanded');
      this.sidebarEl.classList.add('sidebar-collapsed');
      this.contentAreaEl.classList.remove('content-area-expanded');
      this.contentAreaEl.classList.add('content-area-collapsed');
      this.toggleIconEl.classList.add('toggle-icon-collapsed');
    }
    
    this.sidebarEl.setAttribute('aria-expanded', this.isExpanded);
  }
  
  handleResize() {
    if (window.innerWidth < 768 && this.isExpanded) {
      this.toggleSidebar();
    }
  }
  
  setInitialState() {
    if (window.innerWidth < 768 && this.isExpanded) {
      this.toggleSidebar();
    }
    this.sidebarEl.setAttribute('aria-expanded', this.isExpanded);
  }
}