
  let progress = [];

  // Open IndexedDB database
  const request = indexedDB.open('100DaysChallenge', 1);
  
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('progress')) {
      db.createObjectStore('progress', { keyPath: 'id' });
    }
  };
  
  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction('progress', 'readwrite');
    const store = transaction.objectStore('progress');
    
    // Fetch progress data
    const fetchProgress = store.get(1);
    fetchProgress.onsuccess = function() {
      if (fetchProgress.result) {
        progress = fetchProgress.result.data;
        updateGrid();
      }
    };
  };
  
  // Update grid based on the stored progress
  function updateGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= 100; i++) {
      const box = document.createElement('div');
      box.classList.add('day');
      box.textContent = i;
      if (progress.includes(i)) {
        box.classList.add('completed');
      }
      box.addEventListener('click', () => {
        box.classList.toggle('completed');
        if (box.classList.contains('completed')) {
          progress.push(i);
        } else {
          progress = progress.filter(day => day !== i);
        }

        // Store the progress in IndexedDB
        const request = indexedDB.open('100DaysChallenge', 1);
        request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction('progress', 'readwrite');
          const store = transaction.objectStore('progress');
          store.put({ id: 1, data: progress });
        };
      });
      grid.appendChild(box);
    }
  }

