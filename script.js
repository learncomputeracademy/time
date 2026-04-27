// Format date with day name
function formatDateWithDay(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  // Display today's date
  document.querySelector('#today').textContent = `Today: ${formatDateWithDay(new Date())}`;
  
  // Update current time
  function getCurrentTime() {
    const now = new Date();
    const hours = (now.getHours() % 12 || 12).toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `<img src="https://i.ibb.co/r5136nN/time-2.png" alt="time" width="14" height="14"> ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  
  // Set up time display and update it every second
  const timeElement = document.querySelector('#time');
  timeElement.innerHTML = getCurrentTime();
  setInterval(() => timeElement.innerHTML = getCurrentTime(), 1000);
  
  // Calculate empty seats
  function calculateEmptySeats() {
    const timetableSlots = document.querySelectorAll('.slot ul li');
    let emptyCount = 0;
    timetableSlots.forEach(li => {
      if (!li.textContent.trim() && li.innerHTML === '') {
        emptyCount++;
      }
    });
    const availableSeats = Math.floor(emptyCount / 3);
    return availableSeats;
  }
  
  // Display empty seats
  const emptySeatsElement = document.querySelector('#empty-seats');
  emptySeatsElement.textContent = `Empty Seats: ${calculateEmptySeats()}+`;
  
  // Toggle section functionality
  const toggleSections = document.querySelectorAll('.toggle-section');
  toggleSections.forEach(section => {
    const summary = section.querySelector('summary');
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSections.forEach(otherSection => {
        if (otherSection !== section) {
          otherSection.classList.remove('active');
        }
      });
      section.classList.toggle('active');
    });
  });
  
  // Highlight today's schedule
  function highlightTodaySchedule() {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = dayNames[today.getDay()];
    
    // Find the day row that matches today
    const allDayElements = document.querySelectorAll('.day');
    let todayElement = null;
    
    allDayElements.forEach(dayElement => {
      if (dayElement.textContent.trim() === currentDay) {
        // Highlight the day cell
        dayElement.style.background = 'var(--primary)';
        dayElement.style.color = 'white';
        dayElement.style.fontWeight = 'bold';
        todayElement = dayElement;
      }
    });
    
    // If today's element is found, highlight the slots
    if (todayElement) {
      // Find today's index in the grid (how many days from the top)
      const dayIndex = Array.from(allDayElements).indexOf(todayElement);
      
      // Get the slots for today's row
      // Each row has 4 time slots that come after the day cell
      const todaySlots = [];
      const allSlots = document.querySelectorAll('.slot');
      
      // Calculate the indices for today's slots
      // The grid has 5 columns (day + 4 time slots)
      // For each row, we want the 4 time slots that follow the day cell
      for (let i = 0; i < 4; i++) {
        // dayIndex * 4 gives us the first slot of the current day's row
        // Then add i to get each subsequent slot
        todaySlots.push(allSlots[dayIndex * 4 + i]);
      }
      
      // Reset all slot styling first
      allSlots.forEach(slot => {
        slot.style.border = '1px solid rgba(255, 255, 255, 0.05)';
        slot.style.background = 'rgba(255, 255, 255, 0.03)';
        slot.style.boxShadow = 'none';
      });
      
      // Highlight all of today's slots with primary color
      todaySlots.forEach(slot => {
        if (slot) {
          slot.style.border = '2px solid var(--primary)';
          slot.style.background = 'rgba(107, 72, 255, 0.1)';
        }
      });
      
      // Now highlight the current time slot more prominently with accent color
      const currentHour = today.getHours();
      const currentMinutes = today.getMinutes();
      const currentTime = currentHour + (currentMinutes / 60);
      
      // Define time slots
      const timeSlots = [
        { start: 10.5, end: 12.5, index: 0 },  // 10:30-12:30
        { start: 12.5, end: 14.5, index: 1 },  // 12:30-02:30
        { start: 16.0, end: 18.0, index: 2 },  // 04:00-06:00
        { start: 18.0, end: 20.0, index: 3 },  // 06:00-08:00
      ];
      
      // Check if the current time falls within any of the time slots
      let currentSlotFound = false;
      for (const timeSlot of timeSlots) {
        if (currentTime >= timeSlot.start && currentTime < timeSlot.end) {
          if (todaySlots[timeSlot.index]) {
            todaySlots[timeSlot.index].style.border = '3px solid var(--accent)';
            todaySlots[timeSlot.index].style.background = 'rgba(0, 255, 204, 0.2)';
            todaySlots[timeSlot.index].style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.3)';
            currentSlotFound = true;
          }
          break;
        }
      }
      
      // If current time doesn't match any slot, highlight the next upcoming slot
      if (!currentSlotFound) {
        for (const timeSlot of timeSlots) {
          if (currentTime < timeSlot.start) {
            if (todaySlots[timeSlot.index]) {
              todaySlots[timeSlot.index].style.border = '3px solid var(--accent)';
              todaySlots[timeSlot.index].style.background = 'rgba(0, 255, 204, 0.2)';
              todaySlots[timeSlot.index].style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.3)';
            }
            break;
          }
        }
      }
    }
  }
  
  // Run when the page loads
  highlightTodaySchedule();
  
  // Update the highlight every minute
  setInterval(highlightTodaySchedule, 60000);