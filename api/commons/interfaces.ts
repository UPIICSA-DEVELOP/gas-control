import {AttachedType, ReportType} from './enum';

export interface PDFSASISOPAData {
  stationId: string,
  stationRFC: string,
  businessName: string,
  date: number,
  sasisopaTemplates: any[],
  listTanks: any[],
  listCollaborators: any[],
  listBrigade: any[],
  listTasks: any[],
  listProcedures: any[],
  sasisopaDocuments: any[]
}

export interface PDFSGMData{
  stationId: string,
  businessName: string,
  crePermission: string,
  address: string,
  rfc: string,
  date: number,
  sgmSelection: any,
  proceduresList: any[],
  taskListAnnexed1: any[],
  taskListAnnexed2: any[],
  sgmDocuments: any[]
}

export interface ParseHTMLOptions{
  option: AttachedType | ReportType,
  fileName: string,
  path: string,
  titleCoverAttached?: any,
  task?: any
}

export interface CreatePDFOptions{
  option: AttachedType | ReportType,
  titleCoverAttached?: any,
  task?: any
}

export interface PdfData{
  stationId: string,
  isSGM?: boolean
}

export interface BCData{
  name: string,
  lastName: string,
  workPosition: string,
  countryCode: string,
  phone: string,
  email: string,
  company: string,
  industryCode: number | string,
  website: string,
  profileImage: string,
  profileImageThumbnail: string,
  cardUrl: string,
  cardUrlThumbnail: string
  bCardId: string
}

export interface JoinPdfData{
  stationId: string,
  isSGM: boolean
}
