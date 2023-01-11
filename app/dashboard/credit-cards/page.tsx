"use client";
import FileInput from "../../../components/FileInput";
import Title from "../../../components/TItle";
import CreditCardController from "../../../controllers/frontend/CreditCardController";

export default function Page() {
  const creditCardController = new CreditCardController();

  const onChange = async (file: File) => {
    creditCardController.readFirstDataPdf(file);
  };

  return (
    <>
      <Title title={"Conversor de resumenes de tarjetas de credito"} />
      <p className='text-lg text-gray-800 px-8 w-3/4 mb-6'>
        Arrastra el resumen de la tarjeta que deseas convertir a excel con todas
        sus deducciones, actualmente podes convertir resumenes de las tarjetas
        de Payway y Fiserv.
      </p>
      <div className='w-full flex items-center px-8'>
        <div className='w-full h-[300px] max-w-md'>
          <FileInput onChange={onChange} />
        </div>
      </div>
    </>
  );
}
