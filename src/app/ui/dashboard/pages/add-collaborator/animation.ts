import {animate, style, transition, trigger} from '@angular/animations';

export const ANIMATION = [
  trigger('fadeInAnimation', [
    transition(':enter', [
      style({right: '-100%'}),
      animate('.40s ease-out', style({right: '0'}))
    ]),
    transition(':leave', [
      style({right: '0'}),
      animate('.40s ease-in', style({right: '-100%'}))
    ])
  ])
];
