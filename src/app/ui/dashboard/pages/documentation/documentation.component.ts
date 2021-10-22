/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {UploadFileService} from '@app/shared/components/upload-file/upload-file.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '@app/core/services/api/api.service';
import {Observable, Subscription} from 'rxjs';
import {PdfVisorService} from '@app/shared/components/pdf-visor/pdf-visor.service';
import {Constants} from '@app/utils/constants/constants.utils';
import {HashService} from '@app/utils/utilities/hash.service';
import {LoaderService} from '@app/core/components/loader/loader.service';
import {Document} from '@app/utils/interfaces/document';
import {HttpResponseCodes} from '@app/utils/enums/http-response-codes';
import {ANIMATION} from '@app/ui/dashboard/pages/documentation/animation';
import {DialogResponse, DialogService, LocalStorageService, SnackBarService} from '@maplander/core';
import {UserMedia} from '@app/utils/interfaces/user-media';
import {FileCS} from '@app/utils/interfaces/file-cs';
import {OtherDocument} from '@app/utils/interfaces/other-document';
import {Person} from '@app/utils/interfaces/person';
import {switchMap} from 'rxjs/operators';
import {EntityResponse} from '@app/utils/class/entity-response';
import {OtherDocStation} from '@app/utils/interfaces/other-doc-station';



interface DocList {
  name: string;
  type?: number;
  docFile?: {
    file?: FileCS;
    id?: string;
    idStation: string;
    regulationType: number;
    type: number;
  };
}

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss'],
  animations: [ANIMATION]
})

