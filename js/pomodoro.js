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
    
    this.init();
  }
  
  init() {
    this.modeToggleBtn.addEventListener('click', () => this.toggleMode());
    this.addProjectBtn.addEventListener('click', () => this.addNewProject());
    this.updateDisplay();
    this.updateButtonText();
    this.loadProjects();
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            ${project.isRunning ? 
              '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"/>' :
              '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>'
            }
          </svg>
        </button>
      `;
      
      projectEl.innerHTML = `
        ${playButton}
        <h3 class="text-lg font-semibold flex-1">${project.name}</h3>
        <div class="text-2xl font-bold text-primary">${this.formatTime(project.timeSpent)}</div>
      `;
      
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
      
      this.startBtn.textContent = 'Pause';
      this.startBtn.classList.replace('bg-primary', 'bg-red-600');
      this.startBtn.classList.replace('hover:bg-accent', 'hover:bg-red-700');
    }
  }
  
  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timer);
    this.startBtn.textContent = 'Start';
    this.startBtn.classList.replace('bg-red-600', 'bg-primary');
    this.startBtn.classList.replace('hover:bg-red-700', 'hover:bg-accent');
  }
  
  toggleMode() {
    this.pauseTimer();
    this.mode = this.mode === 'tracker' ? 'pomodoro' : 'tracker';
    this.pomodoroStats.classList.toggle('hidden', this.mode === 'tracker');
    this.resetTimer();
    this.updateButtonText();
  }
  
  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.mode === 'pomodoro' ? 25 * 60 : 0;
    this.updateDisplay();
  }
  
  updateButtonText() {
    this.resetBtn.textContent = this.mode === 'tracker' ? 'Stop' : 'Reset';
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