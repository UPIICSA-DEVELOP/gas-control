
/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {map, filter} from 'rxjs/operators';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT, isPlatformServer} from '@angular/common';
import {Router, RoutesRecognized} from '@angular/router';
import {environment} from 'environments/environment';

export interface ConfigMeta  {
  title: string;
  description: string;
  url: string;
  urlImage?: string;
  robots?: boolean;
  schema?: boolean;
  canonical?: boolean;
  alternateApp?: boolean;
}

@Injectable()
export class MetaService {

  private _urlBase: string;
  constructor(
    @Inject(PLATFORM_ID) private _platformId,
    @Inject(DOCUMENT) private _document: Document,
    private _meta: Meta,
    private _title: Title,
    private _route: Router
  ) {
    this._urlBase = environment.url;
  }

  public init(): void{
    if(environment.url === ''){
      this.setMetaGoogleSiteVerification();
    }
    this._route.events.pipe(
      filter(event => event instanceof RoutesRecognized),
      map( (event: RoutesRecognized) => {
        let data = event.state.root.firstChild;
        while (data.firstChild){
          data = data.firstChild;
        }
        return data.data;
      }),)
      .subscribe(data => {
        if(data){
          const desc = data.description || undefined;
          this.setAllMetas({title: data.title, description: desc, url: data.url});
        }
        if(data.index && data.index === 'true'){
          this.setIndexSchema();
          this.setSiteNavigationSchema();
        }
        if(data.robots && data.robots === 'true'){
          this.setRobotsMetas();
        }
        if(data.canonical && data.canonical === 'true'){
          this.setCanonicalLink(data.url);
        }
        if(data.schema && data.schema === 'true'){
          this.setWebsiteSchema(data.url, data.title, data.description, null);
        }
      });
  }




  public setAllMetas(config: ConfigMeta): void {
   this.setDefaultMetas(config.title, config.description);
    this.setTwitterMetas(config.title, config.description, config.urlImage);
    this.setFacebookMetas(config.title, config.description, config.url, config.urlImage);
    if(config.canonical){
      this.setCanonicalLink(config.url);
    }
    if(config.robots){
      this.setRobotsMetas();
    }
    if(config.schema){
      this.setWebsiteSchema(config.url, config.title, config.description, config.urlImage);
    }
    if(config.alternateApp){
      this.setAlternateAppLink(config.url);
    }
  }

  private setDefaultMetas(title: string, description: string): void {
    if(title){
      this._title.setTitle(title);
    }
    if(description){
      this._meta.updateTag({name: 'description', content: description });
    }
  }

  private setTwitterMetas(title: string, description: string, urlImage: string): void {
    this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    if(title){
      this._meta.updateTag({ name: 'twitter:titleBar', content: title});
    }
    if(description){
      this._meta.updateTag({ name: 'twitter:description', content: description });
    }
    if(urlImage){
      this._meta.updateTag({ name: 'twitter:image', content: MetaService.validateSizeImage(urlImage) });
    }
  }

  private setFacebookMetas(title: string, description: string, url: string, urlImage: string): void {
    if(url){
      this._meta.updateTag({ property: 'og:url', content: url });
    }
     if(title){
       this._meta.updateTag({ property: 'og:titleBar', content: title});
     }
    if(description){
      this._meta.updateTag({ property: 'og:description', content: description });
    }
    if(urlImage){
      this._meta.updateTag({ property: 'og:image', content: MetaService.validateSizeImage(urlImage) });
    }
  }

  private setCanonicalLink(url: string): void {
    let node = this._document.createElement('link');
    node.setAttribute('rel', 'canonical');
    node.setAttribute('href', url);
    this._document.head.appendChild(node);
  }

  private setAlternateAppLink(url: string): void {
    let ios = this._document.createElement('link');
    ios.setAttribute('rel', 'alternate');
    ios.setAttribute('href', 'ios-app://1202672549/'+url);
    this._document.head.appendChild(ios);
    let android = this._document.createElement('link');
    android.setAttribute('rel', 'alternate');
    android.setAttribute('href', 'android-app://com.maplander.customer/'+url);
    this._document.head.appendChild(android);
  }

