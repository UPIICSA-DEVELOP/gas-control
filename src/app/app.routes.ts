/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {ScreenComponent} from '@app/components/screen/screen.component';
import {LoginComponent} from '@app/components/login/login.component';
import {AuthService} from '@app/core/services/auth/auth.service';
import {ResetPassComponent} from '@app/components/screen/child/reset-pass/reset-pass.component';
import {ProfileComponent} from '@app/components/screen/components/profiles/profile/profile.component';
import {NotificationsComponent} from '@app/components/screen/components/notifications/notifications.component';
import {CollaboratorsListComponent} from '@app/components/screen/components/collaborators-list/collaborators-list.component';
import {UserProfileComponent} from '@app/components/screen/components/profiles/user-profile/user-profile.component';
import {StationProfileComponent} from '@app/components/screen/components/profiles/station-profile/station-profile.component';
import {StationListComponent} from '@app/components/screen/components/station-list/station-list.component';
import {AddCollaboratorComponent} from '@app/components/screen/components/add-collaborator/add-collaborator.component';
import {DocumentationComponent} from '@app/components/screen/components/documentation/documentation.component';
import {ProceduresComponent} from '@app/components/screen/components/procedures/procedures.component';
import {UserProfileService} from '@app/core/services/profiles/user-profile.service';
import {PrivacyComponent} from '@app/components/screen/child/privacy/privacy.component';
import {AdminComponent} from '@app/components/admin/admin.component';
import {TermsComponent} from '@app/components/screen/child/terms/terms.component';
import {CookiesComponent} from '@app/components/screen/child/cookies/cookies.component';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {ResetPassRouterService} from '@app/core/services/reset-pass/reset-pass-router.service';
const URL_BASE = environment.url;

export const appRoutes: Routes = [
  {
    path: 'home',
    component: ScreenComponent,
    canActivate: [AuthRouterService],
    resolve: {data: AuthService},
    data: {
      url: URL_BASE + 'home',
      title:'Dashboard'
    },
    children: [
      {
        path:'documents',
        component: DocumentationComponent,
        data:{
          title: 'Documentación',
          url: URL_BASE + 'home/documents'
        }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data:{
          title: 'Notificaciones',
          url: URL_BASE + 'home/notifications'
        }
      },
      {
        path:'collaborators',
        component: CollaboratorsListComponent,
        data:{
          title: 'Colaboradores',
          url: URL_BASE + 'home/collaborators'
        }
      },
      {
        path:'station-list',
        component: StationListComponent,
        data:{
          title: 'Lista de estaciones',
          url: URL_BASE + 'home/station-list'
        }
      },
      {
        path: 'add-collaborator',
        component: AddCollaboratorComponent,
        data:{
          url: URL_BASE + 'home/add-collaborator',
          title: 'Añadir colaborador'
        }
      },
      {
        path: 'procedures',
        component: ProceduresComponent,
        data:{
          title: 'Procedimientos',
          url: URL_BASE + 'home/procedures'
        }
      },
      {
        path: 'profile',
        data:{
          url: URL_BASE + 'home/profile',
          title: 'Perfil'
        },
        children:[
          {
            path: 'consultancy',
            component: ProfileComponent,
            data:{
              title: 'Perfil',
              url: URL_BASE + 'home/profile/consultancy'
            }
          },
          {
            path: 'user',
            component: UserProfileComponent,
            resolve: {data: UserProfileService},
            data:{
              title: 'Perfil',
              url: URL_BASE + 'home/profile/user'
            }
          },
          {
            path: 'gas-station',
            component: StationProfileComponent,
            data:{
              title: 'Estación de servicio',
              url: URL_BASE + 'home/profile/gas-station'
            }
          }
        ]
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthRouterService],
    data: {
      title:'inSpéctor - Iniciar sesión',
      url: URL_BASE,
    }
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthRouterService],
    resolve: {data: AuthService},
    data: {
      title:'Administrador',
      url: URL_BASE
    }
  },
  {
    path: 'signin',
    canActivate: [ResetPassRouterService],
    component: ResetPassComponent,
    data:{
      title: 'Recuperar Contraseña',
      url: URL_BASE + 'signin'
    }
  },
  {
    path: 'privacidad',
    component: PrivacyComponent,
    data:{
      title:'Privacidad',
      url: URL_BASE + 'privacidad',
      robots: 'true',
      canonical: 'true'
    }
  },
  {
    path: 'terminos',
    component: TermsComponent,
    canActivate: [AuthRouterService],
    data:{
      title:'Términos y Condiciones',
      url: URL_BASE + 'terminos',
      robots: 'true',
      canonical: 'true'
    }
  },
  {
    path: 'cookies',
    component: CookiesComponent,
    data:{
      title:'Política de Cookies',
      url: URL_BASE + 'cookies',
      robots: 'true',
      canonical: 'true'
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo:'/login'
  },
  {
    path: '**',
    redirectTo:'/login'
  }
];

