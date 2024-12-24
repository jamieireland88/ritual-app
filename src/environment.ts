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
    googleClientId: '709266120689-hnommeem9kvqlegphq4a8tmrhseo9meg.apps.googleusercontent.com'
}