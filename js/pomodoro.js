export class Pomodoro {
  constructor() {
    this.timeLeft = 0;
    this.isRunning = false;
    this.timer = null;
    this.sessions = 0;
    this.mode = 'tracker'; // Default mode is time tracker
    this.projects = [];
    this.activeProjectId = null;
    
    this.timerDisplay = document.getElementById('timer');
    this.startBtn = document.getElementById('startBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.sessionsDisplay = document.getElementById('sessions');
    this.modeToggleBtn = document.getElementById('modeToggleBtn');
    this.pomodoroStats = document.getElementById('pomodoroStats');
    this.projectsList = document.getElementById('projectsList');
    this.addProjectBtn = document.getElementById('addProjectBtn');
    this.buttonsContainer = document.getElementById('buttonsContainer');
    
    this.init();
  }
  
  init() {
    this.modeToggleBtn.addEventListener('click', () => this.toggleMode());
    this.addProjectBtn.addEventListener('click', () => this.addNewProject());
    this.updateDisplay();
    this.updateButtonsVisibility();
  }
  
  addNewProject() {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      const project = {
        id: Date.now(),
        name: projectName,
        timeSpent: 0,
        isRunning: false
      };
      this.projects.push(project);
      this.saveProjects();
      this.renderProjects();
    }
  }
  
  saveProjects() {
    localStorage.setItem('pomodoro-projects', JSON.stringify(this.projects));
  }
  
  loadProjects() {
    const savedProjects = localStorage.getItem('pomodoro-projects');
    if (savedProjects) {
      this.projects = JSON.parse(savedProjects);
      this.renderProjects();
    }
  }
  
  renderProjects() {
    this.projectsList.innerHTML = '';
    
    this.projects.forEach(project => {
      const projectEl = document.createElement('div');
      projectEl.className = 'project-item mb-4 flex items-center gap-4 bg-white rounded-lg shadow p-4';
      
      const playButton = `
        <button class="play-btn w-8 h-8 flex items-center justify-center rounded-full ${project.isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-accent hover:text-gray-800'} text-white transition-colors" data-project-id="${project.id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            ${project.isRunning ? 
              '<rect x="6" y="6" width="8" height="8" />' :
              '<path d="M8 5v10l6-5z" />'
            }
          </svg>
        </button>
        <h3 class="text-lg font-semibold">${project.name}</h3>
        <div class="text-2xl font-bold text-primary ml-auto">${this.formatTime(project.timeSpent)}</div>
      `;
      
      projectEl.innerHTML = playButton;
      
      this.projectsList.appendChild(projectEl);
      
      // Add click handler for the play button
      const playBtn = projectEl.querySelector('.play-btn');
      playBtn.addEventListener('click', () => this.toggleProjectTimer(project.id));
    });
  }
  
  toggleProjectTimer(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Stop other running projects
    if (!project.isRunning) {
      this.projects.forEach(p => {
        if (p.id !== projectId && p.isRunning) {
          p.isRunning = false;
        }
      });
    }
    
    project.isRunning = !project.isRunning;
    this.activeProjectId = project.isRunning ? projectId : null;
    
    if (project.isRunning) {
      this.startTimer();
    } else if (!this.projects.some(p => p.isRunning)) {
      this.pauseTimer();
    }
    
    this.saveProjects();
    this.renderProjects();
  }
  
  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.mode === 'tracker') {
          this.timeLeft++;
          
          // Update active project time
          if (this.activeProjectId) {
            const activeProject = this.projects.find(p => p.id === this.activeProjectId);
            if (activeProject) {
              activeProject.timeSpent++;
              this.saveProjects();
              this.renderProjects();
            }
          }
        } else {
          this.timeLeft--;
          if (this.timeLeft === 0) {
            this.completeSession();
          }
        }
        
        this.updateDisplay();
      }, 1000);
    }
  }
  
  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timer);
  }
  
  toggleMode() {
    this.pauseTimer();
    this.mode = this.mode === 'tracker' ? 'pomodoro' : 'tracker';
    this.pomodoroStats.classList.toggle('hidden', this.mode === 'tracker');
    this.updateButtonsVisibility();
    this.resetTimer();
  }
  
  updateButtonsVisibility() {
    this.buttonsContainer.classList.add('hidden');
  }
  
  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.mode === 'pomodoro' ? 25 * 60 : 0;
    this.updateDisplay();
  }
  
  completeSession() {
    this.pauseTimer();
    this.sessions++;
    this.sessionsDisplay.textContent = this.sessions;
    this.resetTimer();
    this.playNotification();
  }
  
  updateDisplay() {
    if (this.mode === 'tracker') {
      const hours = Math.floor(this.timeLeft / 3600);
      const minutes = Math.floor((this.timeLeft % 3600) / 60);
      const seconds = this.timeLeft % 60;
      this.timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  playNotification() {
    const audio = new Audio('data:audio/wav;base64,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');
    audio.play();
  }
}