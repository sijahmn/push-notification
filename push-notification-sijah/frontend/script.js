const button = document.getElementById("checkbox");

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch((err) => console.error(err));
}

async function send() {
  // Register Service Worker
  console.log("Test Registering service worker...");
  const register = await navigator.serviceWorker.register("/serviceWorker.js", {
    scope: "/",
  });
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Test Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Test Sending Push...");
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log("Push Sent...");
}

//  function to process applicationServerKey
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// turn off button for notification
button.addEventListener("clicked", () => {
  navigator.permissions.query({ name: "push" }).then(function (status) {
    // Initial permission status is `status.state`

    status.onchange = function () {
      // Status changed to `this.state`
    };
  });
});
