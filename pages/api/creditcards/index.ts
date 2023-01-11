import { NextApiRequest, NextApiResponse } from "next";
import CreditCardController from "../../../controllers/backend/CreditCardController";
import CreditCardService from "../../../services/creditcardService";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const creditCardService = new CreditCardService();
  const creditCardController = new CreditCardController(
    req,
    res,
    creditCardService
  );

  try {
    if (req.method === "POST") return creditCardController.read();

    return res.status(404);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

export default handler;
