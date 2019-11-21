import {animate, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';

export const ANIMATION = [
  trigger('fadeInAnimation', [
    transition(':enter', [
      query('#terms', style({opacity: 0, background: 'transparent'}), {optional: true}),
      query('#terms', stagger('10ms', [
        animate('.2s ease-out', keyframes([
          style({opacity: 0, background: 'transparent', offset: 0}),
          style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
          style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 1.0}),
        ]))]), {optional: true})
    ]),
    transition(':leave', [
      query('#terms', style({opacity: 1, background: 'rgba(255, 255, 255, 1)'}), {optional: true}),
      query('#terms', stagger('10ms', [
        animate('.2s ease-in', keyframes([
          style({opacity: 1, background: 'rgba(255, 255, 255, 1)', offset: 0}),
          style({opacity: .5, background: 'rgba(255, 255, 255, .5)', offset: 0.5}),
          style({opacity: 0, background: 'transparent', offset: 1.0}),
        ]))]), {optional: true})
    ])
  ])
];
