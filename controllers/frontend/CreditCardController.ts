import HttpService from "../../services/frontend/httpService";

export default class CreditCardController {
  private httpService;

  constructor() {
    this.httpService = new HttpService();
  }

  public async readFirstDataPdf(pdf: File) {
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

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
