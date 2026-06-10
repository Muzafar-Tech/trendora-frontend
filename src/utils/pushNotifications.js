export const requestPermission = async () => {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const showPushNotification = (title, message, link) => {
  if (Notification.permission !== 'granted') return

  const notif = new Notification(title, {
    body: message,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
  })

  notif.onclick = () => {
    window.focus()
    if (link) window.location.href = link
    notif.close()
  }

  setTimeout(() => notif.close(), 5000)
}