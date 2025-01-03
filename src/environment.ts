const urls = {
    login: '/app/login/',
    profile: '/profile/',
    rituals: '/rituals/',
    checkins: '/rituals/<id>/checkins/',
    daily: '/rituals/<id>/checkins/daily/'
}

export const environment = {
    ...urls,
    apiEndpoint: 'http://localhost:8000',
    googleClientId: '709266120689-hnommeem9kvqlegphq4a8tmrhseo9meg.apps.googleusercontent.com',
    firebaseConfig: {
        apiKey: "AIzaSyAJkb24DxAP0ciFphX3JrBkJ1mEK5XX8XU",
        authDomain: "ritual-95fff.firebaseapp.com",
        projectId: "ritual-95fff",
        storageBucket: "ritual-95fff.firebasestorage.app",
        messagingSenderId: "264927648797",
        appId: "1:264927648797:web:9d32201a5fb95bd2b23af4",
        measurementId: "G-T2T5SQETWY"
    }
}