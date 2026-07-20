import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

const migrateFromVercel = self.location.hostname.endsWith('.vercel.app');

if (migrateFromVercel) {
  self.skipWaiting();
  self.addEventListener('activate', event => {
    event.waitUntil((async () => {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      await Promise.all(clients.map(client => client.navigate(client.url)));
      await self.registration.unregister();
    })());
  });
} else {
  cleanupOutdatedCaches();
  precacheAndRoute(self.__WB_MANIFEST);
  self.skipWaiting();
  clientsClaim();

  async function handlePush(event) {
    let payload = {};
    try {
      payload = event.data?.json() || {};
    } catch {
      // Malformed payloads still receive a privacy-safe notification.
    }

    await self.registration.showNotification('Afterbloom', {
      body: 'Afterbloom has a care update for you.',
      tag: payload.data?.notification_type || 'afterbloom',
      data: { url: '/' },
    });
  }

  self.addEventListener('push', event => {
    event.stopImmediatePropagation();
    event.waitUntil(handlePush(event));
  });

  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const appClient = windowClients.find(client => 'focus' in client);
      return appClient ? appClient.focus() : self.clients.openWindow(event.notification.data?.url || '/');
    }));
  });

  getMessaging(initializeApp({
    apiKey: 'AIzaSyDFYjRw5IyRHE5XS7EmMRo_jHhfKKNKGNY',
    authDomain: 'afterbloom-18d15.firebaseapp.com',
    projectId: 'afterbloom-18d15',
    storageBucket: 'afterbloom-18d15.firebasestorage.app',
    messagingSenderId: '442426425962',
    appId: '1:442426425962:web:4782a5c31e31798d654013',
  }));
}
