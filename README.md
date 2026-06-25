# Luigi's Café - Web App iPhone

Application web pour commander des cafés facilement, conçue pour un usage familial.

## Fonctionnalités

### Mode Client (`index.html`)
- 🧑‍🍳 Sélection du barista (Luigi ou Francesco)
- ☕ Sélection du café (Espresso, Cappuccino, Café Glacé, etc.)
- 📱 Indicateur temps réel du statut du café (Ouvert/Fermé)
- 🔔 Notifications push pour les confirmations

### Mode Barista (`barista.html`)
- 🔄 Basculer le statut du café (Ouvert/Fermé)
- 📋 Voir les commandes en temps réel
- ✓ Marquer les commandes "Prêt" ou "Remis"
- 📲 Envoyer des notifications aux clients

## Installation

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet "Luigis Cafe"
3. Activez **Cloud Firestore**
4. Activez **Cloud Messaging**
5. Obtenez vos identifiants de configuration

### 2. Configurer Firebase

Ouvrez `firebase-config.js` et remplacez les valeurs:

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "luigis-cafe.firebaseapp.com",
  projectId: "708853192485",
  storageBucket: "luigis-cafe.appspot.com",
  messagingSenderId: "708853192485",
  appId: "VOTRE_APP_ID"
};
```

### 3. Initialiser Firestore

Dans Firebase Console > Firestore Database:

1. Créez une base de données en mode test
2. Ajoutez les collections suivantes:

**Collection: `cafeStatus`**
- Document ID: `status`
- Champs: `isOpen: true` (boolean)

**Collection: `orders`** (sera créée automatiquement)

**Collection: `tokens`** (sera créée automatiquement)

### 4. Déployer

#### Option A: GitHub Pages (Gratuit)

1. Créez un repository GitHub
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans Settings > Pages
4. Votre app sera disponible sur `https://votre-username.github.io/luigis-cafe/`

#### Option B: Firebase Hosting (Gratuit)

1. Installez Firebase CLI: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init hosting`
4. Répondez aux questions:
   - Public directory: `./`
   - Single-page app: Non
5. `firebase deploy`

### 5. Activer les notifications push

Pour les notifications push avec Firebase Cloud Messaging:

1. Générez des clés VAPID dans Firebase Console > Cloud Messaging
2. Ajoutez les clés dans `firebase-config.js`
3. Configurez un service worker FCM

**Note:** Les notifications push complètes nécessitent Firebase Cloud Functions ou un serveur. Pour une solution 100% gratuite, l'app utilise Firestore temps réel comme solution de secours.

## Structure du projet

```
luigis-cafe/
├── index.html           # Page principale client
├── barista.html         # Page mode barista
├── styles.css           # Styles CSS
├── app.js               # Logique principale
├── firebase-config.js   # Configuration Firebase
├── manifest.json        # Configuration PWA
├── service-worker.js   # Service worker
└── README.md           # Cette documentation
```

## Ajouter à l'écran d'accueil (iPhone)

1. Ouvrez l'app dans Safari
2. Appuyez sur le bouton de partage (📤)
3. Faites défiler et appuyez sur "Ajouter à l'écran d'accueil"
4. Appuyez sur "Ajouter"

L'app fonctionnera maintenant comme une application native!

## Utilisation hors-ligne

L'app fonctionne hors-ligne avec localStorage:
- Les commandes sont sauvegardées localement
- Le statut du café est synchronisé
- Les données se synchronisent quand la connexion revient

## Personnalisation

### Modifier les baristas
Dans `index.html`, modifiez les `.barista-card`:

```html
<div class="barista-card" onclick="selectBarista(this, 'NouveauNom')">
  <div class="barista-avatar">🎨</div>
  <div class="barista-name">NouveauNom</div>
  <div class="barista-specialty">Spécialité: ...</div>
</div>
```

### Modifier les boissons
Dans `index.html`, modifiez les `.drink-card`:

```html
<div class="drink-card" onclick="selectDrink(this, 'MaBoisson')">
  <div class="drink-icon">☕</div>
  <div class="drink-name">MaBoisson</div>
  <div class="drink-price">4,00 €</div>
</div>
```

### Modifier les couleurs
Dans `styles.css`, modifiez les variables CSS:

```css
:root {
  --primary: #8b5e3c;        /* Couleur principale */
  --primary-dark: #5c3d2a;   /* Couleur sombre */
  --secondary: #d4a574;      /* Couleur secondaire */
  --bg-light: #faf6f0;       /* Fond clair */
  --bg-dark: #3d2c1f;        /* Fond sombre */
}
```

## Dépannage

### L'app ne s'installe pas sur iPhone
- Vérifiez que vous utilisez **Safari** (pas Chrome)
- L'app doit être servie en **HTTPS**

### Les notifications ne fonctionnent pas
- Vérifiez que Firebase est correctement configuré
- Activez les permissions de notification dans les paramètres iPhone

### Les commandes ne synchronisent pas
- Vérifiez votre connexion internet
- Les données sont aussi sauvegardées localement

## Licence

Projet familial - Usage libre pour la famille et les amis.

---

☕ Fait avec amour pour les amateurs de café
