importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "TWOJ_API_KEY",
  authDomain: "TWOJ.firebaseapp.com",
  projectId: "TWOJ",
  messagingSenderId: "123",
  appId: "1:123:web:abc"
})

const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification?.title || 'ZenithMC', {
    body: payload.notification?.body || '',
    icon: '/ZenithMC/icon-192.png'
  })
})
