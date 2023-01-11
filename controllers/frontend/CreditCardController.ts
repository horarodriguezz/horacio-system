import HttpService from "../../services/frontend/httpService";
import { FirstDataParsedData } from "../../types/FirstData";

export default class CreditCardController {
  private httpService;

  constructor() {
    this.httpService = new HttpService();
  }

  public async readFirstDataPdf(
    pdf: File
  ): Promise<{ status: number | undefined; data?: FirstDataParsedData }> {
    const formData = new FormData();

    formData.append("file", pdf);

    try {
      const response = await this.httpService.post({
        url: "/creditcards/firstdata",
        body: formData,
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      return { status: response?.status, data: response?.data };
    } catch (error) {
      console.log(error);
      return { status: 500, data: undefined };
    }
  }
}
