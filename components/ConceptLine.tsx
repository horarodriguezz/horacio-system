import { UIConcepts } from "../types/FirstData";

interface ConceptLineProps {
  keyName: string;
  value: any;
}

export default function ConceptLine(conceptLineProps: ConceptLineProps) {
  const { keyName, value } = conceptLineProps;

  const getKeyName = () => {
    switch (keyName) {
      case UIConcepts.COMISION21:
        return "Comision 21%";
      case UIConcepts.COMISION105:
        return "Comision 10,5%";
      case UIConcepts.IVA21:
        return "IVA 21%";
      case UIConcepts.IVA105:
        return "IVA 10,5%";
      case UIConcepts.PERIIBB:
        return "Percepciones IIBB";
      case UIConcepts.RETIIBB:
        return "Retenciones IIBB";
      case UIConcepts.PERIVA:
        return "Percepciones IVA";
      default:
        break;
    }
  };

  const parseValue = (valueToParse: string) => {
    const indexOfPoint = valueToParse.indexOf(".");

    return `$ ${valueToParse.slice(0, indexOfPoint + 3)}`;
  };

  return (
    <div className='flex items-center gap-2 w-full'>
      <span className='w-2/5 font-medium'>{getKeyName()}:</span>
      <span>{parseValue(`${value}`)}</span>
    </div>
  );
}
