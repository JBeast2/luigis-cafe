// Luigi's Café - Main Application Logic

// State
let selectedBarista = null;
let selectedDrink = null;
let selectedSize = null;
let selectedMilk = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase listeners
  if (typeof initializeApp === 'function') {
    initializeApp();
  }
  
  // Request notification permission
  if ('Notification' in window) {
    requestNotificationPermission();
  }
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré:', registration.scope);
      })
      .catch((error) => {
        console.log('Erreur Service Worker:', error);
      });
  }
});

// Barista Selection
function selectBarista(element, barista) {
  // Remove selected class from all
  document.querySelectorAll('.barista-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selected class to clicked element
  element.classList.add('selected');
  selectedBarista = barista;
  
  // Log selection
  console.log('Barista sélectionné:', barista);
}

// Drink Selection
function selectDrink(element, drink) {
  // Remove selected class from all
  document.querySelectorAll('.drink-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selected class
  element.classList.add('selected');
  selectedDrink = drink;
  
  // Show options if available
  const optionsContainer = document.getElementById('drinkOptions');
  if (optionsContainer) {
    optionsContainer.style.display = 'block';
    updateOptions(drink);
  }
  
  console.log('Boisson sélectionnée:', drink);
}

// Update options based on drink type
function updateOptions(drink) {
  const optionsContainer = document.getElementById('drinkOptions');
  if (!optionsContainer) return;
  
  // Size options
  const sizeOptions = document.getElementById('sizeOptions');
  if (sizeOptions) {
    sizeOptions.innerHTML = `
      <button class="option-btn" onclick="selectSize(this, 'small')">Petit</button>
      <button class="option-btn selected" onclick="selectSize(this, 'medium')">Moyen</button>
      <button class="option-btn" onclick="selectSize(this, 'large')">Grand</button>
    `;
  }
  selectedSize = 'medium';
  
  // Milk options
  const milkOptions = document.getElementById('milkOptions');
  if (milkOptions && (drink === 'cappuccino' || drink === 'latte')) {
    milkOptions.style.display = 'flex';
    milkOptions.innerHTML = `
      <button class="option-btn" onclick="selectMilk(this, 'whole')">Entier</button>
      <button class="option-btn selected" onclick="selectMilk(this, 'semi')">Semi</button>
      <button class="option-btn" onclick="selectMilk(this, 'oat')">Avoine</button>
    `;
    selectedMilk = 'semi';
  } else if (milkOptions) {
    milkOptions.style.display = 'none';
  }
}

// Size Selection
function selectSize(element, size) {
  const buttons = element.parentElement.querySelectorAll('.option-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');
  selectedSize = size;
  console.log('Taille sélectionnée:', size);
}

// Milk Selection
function selectMilk(element, milk) {
  const buttons = element.parentElement.querySelectorAll('.option-btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');
  selectedMilk = milk;
  console.log('Lait sélectionné:', milk);
}

// Place Order
async function placeOrder() {
  // Validate selection
  if (!selectedBarista || !selectedDrink) {
    showToast('Sélectionnez un barista et une boisson', true);
    return;
  }
  
  // Check if cafe is open
  const statusBadge = document.querySelector('.status-badge');
  if (statusBadge && statusBadge.classList.contains('closed')) {
    showModal('Le café est actuellement fermé', '🔒', 'Les commandes seront reprises à la réouverture.');
    return;
  }
  
  // Show loading state
  const orderBtn = document.getElementById('orderBtn');
  const originalText = orderBtn.innerHTML;
  orderBtn.innerHTML = '⏳ Commandé...';
  orderBtn.disabled = true;
  
  try {
    // Create order object
    const order = {
      barista: selectedBarista,
      drink: selectedDrink,
      size: selectedSize || 'medium',
      milk: selectedMilk || 'none',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to Firebase if available
    if (typeof addOrder === 'function') {
      await addOrder(order);
    }
    
    // Also store locally for demo
    saveOrderLocally(order);
    
    // Show success
    showToast('☕ Commande envoyée!', false);
    
    // Reset selections
    resetSelections();
    
  } catch (error) {
    console.error('Erreur commande:', error);
    showToast('Erreur lors de la commande', true);
  } finally {
    // Restore button
    orderBtn.innerHTML = originalText;
    orderBtn.disabled = false;
  }
}

// Save order to localStorage (for demo/offline)
function saveOrderLocally(order) {
  const orders = JSON.parse(localStorage.getItem('luigisOrders') || '[]');
  orders.push({
    id: 'ORD-' + Date.now(),
    ...order
  });
  localStorage.setItem('luigisOrders', JSON.stringify(orders));
  
  // Trigger storage event for barista page
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'luigisOrders',
    newValue: JSON.stringify(orders)
  }));
}

// Reset form selections
function resetSelections() {
  selectedBarista = null;
  selectedDrink = null;
  selectedSize = null;
  selectedMilk = null;
  
  document.querySelectorAll('.barista-card, .drink-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  const optionsContainer = document.getElementById('drinkOptions');
  if (optionsContainer) {
    optionsContainer.style.display = 'none';
  }
}

// Toast notification
function showToast(message, isError = false) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Modal
function showModal(title, icon, message) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-icon">${icon}</div>
      <div class="modal-title">${title}</div>
      <div class="modal-text">${message}</div>
      <button class="modal-btn" onclick="this.closest('.modal-overlay').remove()">OK</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Show modal
  setTimeout(() => modal.classList.add('show'), 10);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// Utility: Format time
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Utility: Get status color
function getStatusColor(status) {
  switch (status) {
    case 'pending': return 'var(--warning)';
    case 'ready': return 'var(--success)';
    case 'completed': return '#9E9E9E';
    default: return 'var(--warning)';
  }
}

// Export for use in other pages
window.app = {
  selectBarista,
  selectDrink,
  selectSize,
  selectMilk,
  placeOrder,
  showToast,
  showModal,
  formatTime,
  getStatusColor
};