  private setRobotsMetas(): void {
    this._meta.addTag({ name: 'robots', content: 'index,follow' });
  }

  private setWebsiteSchema(url: string, title: string, description: string, imageUrl: string){
    if(isPlatformServer(this._platformId)){
      const data = {
        "@context" : "http://schema.org",
        "@type" : "WebSite",
        "name" : title,
        "url" : url,
        "image" : (imageUrl)?imageUrl: this._urlBase + 'favicon.ico',
        "description": description
      };

      let node = this._document.createElement('script');
      node.setAttribute('type', 'application/ld+json');
      node.text = JSON.stringify(data);
      this._document.body.appendChild(node);
    }
  }

  private setIndexSchema(): void{
    if(isPlatformServer(this._platformId)){
      const data = {
        "@context" : "http://schema.org",
        "@type" : "WebSite",
        "name" : "",
        "url" :  this._urlBase,
        "image" : "",
        "description": "",
        "potentialAction" : {
          "@type" : "SearchAction",
          "target" : this._urlBase + "{country}",
          "query-input" : "required name=country"
        },
        "sameAs" : [
          "",
          "",
          ""
        ]
      };

      let node = this._document.createElement('script');
      node.setAttribute('type', 'application/ld+json');
      node.text = JSON.stringify(data);
      this._document.body.appendChild(node);
    }
  }

  private setSiteNavigationSchema(): void {
    if(isPlatformServer(this._platformId)){
      const data = {};
        /*
        {
        "@context":"http://schema.org",
        "@graph": [
          {
            "@type":"SiteNavigationElement",
            "position":1,
            "name": "Guía para anunciar una propiedad",
            "description": "Los profesionales inmobiliarios saben cómo describir y retratar una propiedad y dónde " +
            "colocar y compartir los anuncios para encontrar cliente más rápido.",
            "url":"https://maplander.com/announce-property"
          },
          {
            "@type":"SiteNavigationElement",
            "position":2,
            "name": "Encontrar la propiedad perfecta",
            "description": "Aprender cómo utilizar los filtros de búsqueda es muy importante, igual es saber en qué " +
            "características de la propiedad y de la zona conviene fijarse.",
            "url": this._urlBase + "find-property"
          },
          {
            "@type":"SiteNavigationElement",
            "position":3,
            "name": "Organizador Profesional Inmobiliario",
            "description": "Todo lo que necesita un gran agente de bienes raíces para acceder a sus expedientes y " +
            "anunciar sus propiedades al instante, desde la palma de la mano.",
            "url": this._urlBase + "opi"
          },
          {
            "@type":"SiteNavigationElement",
            "position":4,
            "name": "Acerca de nosotros",
            "description": "MapLander es el medio internacional de publicidad multimedia especializado para bienes " +
            "raíces anunciados directamente por desarrolladores y profesionales inmobiliarios.",
            "url": this._urlBase + "about"
          },
          {
            "@type":"SiteNavigationElement",
            "position":5,
            "name": "Preguntas frecuentes",
            "description": "Aspiramos a desarrollar una plataforma tan intuitiva y amigable que no requiera explicación, " +
            "pero aun así nos han hecho algunas preguntas y aquí están las respuestas.",
            "url": this._urlBase + "faq"
          },
          {
            "@type":"SiteNavigationElement",
            "position":6,
            "name": "Política de privacidad y manejo de datos personales",
            "description": "En cumplimiento con lo establecido por la Ley Federal de Transparencia, aquí informamos " +
            "como cuidamos los datos de nuestros usuarios.",
            "url": this._urlBase + "privacy"
          },
        ]
      };
      */
      const node = this._document.createElement('script');
      node.setAttribute('type', 'application/ld+json');
      node.text = JSON.stringify(data);
      this._document.body.appendChild(node);
    }
  }

  private setMetaGoogleSiteVerification(): void{
    this._meta.addTag({ name: 'google-site-verification', content: '' });
  }

  private static validateSizeImage(urlImage:string): string{
    let url = urlImage;
    if(url.endsWith('=s1600')){
      url = url.replace('=s1600', '');
    }
    return url;
  }

}
