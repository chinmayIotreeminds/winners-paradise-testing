importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDu8ETEDG_HwGlSOn5vovuZ1StiZPKc83k",
    authDomain: "matchmakers-c4ddc.firebaseapp.com",
    projectId: "matchmakers-c4ddc",
    storageBucket: "matchmakers-c4ddc.firebasestorage.app",
    messagingSenderId: "1044662746666",
    appId: "1:1044662746666:web:5022cd4265654f26d60d53",
    measurementId: "G-EPC1T8G31J"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/default-icon.png',
        image: payload.notification.image,
        data: { url: payload.notification.click_action || "https://infosys.com" }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    console.log(event, "Event");
    const targetUrl = event.notification.data.url || "https://infosys.com";
    console.log(targetUrl, "targetUrl")
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

