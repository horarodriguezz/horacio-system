export interface FirstDataDailySummary extends FirstDataMonthlySummary {
  fecha?: string;
}

export type FirstDataDayByDaySummary = FirstDataDailySummary[];

export interface FirstDataMonthlySummary {
  comision21?: number;
  iva21?: number;
  comision105?: number;
  iva105?: number;
  perIIBB?: number;
  retIIBB?: number;
  perIVA?: number;
}

export interface FirstDataParsedData {
  daily: FirstDataDayByDaySummary;
  monthly: FirstDataMonthlySummary;
}

export enum PossibleConcept {
  IVA21 = "IVA CRED.FISC.",
  IVA212 = "IVA RI CRED.FISC",
  IVA105 = "IVA CRED.FISC.",
  PERIIBB = "PER B.A.",
  RETIIBB = "RETENCION ING.BRUTOS",
  PERIVA = "PERCEPCION IVA",
  FECHA = "ACRED.EN CTA.CTE.NRO:",
}

export enum UIConcepts {
  IVA21 = "iva21",
  COMISION21 = "comision21",
  IVA105 = "iva105",
  COMISION105 = "comision105",
  PERIIBB = "perIIBB",
  RETIIBB = "retIIBB",
  PERIVA = "perIVA",
}
