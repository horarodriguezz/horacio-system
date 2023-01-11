import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import CreditCardService from "../../services/creditcardService";
import { FirstDataParsedData } from "../../types/FirstData";

export default class CreditCardController {
  private request;
  private response;
  private service;

  constructor(
    req: NextApiRequest,
    res: NextApiResponse,
    service: CreditCardService
  ) {
    this.request = req;
    this.response = res;
    this.service = service;
  }

  public async read() {
    const form = formidable();

    form.parse(this.request, (err, fields, files) => {
      if (err)
        return this.response.status(500).json({
          message:
            "Ha ocurrido un error al leer el pdf. Por favor intente nuevamente mas tarde.",
        });

      this.service
        .pdfToData(files.file)
        .then((res) => {
          this.response.status(200).json(res);
        })
        .catch((e) => {
          console.log(e);
          return this.response.status(500).json({
            message:
              "Ha ocurrido un error al leer el pdf. Por favor intente nuevamente mas tarde.",
          });
        });
    });
  }
}