export class DocumentationComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation')
  public stationId: string;
  public docsAsea: DocList[];
  public otherDocsAsea: DocList[];
  public docsCre: DocList[];
  public otherDocsCre: DocList[];
  public docsProCiv: DocList[];
  public docsStps: DocList[];
  public docsProfeco: DocList[];
  public otherDocsProfeco: DocList[];
  public othersDocuments: OtherDocument[];
  public otherDocsProfecoTitles: String[];
  public load: boolean;
  public documentsActive: number;
  private _documentData: FormData;
  private _subscriptionLoader: Subscription;

  constructor(
    private _uploadFile: UploadFileService,
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _api: ApiService,
    private _apiLoader: LoaderService,
    private _snackBarService: SnackBarService,
    private _pdf: PdfVisorService,
    private _dialog: DialogService
  ) {
    this.documentsActive = 1;
    this.othersDocuments = [];
    this.docsAsea = [];
    this.docsCre = [];
    this.docsProCiv = [];
    this.docsStps = [];
    this.docsProfeco = [];
    this.otherDocsProfeco = [];
    this.otherDocsProfecoTitles = [];
  }

  ngOnInit() {
    this.stationId = this._activateRoute.params['_value'].station;
    this.listAseaDocs(this._activateRoute.snapshot.data.data.asea);
    this.listCreDocs(this._activateRoute.snapshot.data.data.cre);
    this.listProCiv(this._activateRoute.snapshot.data.data.prociv);
    this.listStps(this._activateRoute.snapshot.data.data.stps);
    this.listProfeco(this._activateRoute.snapshot.data.data.profeco);
    // this.profecoDocuments = this._activateRoute.snapshot.data.data.profeco.item.profecoDocuments;
    this.othersDocuments = this._activateRoute.snapshot.data.data.others.otherDocuments || [];
    this._subscriptionLoader = this._apiLoader.getProgress().subscribe(load => {
      this.load = load;
    });
  }

  ngOnDestroy(): void {
    this._subscriptionLoader.unsubscribe();
  }

  private listAseaDocs(response: any): void {
    // console.log({'listAseaDocs()': response});
    if (response.code === HttpResponseCodes.OK) {
      this.docsAsea = [
        {name: 'Dictamen de instalaciones eléctricas', type: 1},
        {name: 'Plano de instalaciones eléctricas', type: 2},
        {name: 'Diagrama unifilar', type: 3},
        {name: 'Recibo de consumo eléctrico', type: 4},
        {name: 'spacer'},
        {name: 'Estudio de tierras físicas y pararrayos', type: 5},
        {name: 'Dictamen de diseño y construcción', type: 20},
        {name: 'Dictamen operación y mantenimiento', type: 21},
        {name: 'Dirección', type: 8},
        {name: 'spacer'},
        {name: 'Prueba de hermeticidad', type: 9},
        {name: 'Número de permiso de la CRE', type: 10},
        {name: 'Razón social', type: 6},
        {name: 'RFC', type: 7},
        {name: 'Número de tanques, producto y capacidad en litros', type: 11}
      ];
      this.otherDocsAsea = [
        {name: 'Manifiesto de residuos peligrosos', type: 22},
        {name: 'Limpieza ecológica', type: 23},
        {name: 'Documento que enuncie el material de fabricación de tanques y tuberías', type: 14},
        {name: 'Planos de la estación (todos)', type: 15},
        {name: 'Informe preventivo o Manifiesto de impacto ambiental', type: 24},
        {name: 'Registro como generador de residuos peligrosos', type: 19},
        {name: 'Registro como generador de residuos no peligrosos', type: 25},
        {name: 'Licencia de funcionamiento', type: 26},
        {name: 'Cédula de operación anual', type: 27},
        {name: 'Análisis de riesgo', type: 28},
        {name: 'Protocolo de respuesta a emergencias', type: 29},
        {name: 'SASISOPA', type: 30},
        {name: 'Dictamen de SASISOPA', type: 31},
        {name: 'NOM-004-ASEA-2017 Sistema de Recuperación de vapores', type: 32},
        {name: 'Pruebas de hermeticidad', type: 33},
        {name: 'CURR', type: 34}
      ];
      if (response.items) {
        for (const doc of response.items) {
          let index = this.docsAsea.findIndex(docs => docs.type === doc.type);
          // console.log('OtherDoc? ' + (index > -1));
          try {
            if (index > -1) {
              this.docsAsea[index].docFile = doc;
            } else {
              index = this.otherDocsAsea.findIndex(docs => docs.type === doc.type);
              this.otherDocsAsea[index].docFile = doc;
            }
          } catch (e) {
            console.log({'Error al cargar el documento': doc});
          }
        }
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }

  private listCreDocs(response: any): void {
    if (response.code === HttpResponseCodes.OK) {
      this.docsCre = [
        {name: 'Resultado del laboratorio 1er semestre', type: 3},
        {name: 'Resultado del laboratorio 2do semestre', type: 4},
        {name: 'Seguro de responsabilidad civil vigente', type: 5},
        {name: 'Número de permiso de la CRE', type: 6},
        {name: 'Reporte de frecuencia de los muestreos y registros de las especificaciones', type: 7},
        {name: 'Informe de Calidad de los Petrolíferos', type: 8},
        {name: 'Remisiones de producto', type: 9},
        {name: 'Bitácora de recepción y descarga de autotanques', type: 10},
        {name: 'Número de permiso de la CRE', type: 11},
        {name: 'Bitácora de aditivación', type: 12},
        {name: 'Especificaciones técnicas del aditivo', type: 13}
      ];
      this.otherDocsCre = [
        {name: 'Estructura de Capital', type: 14},
        {name: 'Pago de supervisión anual', type: 15},
        {name: 'Pago de DPAS', type: 16},
        {name: 'Información estadística trimestral', type: 17},
        {name: 'Procedencia del producto', type: 18},
        {name: 'Reporte de quejas', type: 19},
        {name: 'Reporte de incidencias', type: 20},
        {name: 'Dictamen NOM-016', type: 21},
        {name: 'Sistema de gestión de mediciones', type: 22},
        {name: 'SIRETRAC', type: 23}
      ];
      if (response.items) {
        for (const doc of response.items) {
          try {
            let index = this.docsCre.findIndex(docs => docs.type === doc.type);
            if (index > -1) {
              // console.log(doc);
              this.docsCre[index].docFile = doc;
            } else {
              // console.log(doc);
              index = this.otherDocsCre.findIndex(docs => docs.type === doc.type);
              this.otherDocsCre[index].docFile = doc;
            }
          } catch (e) {
          console.log({'Error al cargar el documento': doc});
          }
        }
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }
  private listProCiv(response: any) {
    if (response.code === HttpResponseCodes.OK) {
      this.docsProCiv = [
        {name: 'Acta Constitutiva', type: 1},
        {name: 'Identificación oficial', type: 2},
        {name: 'RFC', type: 3},
        {name: 'Poder notarial', type: 4},
        {name: 'Póliza de Seguros vigente', type: 5},
        {name: 'Factura y Carta Responsiva Extinguidores', type: 6},
        {name: 'Listado de personal (nombre/dirección/teléfono/puesto)', type: 7},
        {name: 'Planos arquitectónicos', type: 8},
        {name: 'Inicio de operaciones', type: 9},
        {name: 'Dictamen estructural vigente', type: 10},
        {name: 'Dictamen eléctrico vigente', type: 11},
        {name: 'Pruebas de hermeticidad vigentes', type: 12}
      ];
      if (response.items) {
        for (const doc of response.items) {
          try {
            const index = this.docsProCiv.findIndex(docs => docs.type === doc.type);
            this.docsProCiv[index].docFile = doc;
          } catch (e) {
            console.log({'Error al cargar el documento': doc});
          }
        }
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }
  private listStps(response: any) {
    if (response.code === HttpResponseCodes.OK) {
      this.docsStps = [
        {name: 'NOM-001-STPS-2008 Instalaciones  de estaciones de servicio', type: 1},
        {name: 'NOM-002-STPS-2010 Seguridad y prevención contra incendios', type: 2},
        {name: 'NOM-005-STPS-1998 Manejo de sustancias químicas', type: 3},
        {name: 'NOM-006-STPS-2014 Almacenamiento de materiales', type: 4},
        {name: 'NOM-009-STPS-2011 Trabajos en alturas', type: 5},
        {name: 'NOM-017-STPS-2008 Equipo de protección al personal', type: 6},
        {name: 'NOM-018-STPS-2015 Identificación y Comunicación de sustancias químicas', type: 7},
        {name: 'NOM-019-STPS-2011 Condiciones de Seguridad e higiene ', type: 8},
        {name: 'NOM-020-STPS-2011 Recipientes sujetos a presión ', type: 9},
        {name: 'NOM-022-STPS-2008 Electricidad estática', type: 10},
        {name: 'NOM-025-STPS-2008 Estudios de iluminación', type: 11},
        {name: 'NOM-029-STPS-2011 Condiciones de electricidad', type: 12},
        {name: 'NOM-030-STPS-2009 Seguridad y Salud en el trabajo', type: 13},
        {name: 'NOM-035-STPS-2018, Factores de riesgo psicosocial en el trabajo', type: 14},
        {name: 'Reglamento interno de trabajo', type: 15},
        {name: 'Contratos', type: 16}
      ];
      if (response.items) {
        for (const doc of response.items) {
          try {
            const index = this.docsStps.findIndex(docs => docs.type === doc.type);
            this.docsStps[index].docFile = doc;
          } catch (e) {
            console.log({'Error al cargar el documento': doc});
          }
        }
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }
  private listProfeco(response: any) {
    if (response.code === HttpResponseCodes.OK) {
      this.docsProfeco = [
        {name: 'NOM-005-SCFI-2011 Instrumentos de medición', type: 1},
        {name: 'NOM-185-SCFI-2012 Sistemas eléctricos', type: 2},
        {name: 'Dictamen de calibración', type: 3},
        {name: 'Último expediente de verificación PROFECO', type: 4},
        {name: 'Aprobación modelo prototipo de dispensarios', type: 5},
        {name: 'Certificación de dispensarios', type: 6},
        {name: 'Autorización cambio de software', type: 7},
        {name: 'Certificación componentes eléctricos de dispensarios', type: 8},
        {name: 'Aviso de monitoreo y control a distancia', type: 9},
        {name: 'Bitácoras de aperturas', type: 10},
        {name: 'Contrato venta de primera mano', type: 11},
        {name: 'Factura dispensarios', type: 12}
      ];
      this.otherDocsProfecoTitles = [
        'PRUEBA 80 SEGUNDOS',
        'BATERIA DE RESPALDO 5 MIN',
        'SELLOS DE CALIBRACIÓN',
        'CERO FUGAS',
        'CALCOMANIAS PRODUCTO',
        'DISPLAYS DE VENTA Y PRECIO',
        'PISTOLAS MEMBRANA PRESETS',
        'DISPENSARIOS',
        'BITÁCORAS DE APERTURA'
      ];
      this.otherDocsProfeco = [
        {name: 'Se despacha y sin colgar la pistola en 80 segundos se vuelve a disparar, ' +
            'si despacha quiere decir que no cumple, si no despacha quiere decir que sí cumple.', type: 13},
        {name: 'Se apagan los dispensarios por 5 minutos y al encenderlos la configuración debe de ser la misma, ' +
            'precios, ultimo despacho.', type: 21},
        {name: 'Los sellos de calibración deben estar intactos, mica protectora colocada, ' +
            'debe de contar con los sellos de las 2 últimas calibraciones (AÑO).', type: 14},
        {name: 'No debe de haber ni una sola fuga en destorcedores, pistolas, fundas, mangueras, ' +
            'interior dispensarios, cero fugas.', type: 15},
        {name: 'Las calcomanías que indiquen tipo de combustible deben de estar en buen estado.', type: 16},
        {name: 'Los display de venta y precios deben de tener su foco en buen estado, siempre encendido.', type: 17},
        {name: 'Todas las pistolas y membranas o presets deben estar en función al 100 %.', type: 18},
        {name: 'Los dispensarios deben estar despachando correctamente litros completos.', type: 19},
        {name: 'Todas las aperturas de dispensario deben de estar registradas con orden de serviciO ' +
            'que la respalde, registrar cambios de precio y cambios de programación.', type: 20}
      ];
      if (response.items) {
        for (const doc of response.items) {
          try {
            let index = this.docsProfeco.findIndex(docs => docs.type === doc.type);
            if (index > -1) {
              this.docsProfeco[index].docFile = doc;
            } else {
              index = this.otherDocsProfeco.findIndex(docs => docs.type === doc.type);
              this.otherDocsProfeco[index].docFile = doc;
            }
          } catch (e) {
            console.log({'Error al cargar el documento': doc});
          }
        }
      }
    } else {
      this._snackBarService.setMessage('No se ha podido acceder, intente más tarde', 'OK', 3000);
      this._router.navigate(['/home']).then();
    }
  }

  public loadNewOtherDocument(ev: UserMedia, update?: OtherDocument): void {
    if (!ev || !ev.blob) {
      return;
    }
    this._dialog.withInput('Información', 'Asigne un nombre al documento', {
      placeholder: 'Nombre',
      accept: 'ACEPTAR',
      cancel: 'CANCELAR'
    }).afterClosed().subscribe((response: DialogResponse) => {
      if (response && response.code === 'ACCEPT') {
        if (update) {
          this.removeOtherDocumentFromList(update);
        }
        this.uploadNewDocument(ev, response.data.value);
      }
    });
  }

  public updateOtherDocument(ev: UserMedia, source: OtherDocument): void {
    if (!ev || !ev.blob) {
      this.removeOtherDocumentFromList(source);
      this.updateOtherDocumentsList().subscribe((response: EntityResponse<OtherDocStation>) => {
        if (response.code === HttpResponseCodes.OK) {
          this._snackBarService.setMessage('Lista actualizada', 'OK', 2000);
        }
      });
    } else {
      this.loadNewOtherDocument(ev, source);
    }
  }

  public uploadFile(event: UserMedia, index: number, regulationType: number, type: number, otherDocs?: boolean) {
    this._documentData = new FormData();
    const rTypeName = function(rtype: number): string {
      switch (rtype) {
        case 1:
          return 'ASEA-';
        case 2:
          return 'CRE-';
        case 3:
          return 'PROCIV-';
        case 4:
          return 'STPS-';
        case 5:
          return 'PROFECO-';
      }
    };
    this._documentData.append('path', this.stationId);
    this._documentData.append('fileName', rTypeName(regulationType) + new Date().getTime() + '.pdf');
    this._documentData.append('file', event.blob);
    let id: string;
    if (regulationType === 1) {
      if (this.docsAsea[index].docFile && !otherDocs) {
        id = this.docsAsea[index].docFile.id;
      } else if (this.otherDocsAsea[index].docFile && otherDocs) {
        id = this.otherDocsAsea[index].docFile.id;
      }
    } else if (regulationType === 2 && !otherDocs) {
      if (this.docsCre[index].docFile && !otherDocs) {
        id = this.docsCre[index].docFile.id;
      } else if (this.otherDocsCre[index].docFile && otherDocs) {
        id = this.otherDocsCre[index].docFile.id;
      }
    } else if (regulationType === 3 && this.docsProCiv[index].docFile) {
      id = this.docsProCiv[index].docFile.id;
    } else if (regulationType === 4 && this.docsStps[index].docFile) {
      id = this.docsStps[index].docFile.id;
    } else if (regulationType === 5) {
      if (this.docsProfeco[index].docFile && !otherDocs) {
        id = this.docsProfeco[index].docFile.id;
      } else if (this.otherDocsProfeco[index].docFile && otherDocs) {
        id = this.otherDocsProfeco[index].docFile.id;
      }
    }
    this.chargeFile({
      id: id,
      regulationType: regulationType,
      formData: this._documentData,
      type: type,
      index: index,
      otherDocs: otherDocs
    });
  }

  private chargeFile(file: any) {
    const newFile: Document = {
      id: file.id ? file.id : null,
      regulationType: file.regulationType,
      idStation: this.stationId,
      file: null,
      type: file.type
    };
    this._uploadFile.upload(file.formData).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        newFile.file = {
          blobName: response.item.blobName,
          thumbnail: response.item.thumbnail
        };
        switch (file.regulationType) {
          case 1:
            if (!file.otherDocs) {
              if (this.docsAsea[file.index].docFile) {
                this.updateStationDocument(newFile, file.index);
              } else {
                this.createStationDocument(newFile, file.index);
              }
            } else {
              if (this.otherDocsAsea[file.index].docFile) {
                this.updateStationDocument(newFile, file.index, file.otherDocs);
              } else {
                this.createStationDocument(newFile, file.index, file.otherDocs);
              }
            }
            break;
          case 2:
            if (!file.otherDocs) {
              if (this.docsCre[file.index].docFile) {
                this.updateStationDocument(newFile, file.index);
              } else {
                this.createStationDocument(newFile, file.index);
              }
            } else {
              if (this.otherDocsCre[file.index].docFile) {
                this.updateStationDocument(newFile, file.index, file.otherDocs);
              } else {
                this.createStationDocument(newFile, file.index, file.otherDocs);
              }
            }
            break;
          case 3:
            if (this.docsProCiv[file.index].docFile) {
              this.updateStationDocument(newFile, file.index);
            } else {
              this.createStationDocument(newFile, file.index);
            }
            break;
          case 4:
            if (this.docsStps[file.index].docFile) {
              this.updateStationDocument(newFile, file.index);
            } else {
              this.createStationDocument(newFile, file.index);
            }
            break;
          case 5:
            if (!file.otherDocs) {
              if (this.docsProfeco[file.index].docFile) {
                this.updateStationDocument(newFile, file.index);
              } else {
                this.createStationDocument(newFile, file.index);
              }
            } else {
              if (this.otherDocsProfeco[file.index].docFile) {
                this.updateStationDocument(newFile, file.index, file.otherDocs);
              } else {
                this.createStationDocument(newFile, file.index, file.otherDocs);
              }
            }
            break;
        }
      } else {
        this._snackBarService.setMessage('Error al generar el documento', 'OK', 3000);
      }
    });
  }

  private createStationDocument(document: Document, index: number, otherDocs?: boolean): void {
    const doc: Document = {
      id: document.id,
      type: document.type,
      regulationType: document.regulationType,
      idStation: document.idStation,
      file: document.file
    };
    this._api.createDocument(doc).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.setMessage('Documento cargado', 'OK', 3000);
        this.updateListDocs(doc, index, otherDocs);
      } else {
        this._snackBarService.setMessage('Error al cargar el documento', 'OK', 3000);
      }
    });
  }

  private updateStationDocument(document: Document, index: number, otherDocs?: boolean): void {
    const doc: Document = {
      id: document.id,
      type: document.type,
      regulationType: document.regulationType,
      idStation: document.idStation,
      file: document.file
    };
    this._api.updateDocument(doc).subscribe(response => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.setMessage('Documento actualizado', 'OK', 3000);
        this.updateListDocs(doc, index, otherDocs);
      } else {
        this._snackBarService.setMessage('Error al actualizar el documento', 'OK', 3000);
      }
    });
  }
  private updateListDocs(doc: Document, index: number, otherDocs?: boolean) {
    switch (doc.regulationType) {
      case 1:
        if (!otherDocs) {
          this.docsAsea[index].docFile = doc;
        } else {
          this.otherDocsAsea[index].docFile = doc;
        }
        break;
      case 2:
        if (!otherDocs) {
          this.docsCre[index].docFile = doc;
        } else {
          this.otherDocsCre[index].docFile = doc;
        }
        break;
      case 3:
        this.docsProCiv[index].docFile = doc;
        break;
      case 4:
        this.docsStps[index].docFile = doc;
        break;
      case 5:
        if (!otherDocs) {
          this.docsProfeco[index].docFile = doc;
        } else {
          this.otherDocsProfeco[index].docFile = doc;
        }
        break;
    }
  }

  public closeDocumentation(): void {
    this._router.navigate(['/home/profile/gas-station', this.stationId]).then();
  }

  public openOtherPdf(url: string): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    const download = user.role === 1 || user.role === 2 || user.role === 4 || user.role === 7;
    this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url), hideDownload: !download});
  }


  public openPdf(index: number, isAsea: boolean): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    const url = isAsea ? this.docsAsea[index].docFile.file.thumbnail : this.docsCre[index].docFile.file.thumbnail;
    const download = user.role === 1 || user.role === 2 || user.role === 4 || user.role === 7;
    this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url), hideDownload: !download});
  }

  public openPdf2(doc: FileCS): void {
    const user = LocalStorageService.getItem<Person>(Constants.UserInSession);
    const url = doc.thumbnail;
    const download = user.role === 1 || user.role === 2 || user.role === 4 || user.role === 7;
    this._pdf.open({urlOrFile: HashService.set('123456$#@$^@1ERF', url), hideDownload: !download});
  }

  private uploadNewDocument(media: UserMedia, name: string): void {
    const form = new FormData();
    form.append('path', this.stationId);
    form.append('fileName', `${name.replace(/ /g, '-')}.pdf`);
    form.append('file', media.blob, `${name.replace(/ /g, '-')}.pdf`);
    this._uploadFile.upload(form).pipe(
      switchMap((files: EntityResponse<FileCS>) =>
        this.updateOtherDocumentsList(name, files))).subscribe((response: EntityResponse<OtherDocStation>) => {
      if (response.code === HttpResponseCodes.OK) {
        this._snackBarService.setMessage('Archivo agregado', 'OK', 2000);
      }
    });
  }

  private updateOtherDocumentsList(name?: string, response?: EntityResponse<FileCS>): Observable<EntityResponse<OtherDocStation>> {
    const newList = this.othersDocuments;
    if (name && response) {
      newList.push({
        name: name,
        fileCS: response.item
      });
    }
    return this._api.saveOtherDocStation({
      id: this.stationId,
      otherDocuments: newList
    });
  }

  private removeOtherDocumentFromList(source: OtherDocument): void {
    const i = this.othersDocuments.indexOf(source);
    if (i > -1) {
      this.othersDocuments.splice(i, 1);
    }
  }
}
