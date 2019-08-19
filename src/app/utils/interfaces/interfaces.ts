/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

export interface Person {
  id?: string;
  refId: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  role: number;
  jobTitle: string;
  website?: string;
  profileImage?: any;
  signature: any;
  password?: string;
  bCard?: any;
}

export interface PersonInformation {
  id: string;
  bloodType?: string;
  concatcPhone?: string;
  contactKinship?: string;
  contactName?: string;
  ssn?: string;
  benzene?: any;
}

export interface GasStation {
  address: string;
  businessName: string;
  complete?: boolean;
  crePermission?: string;
  dispensers?: Array<Dispensers>;
  doneTasks?: number;
  email: string;
  endPaymentDate?: number;
  folio?: number;
  fuelTanks?: Array<FuelTanks>;
  id?: string;
  idConsultancy: string;
  idLegalRepresentative: string;
  legalRepresentativeName: string;
  location: any;
  monitoringWells?: number;
  name: string;
  observationWells?: number;
  paymentDate?: number;
  phoneNumber: string;
  progress?: number;
  rfc: string;
  stationTaskId?: string;
  totalTasks?: number;
  type: number;
  vapourRecoverySystem: boolean;
  workShifts?: Array<WorkShifts>;
  workers?: number;
}

/**
 * Start: Complement GasStation
 */

export interface WorkShifts {
  start: string;
  end: string;
}

export interface FuelTanks {
  fuelType: number;
  capacity: number;
  year: number;
}

export interface Dispensers {
  hoses: number;
  identifier: string;
  magna: boolean;
  premium: boolean;
  diesel: boolean;
}

/**
 * End: Complement GasStation
 */

export interface Consultancy {
  id?: string;
  businessName: string;
  rfc: string;
  address: string;
  location: any;
  officePhone?: string;
  group: boolean;
}

export interface Document {
  id?: string;
  idStation: string;
  regulationType: number;
  type: number;
  file: any;
}

export interface Task {
  creationDate: number;
  editedTasks: any;
  stationId: string;
  status: number;
  progress: number;
  startDate: number;
}


/**
 * START: TaskReport Formats 1-9
 */

export interface OMReport {
  activityType: string;
  cottonClothes: boolean;
  date: number;
  description?: string;
  endTime: number;
  faceMask: boolean;
  fileCS?: any;
  folio?: number;
  gloves: boolean;
  goggles: boolean;
  helmet: boolean
  hwgReport?: HWGReport;
  id?: number;
  industrialShoes: boolean;
  kneepads: boolean;
  maintenanceType: string;
  name: string;
  observations?: string;
  personnelNames: string[];
  personnelType: string;
  procedures?: number[];
  protectiveGoggles: boolean;
  signature: any;
  startTime: number;
  taskId: number | string;
  toolsAndMaterials?: string;
}

export interface CompressorReport {
  brand?: string;
  controlNumber?: string;
  date: number;
  endTime: number;
  fileCS: any;
  folio?: number;
  hwgReport?: HWGReport;
  id?: number;
  model?: string;
  modifications?: string;
  name: string;
  observations?: string;
  pressure: number;
  purge: string;
  securityValve: string;
  signature: any;
  startTime: number;
  taskId: number | string;
}

export interface HWGReport {
  area: string;
  corrosive: boolean;
  explosive: boolean;
  flammable: boolean;
  quantity: number;
  reactive: boolean;
  temporaryStorage: string;
  toxic: boolean;
  unity: string;
  waste: string
}

export interface VRSReport {
  date: number;
  emergencyStop: string;
  fileCS?: any;
  folio?: number;
  id?: number;
  name : string;
  observations?: string;
  signature: any;
  taskId: number | string;
  vrsAlarm: string;
  vrsDispensary: VRSDispensary;
  vrsTanks: VRSTank[];
}


/**
 * --------------------------------- START: Complement VRSReport ---------------------------------
 */

export interface VRSDispensary {
  breakAway: string;
  diesel?: boolean;
  equipment: string;
  fuelNozzle: string;
  longHose: string;
  magna?: boolean;
  premium?: boolean;
  shortHose: string;
}

export interface VRSTank {
  capAndFillingAdapter: string;
  capAndSteamAdapter: string;
  fuelType: number;
  overfillValve: string;
  vacuumPressureValve: string;
}

/**
 * --------------------------------- END: Complement VRSReport ---------------------------------
 */

export interface ScannedReport {
  date: number;
  fileCS: any;
  folio?: number;
  hwgReport?: HWGReport;
  id?: number;
  name: string;
  signature: any;
  taskId: number | string;
}

export interface HWCReport {
  carrierCompany: string;
  date: number;
  finalDestination: string;
  fileCS?: any;
  folio?: number;
  id?: number;
  manifest?: any;
  manifestNumber?: string;
  name: string;
  nextPhase?: string;
  quantity: number;
  signature: any;
  taskId: number | string;
  unity: string;
  waste: string;
}

export interface FRReport {
  date: number;
  diesel: boolean;
  endTime: number;
  fileCS?: any;
  folio?: number;
  id?: number;
  magna: boolean;
  name: string;
  premium: boolean;
  receiveName: string;
  remission: number;
  remissionNumber: string;
  signature: any;
  startTime: number;
  taskId: number | string;
  volumetric: number;
}

export interface FEReport {
  date: number;
  endTime: number;
  fireExtinguishers: FireExtinguisher[];
  folio?: number;
  id?: number;
  name: string;
  signature: any;
  startTime: number;
  taskId: number | string;
}

/**
 * --------------------------------- START: Complement FEReport ---------------------------------
 */

export interface FireExtinguisher {
  area: string;
  belt: string;
  capacity: number;
  collar: string
  expiration: string;
  hose: string;
  manometer: string;
  safe: string;
  unity?: string;
}

/**
 * --------------------------------- END: Complement FEReport ---------------------------------
 */

export interface IncidenceReport {
  area: string;
  date: number;
  description: string;
  fileCS: any;
  folio?: number;
  id?: number
  name: string;
  procedures?: number[];
  signature: any;
  taskId: number | string;
  time: number;
}

/**
 * END: TaskReport Formats 1-9
 */


export interface SasisopaDocument {
  annexed: number;
  id?: number;
  file: any;
  stationId: number | string;
  type: number;
}

export interface BrigadeElems {
  lastName: string;
  name: string;
  position: string;
}

export interface Brigade {
  id?: number;
  brigadeElems: BrigadeElems[];
}

export interface SgmSelection {
  diesel: boolean;
  id?: string;
  magna: boolean;
  premium: boolean;
  software: string | number;
}

export interface TaskLists {
  todayTasks?: any[];
  previousTasks?: any[];
  historyTasks?: any[];
  scheduleTasks?: any[];
}

export interface Report {
  taskElement: any;
  typeReportView: number;
  reportView: boolean;
  status: number;
}

export interface MDateResponse{
  timeStamp: number,
  fullDate: Date,
  arrayDate: any[];
  dateText: string;
}
