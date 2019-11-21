import {animate, state, style, transition, trigger} from '@angular/animations';

export const ANIMATION = [
  trigger('fadeInAnimation', [
    transition(':enter', [
      style({right: '-100%'}),
      animate('.40s ease-in-out', style({right: '0'}))
    ]),
    transition(':leave', [
      style({right: '0'}),
      animate('.40s ease-in-out', style({right: '-100%'}))
    ])
  ]),
  trigger('selected', [
    state('selected',
      style({
        backgroundColor: 'rgba(0, 0, 0, 0.288)',
      })
    ),
    transition('selected <=> *', [
      animate('10ms ease-in')
    ])
  ])
];
