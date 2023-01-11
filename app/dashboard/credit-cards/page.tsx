"use client";
import FileInput from "../../../components/FileInput";
import Title from "../../../components/TItle";
import useFirstData from "../../../hooks/firstData/useFirstData";
import FirstDataSummary from "../../../components/FirstDataSummary";
export default function Page() {
  const { error, data, isLoading, post: parsePdf } = useFirstData();

  const onChange = async (file: File) => {
    parsePdf(file);
  };

  return (
    <>
      <Title title={"Conversor de resumenes de tarjetas de credito"} />
      <p className='text-lg text-gray-800 px-8 w-3/4 mb-6'>
        Arrastra el resumen de la tarjeta que deseas convertir a excel con todas
        sus deducciones, actualmente podes convertir resumenes de las tarjetas
        de Payway y Fiserv.
      </p>
      <div className='w-full flex items-center justify-between px-8'>
        <div className='w-full h-[300px] max-w-md'>
          <FileInput onChange={onChange} />
        </div>
        {data && !isLoading && (
          <FirstDataSummary data={data.monthly} url={data.excelUrl} />
        )}
      </div>
    </>
  );
}
