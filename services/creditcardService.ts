import pdfParser from "pdf-parse";
import fs from "fs";
import ExcelJS from "exceljs";

import {
  FirstDataDailySummary,
  FirstDataDayByDaySummary,
  FirstDataMonthlySummary,
  FirstDataParsedData,
  PossibleConcept,
} from "../types/FirstData";
import path from "path";

const FECHA_SPLITTER = "el día";
const FECHA_LENGTH = 10;
const EXCEL_DEFAULT_NAME = "FirstDataMensual.xlsx";
export default class CreditCardService {
  constructor() {}

  private getAmount(line: string): string {
    return line.split("$")[1].replace(/\./g, "").replace(",", ".");
  }

  private getIVA105(lines: string[]): number {
    let arrayOfIVA105 = 0;

    lines.forEach((line) => {
      if (line.match(PossibleConcept.IVA105) && line.includes("10,50%")) {
        const amount = this.getAmount(line);

        arrayOfIVA105 += parseFloat(amount);
      }
    });

    return arrayOfIVA105;
  }

  private getIVA21(lines: string[]): number {
    let arrayOfIVA21 = 0;

    lines.forEach((line) => {
      if (line.includes(PossibleConcept.IVA21) && line.includes("21,00%")) {
        const amount = this.getAmount(line);

        arrayOfIVA21 += parseFloat(amount);
      } else {
        if (line.includes(PossibleConcept.IVA212)) {
          const amount = line
            .split("$")[1]
            .replace(/\./g, "")
            .replace(",", ".");

          arrayOfIVA21 += parseFloat(amount);
        }
      }
    });

    return arrayOfIVA21;
  }

  private getConcept(lines: string[], concept: PossibleConcept): number {
    let arrayOfConcept = 0;

    lines.forEach((line) => {
      if (line.match(concept)) {
        const amount = this.getAmount(line);

        arrayOfConcept += parseFloat(amount);
      }
    });

    return arrayOfConcept;
  }

  private dateByDate(lines: string[]): FirstDataDayByDaySummary {
    let day: any = {};
    const dayByDaySummary: FirstDataDayByDaySummary = [];

    lines.forEach((line) => {
      if (line.match(PossibleConcept.IVA105) && line.includes("10,50%")) {
        const iva105 = parseFloat(this.getAmount(line));

        day.iva105 =
          day.iva105 && day.iva105 >= 0 ? day.iva105 + iva105 : iva105;
        day.comision105 =
          day.comision105 && day.comision105 >= 0
            ? day.comision105 + iva105 / 0.105
            : iva105 / 0.105;
      }

      if (line.includes(PossibleConcept.IVA21) && line.includes("21,00%")) {
        const iva21 = parseFloat(this.getAmount(line));
        day.iva21 = iva21;
        day.comision21 = iva21 / 0.21;
      }

      if (line.includes(PossibleConcept.IVA212)) {
        const iva21 = parseFloat(this.getAmount(line));
        day.iva21 = day.iva21 && day.iva21 >= 0 ? day.iva21 + iva21 : iva21;
        day.comision21 =
          day.comision21 && day.comision21 >= 0
            ? day.comision21 + iva21 / 0.21
            : iva21 / 0.21;
      }

      if (line.match(PossibleConcept.PERIIBB)) {
        day.perIIBB =
          day.perIIBB && day.perIIBB >= 0
            ? day.perIIBB + parseFloat(this.getAmount(line))
            : parseFloat(this.getAmount(line));
      }

      if (line.match(PossibleConcept.RETIIBB)) {
        day.retIIBB =
          day.retIIBB && day.retIIBB >= 0
            ? day.retIIBB + parseFloat(this.getAmount(line))
            : parseFloat(this.getAmount(line));
      }

      if (line.match(PossibleConcept.PERIVA)) {
        day.perIVA =
          day.perIVA && day.perIVA >= 0
            ? day.perIVA + parseFloat(this.getAmount(line))
            : parseFloat(this.getAmount(line));
      }

      if (line.match(PossibleConcept.FECHA)) {
        const fechaSegment = line.split(FECHA_SPLITTER)[1];
        const fecha = fechaSegment.slice(fechaSegment.length - FECHA_LENGTH);
        day.fecha = fecha;

        dayByDaySummary.push(day);
        day = {};
      }
    });

    return dayByDaySummary;
  }

  private parsePdfData(data: string): FirstDataParsedData {
    const lines = data.split("\n");
    const monthlySummary: FirstDataMonthlySummary = {};

    const iva105 = this.getIVA105(lines);
    monthlySummary.iva105 = iva105;
    monthlySummary.comision105 = iva105 / 0.105;

    const iva21 = this.getIVA21(lines);
    monthlySummary.iva21 = iva21;
    monthlySummary.comision21 = iva21 / 0.21;

    monthlySummary.perIIBB = this.getConcept(lines, PossibleConcept.PERIIBB);
    monthlySummary.retIIBB = this.getConcept(lines, PossibleConcept.RETIIBB);
    monthlySummary.perIVA = this.getConcept(lines, PossibleConcept.PERIVA);

    const dayByDaySummary = this.dateByDate(lines);

    return {
      daily: dayByDaySummary,
      monthly: monthlySummary,
    };
  }

  public pdfToData(file: any) {
    const jsonFile = file.toJSON();

    const bufferFile = fs.readFileSync(jsonFile.filepath);

    return pdfParser(bufferFile)
      .then(async (data) => {
        const result = this.parsePdfData(data.text);
        const url = await this.dataToExcel(result);

        return { ...result, excelUrl: url };
      })
      .catch((error) => Promise.reject(error.message));
  }

  private async dataToExcel(data: FirstDataParsedData): Promise<string> {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Resumen");

    sheet.columns = [
      { header: "Fecha", key: "fecha", width: 16 },
      { header: "Ret IIBB", key: "retIIBB", width: 16 },
      { header: "Per IIBB", key: "perIIBB", width: 16 },
      { header: "Per IVA", key: "perIVA", width: 16 },
      { header: "Comisiones 21%", key: "comision21", width: 16 },
      { header: "IVA 21%", key: "iva21", width: 16 },
      { header: "Comisiones 10,5%", key: "comision105", width: 16 },
      { header: "IVA 10,5%", key: "iva105", width: 16 },
    ];

    data.daily.forEach((day) => sheet.addRow(day));

    await workbook.xlsx.writeFile(`./temp/${EXCEL_DEFAULT_NAME}`);

    return path.join(__dirname, "temp", EXCEL_DEFAULT_NAME);
  }
}
