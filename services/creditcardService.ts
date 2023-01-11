import pdfParser from "pdf-parse";
import fs from "fs";

interface FirstDataLiquidationDay {
  comision21: number;
  iva21: number;
  comision105: number;
  iva105: number;
  perIIBB: number;
  retIIBB: number;
  perIVA: number;
}

enum PossibleConcept {
  IVA21 = "IVA CRED.FISC.",
  IVA212 = "IVA RI CRED.FISC",
  IVA105 = "IVA CRED.FISC.",
  PERIIBB = "PER B.A.",
  RETIIBB = "RETENCION ING.BRUTOS",
  PERIVA = "PERCEPCION IVA",
}

export default class CreditCardService {
  constructor() {}

  private getIVA105(data: string): number {
    const lines = data.split("\n");
    let arrayOfIVA105 = 0;

    lines.forEach((line) => {
      if (line.match(PossibleConcept.IVA105) && line.includes("10,50%")) {
        const amount = line.split("$")[1].replace(/\./g, "").replace(",", ".");

        arrayOfIVA105 += parseFloat(amount);
      }
    });

    return arrayOfIVA105;
  }

  private getIVA21(data: string): number {
    const lines = data.split("\n");
    let arrayOfIVA21 = 0;

    lines.forEach((line) => {
      if (line.includes(PossibleConcept.IVA21) && line.includes("21,00%")) {
        const amount = line.split("$")[1].replace(/\./g, "").replace(",", ".");

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

  private getConcept(data: string, concept: PossibleConcept): number {
    const lines = data.split("\n");
    let arrayOfConcept = 0;

    lines.forEach((line) => {
      if (line.match(concept)) {
        const amount = line.split("$")[1].replace(/\./g, "").replace(",", ".");

        arrayOfConcept += parseFloat(amount);
      }
    });

    return arrayOfConcept;
  }

  private parsePdfData(data: string): FirstDataLiquidationDay {
    const iva105 = this.getIVA105(data);
    const iva21 = this.getIVA21(data);
    const perIIBB = this.getConcept(data, PossibleConcept.PERIIBB);
    const retIIBB = this.getConcept(data, PossibleConcept.RETIIBB);
    const perIVA = this.getConcept(data, PossibleConcept.PERIVA);

    return {
      iva21,
      iva105,
      comision105: iva105 / 0.105,
      comision21: iva21 / 0.21,
      perIIBB,
      retIIBB,
      perIVA,
    };
  }

  public pdfToData(file: any) {
    const jsonFile = file.toJSON();

    const bufferFile = fs.readFileSync(jsonFile.filepath);

    pdfParser(bufferFile)
      .then((data) => {
        const result = this.parsePdfData(data.text);
        console.log(result);
      })
      .catch((error) => console.log(error));
  }
}
