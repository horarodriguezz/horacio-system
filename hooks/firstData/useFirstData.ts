import { useCallback, useState } from "react";
import CreditCardController from "../../controllers/frontend/CreditCardController";

export default function useFirstData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  const post = useCallback(
    (file: File) => {
      const creditCardController = new CreditCardController();
      setIsLoading(true);

      creditCardController
        .readFirstDataPdf(file)
        .then((res) => {
          if (res.data) {
            setData(res.data);
          } else {
            setError("Ha ocurrido un error al leer el pdf.");
          }
        })
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    },
    [setIsLoading, setData]
  );

  return { isLoading, data, error, post };
}
