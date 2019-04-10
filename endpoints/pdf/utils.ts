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

export enum TypeFuel {
  MAGNA = 1,
  PREMIUM = 2,
  DIESEL = 3
}

export enum AttachedType{
  Cover = 0,
  Attached_1 = 1,
  Attached_2 = 2,
  Attached_3 = 3,
  Signatures = 6,
  Cover_Attached = 7
}

export enum ReportType{
  Report_1 = 11,
  Report_2 = 12,
  Report_3 = 13,
  Report_4 = 14,
  Report_5 = 15,
  Report_6 = 16,
  Report_7 = 17,
  Report_8 = 18,
  Report_9 = 19
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
}

export interface JoinPdfData{
  stationId: string,
  isSGM: boolean
}
