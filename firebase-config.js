// Firebase Configuration - Luigi's Café
// Remplacez par vos identifiants Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCPTrqE_xS1JNtcNV19GtVxS4K99h6ZkLU",
  authDomain: "luigis-cafe.firebaseapp.com",
  projectId: "708853192485",
  storageBucket: "luigis-cafe.appspot.com",
  messagingSenderId: "708853192485",
  appId: "1:708853192485:web:30d9746ccbc89e0abcaccc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const messaging = firebase.messaging();

// Demander la permission pour les notifications
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permission de notification accordée');
      return await getFcmToken();
    } else {
      console.log('Permission de notification refusée');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return null;
  }
}

// Obtenir le token FCM
async function getFcmToken() {
  try {
    const token = await messaging.getToken();
    console.log('Token FCM:', token);
    // Sauvegarder le token dans Firestore
    await db.collection('tokens').doc('user_' + Date.now()).set({
      token: token,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      platform: 'ios'
    });
    return token;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token:', error);
    return null;
  }
}

// Envoyer une notification via Firebase Functions (ou Cloud Messaging)
async function sendNotification(title, body, data = {}) {
  // Cette fonction nécessite un serveur ou Firebase Cloud Functions
  // Pour une solution gratuite, utilisez Firebase Console ou créez une Cloud Function
  
  // Alternative: Mettre à jour Firestore et déclencher un listener
  await db.collection('notifications').add({
    title: title,
    body: body,
    data: data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    read: false
  });
}

// Écouter les changements de statut du café
function listenToCafeStatus(callback) {
  db.collection('cafeStatus').doc('status')
    .onSnapshot((doc) => {
      if (doc.exists) {
        callback(doc.data());
      } else {
        callback({ isOpen: true }); // Par défaut ouvert
      }
    });
}

// Écouter les nouvelles commandes
function listenToOrders(callback) {
  db.collection('orders')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    });
}

// Ajouter une commande
async function addOrder(order) {
  const orderData = {
    ...order,
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await db.collection('orders').add(orderData);
  
  // Envoyer notification
  await sendNotification(
    'Nouvelle commande! ☕',
    `${order.barista} doit préparer: ${order.drink}`,
    { orderId: docRef.id }
  );
  
  return docRef.id;
}

// Mettre à jour le statut d'une commande
async function updateOrderStatus(orderId, status) {
  await db.collection('orders').doc(orderId).update({ status });
}

// Basculer le statut du café
async function toggleCafeStatus(isOpen) {
  await db.collection('cafeStatus').doc('status').set({
    isOpen: isOpen,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// Initialiser les listeners
function initializeApp() {
  // Écouter le statut du café
  listenToCafeStatus((status) => {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    if (statusIndicator && statusText) {
      if (status.isOpen) {
        statusIndicator.className = 'status-badge open';
        statusIndicator.innerHTML = '☕ Ouvert';
        statusText.textContent = 'Ouvert';
      } else {
        statusIndicator.className = 'status-badge closed';
        statusIndicator.innerHTML = '🔒 Fermé';
        statusText.textContent = 'Fermé';
      }
    }
  });
}
