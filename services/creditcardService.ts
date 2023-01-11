import pdfParser from "pdf-parse";
import fs from "fs";
import {
  FirstDataDailySummary,
  FirstDataDayByDaySummary,
  FirstDataMonthlySummary,
  FirstDataParsedData,
  PossibleConcept,
} from "../types/FirstData";

const FECHA_SPLITTER = "el día";
const FECHA_LENGTH = 10;
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
    let day: FirstDataDailySummary = {};
    const dayByDaySummary: FirstDataDayByDaySummary = [];

    lines.forEach((line) => {
      if (line.match(PossibleConcept.IVA105) && line.includes("10,50%")) {
        const iva105 = parseFloat(this.getAmount(line));

        day.iva105 = iva105;
        day.comision105 = iva105 / 0.105;
      }

      if (line.includes(PossibleConcept.IVA21) && line.includes("21,00%")) {
        const iva21 = parseFloat(this.getAmount(line));

        day.iva21 = iva21;
        day.comision21 = iva21 / 0.21;
      }

      if (line.match(PossibleConcept.PERIIBB)) {
        day.perIIBB = parseFloat(this.getAmount(line));
      }

      if (line.match(PossibleConcept.RETIIBB)) {
        day.retIIBB = parseFloat(this.getAmount(line));
      }

      if (line.match(PossibleConcept.PERIVA)) {
        day.perIVA = parseFloat(this.getAmount(line));
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
    monthlySummary.iva105 = this.getIVA105(lines);
    monthlySummary.iva21 = this.getIVA21(lines);
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
      .then((data) => {
        const result = this.parsePdfData(data.text);
        return result;
      })
      .catch((error) => Promise.reject(error.message));
  }
}
