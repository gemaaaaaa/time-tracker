import './style.css';
import { Sidebar } from './js/sidebar.js';
import { Pomodoro } from './js/pomodoro.js';

// Initialize the sidebar and pomodoro timer
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = new Sidebar();
  const pomodoro = new Pomodoro();
});