import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import(
            './components/home/home.component')
        .then(mod => mod.HomeComponent)
    },
    {
        path: 'rituals',
        loadComponent: () => import(
            './components/ritual-list/ritual-list.component')
        .then(mod => mod.RitualListComponent)
    },
    {
        path: 'rituals/:id/:name',
        loadComponent: () => import(
            './components/ritual-list/check-in-button/check-in-button.component')
        .then(mod => mod.CheckInButtonComponent)
    },
];
