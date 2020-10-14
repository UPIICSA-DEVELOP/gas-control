import {animate, query, style, transition, trigger} from '@angular/animations';

export const archiveAnimation = trigger('animation', [
  transition(':enter', [
    query('#archive, :host', [
      style({
        opacity: 0
      }),
      animate('180ms ease-out', style({opacity: 1}))
    ], {optional: true})
  ]),
  transition(':leave', [
    query('#archive, :host', [
      style({
        opacity: 1
      }),
      animate('180ms ease-in', style({opacity: 0}))
    ], {optional: true})
  ])
]);
