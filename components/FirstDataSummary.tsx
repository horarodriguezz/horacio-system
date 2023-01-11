import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveAs } from "file-saver";
import { FirstDataMonthlySummary } from "../types/FirstData";
import ConceptLine from "./ConceptLine";

interface FirstDataSummary {
  data: FirstDataMonthlySummary;
  url: string;
}

export default function FirstDataSummary({ data, url }: FirstDataSummary) {
  const onClickHandler = () => {
    saveAs(url, "FirstDataResumen.xlsx");
  };

  return (
    <div className='w-full min-h-[300px] flex flex-col items-start ml-8'>
      <p className='text-xl font-bold mb-4'>Resumen Mensual</p>
      {Object.keys(data).map((key, index) => (
        <ConceptLine key={key} keyName={key} value={data[key]} />
      ))}
      <button
        onClick={onClickHandler}
        className='px-4 py-2 mt-4 border border-transparent flex items-center gap-2 font-bold rounded-md bg-green-400 text-white text-sm hover:cursor-pointer hover:scale-105 transition-all'
      >
        Descargar Excel <FontAwesomeIcon icon={faDownload} />
      </button>
    </div>
  );
}
