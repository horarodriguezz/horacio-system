import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";
import { ListItem } from "./ListItem";

export default function Sidebar() {
  return (
    <aside className='fixed left-0 top-0 w-[250px] h-full bg-white shadow-lg py-8'>
      <div className='w-full flex justify-center mb-2'>
        <Image src={"/logo.png"} alt='logo' width={50} height={50} />
      </div>
      <h2 className='text-center font-semibold text-lg mb-4'>Horacio System</h2>
      <ul className='flex flex-col w-full'>
        <ListItem
          href='/credit-cards'
          icon={faCreditCard}
          text={"Tarjetas de credito"}
        />
      </ul>
    </aside>
  );
}
