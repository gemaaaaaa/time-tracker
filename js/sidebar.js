import { icons } from './icons.js';

export class Sidebar {
  constructor() {
    this.isExpanded = true;
    this.sidebarEl = null;
    this.contentAreaEl = null;
    this.toggleBtnEl = null;
    this.toggleIconEl = null;
    this.mobileNavEl = null;
    
    this.menuItems = [
      { id: 'timer', icon: icons.timer, text: 'Timer' },
      { id: 'reports', icon: icons.reports, text: 'Reports' },
      { id: 'journals', icon: icons.journals, text: 'Journals' },
      { id: 'settings', icon: icons.settings, text: 'Settings', isBottom: true }
    ];
    
    this.init();
  }
  
  init() {
    this.createSidebar();
    this.createMobileNav();
    this.addEventListeners();
    this.setInitialState();
  }
  
  createSidebar() {
    this.sidebarEl = document.createElement('aside');
    this.sidebarEl.className = 'sidebar sidebar-expanded fixed top-0 left-0 h-full bg-sidebar-bg text-sidebar-text z-10 shadow-lg hidden md:flex flex-col';
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
    nav.className = 'mt-6 flex-1 flex flex-col';
    nav.setAttribute('aria-label', 'Main navigation');
    
    const menuList = document.createElement('ul');
    menuList.className = 'space-y-2';
    
    const mainMenuItems = this.menuItems.filter(item => !item.isBottom);
    const bottomMenuItems = this.menuItems.filter(item => item.isBottom);
    
    mainMenuItems.forEach(item => {
      menuList.appendChild(this.createMenuItem(item));
    });
    
    nav.appendChild(menuList);
    
    if (bottomMenuItems.length > 0) {
      const bottomMenuList = document.createElement('ul');
      bottomMenuList.className = 'space-y-2 mt-auto mb-4';
      
      bottomMenuItems.forEach(item => {
        bottomMenuList.appendChild(this.createMenuItem(item));
      });
      
      nav.appendChild(bottomMenuList);
    }
    
    this.sidebarEl.appendChild(nav);
    
    const profileSection = document.createElement('div');
    profileSection.className = 'profile-section';
    
    const profileContent = document.createElement('div');
    profileContent.className = 'profile-content';
    
    const profilePicture = document.createElement('div');
    profilePicture.className = 'profile-picture';
    profilePicture.innerHTML = '<span class="text-lg">U</span>';
    
    const profileInfo = document.createElement('div');
    profileInfo.className = 'profile-info';
    
    const username = document.createElement('div');
    username.className = 'font-medium text-gray-800';
    username.textContent = 'User Name';
    
    const email = document.createElement('div');
    email.className = 'text-sm text-gray-500';
    email.textContent = 'user@example.com';
    
    profileInfo.appendChild(username);
    profileInfo.appendChild(email);
    profileContent.appendChild(profilePicture);
    profileContent.appendChild(profileInfo);
    profileSection.appendChild(profileContent);
    
    this.sidebarEl.appendChild(profileSection);
    
    this.contentAreaEl = document.createElement('main');
    this.contentAreaEl.className = 'content-area content-area-expanded min-h-screen p-8 bg-primary-bg pb-24 md:pb-8';
    
    const content = document.createElement('div');
    content.className = 'w-full flex justify-center';
    content.innerHTML = `
      <div class="w-full max-w-4xl">
        <div class="bg-secondary-bg rounded-lg shadow-md p-4 md:p-8 text-center">
          <div class="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8">
            <button id="modeToggleBtn" class="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:bg-accent transition-all duration-300">
              ${icons.chevronLeft}
            </button>
            <div class="text-4xl md:text-6xl font-bold text-gray-800" id="timer">00:00:00</div>
          </div>
          <div id="buttonsContainer" class="flex justify-center gap-2 md:gap-4">
            <button id="startBtn" class="px-4 md:px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-gray-800 transition-colors text-sm md:text-base">
              Start
            </button>
            <button id="resetBtn" class="px-4 md:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base">
              Reset
            </button>
          </div>
          
          <div id="pomodoroStats" class="mt-6 md:mt-8 grid grid-cols-3 gap-2 md:gap-4 hidden">
            <div class="bg-accent/30 p-2 md:p-4 rounded-lg">
              <h3 class="font-medium text-gray-800 text-sm md:text-base">Focus Time</h3>
              <p class="text-xl md:text-2xl font-bold text-gray-800">25:00</p>
            </div>
            <div class="bg-accent/30 p-2 md:p-4 rounded-lg">
              <h3 class="font-medium text-gray-800 text-sm md:text-base">Break Time</h3>
              <p class="text-xl md:text-2xl font-bold text-gray-800">5:00</p>
            </div>
            <div class="bg-accent/30 p-2 md:p-4 rounded-lg">
              <h3 class="font-medium text-gray-800 text-sm md:text-base">Sessions</h3>
              <p class="text-xl md:text-2xl font-bold text-gray-800" id="sessions">0</p>
            </div>
          </div>
          
          <hr class="my-6 md:my-8 border-gray-300" />
          
          <div class="projects-section">
            <div class="flex justify-between items-center mb-4 md:mb-6">
              <h2 class="text-xl md:text-2xl font-bold">Projects</h2>
              <button id="addProjectBtn" class="px-3 md:px-4 py-1.5 md:py-2 bg-primary text-white rounded-lg hover:bg-accent hover:text-gray-800 transition-colors text-sm md:text-base">
                Add Project
              </button>
            </div>
            
            <div id="projectsList" class="space-y-3 md:space-y-4">
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

  createMenuItem(item) {
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
    
    return menuItem;
  }

  createMobileNav() {
    this.mobileNavEl = document.createElement('nav');
    this.mobileNavEl.className = 'fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-50 md:hidden';
    this.mobileNavEl.setAttribute('aria-label', 'Mobile navigation');

    const menuList = document.createElement('ul');
    menuList.className = 'flex justify-around items-center h-16';

    this.menuItems.forEach(item => {
      const menuItem = document.createElement('li');
      
      const menuLink = document.createElement('a');
      menuLink.href = '#' + item.id;
      menuLink.className = 'flex flex-col items-center p-2 text-gray-600 hover:text-primary transition-colors';
      if (item.id === 'timer') {
        menuLink.classList.add('text-primary');
      }
      
      const menuIcon = document.createElement('span');
      menuIcon.className = 'w-6 h-6';
      menuIcon.innerHTML = item.icon;
      
      const menuText = document.createElement('span');
      menuText.className = 'text-xs mt-1';
      menuText.textContent = item.text;
      
      menuLink.appendChild(menuIcon);
      menuLink.appendChild(menuText);
      menuItem.appendChild(menuLink);
      menuList.appendChild(menuItem);
    });

    this.mobileNavEl.appendChild(menuList);
    document.body.appendChild(this.mobileNavEl);
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
    
    const mobileMenuLinks = this.mobileNavEl.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenuLinks.forEach(item => item.classList.remove('text-primary'));
        link.classList.add('text-primary');
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