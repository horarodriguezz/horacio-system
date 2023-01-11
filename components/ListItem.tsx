import Link from "next/link";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ListItemProps {
  icon: IconProp;
  text: string;
  href: string;
}

export const ListItem = (listItemProps: ListItemProps) => {
  const { icon, text, href } = listItemProps;

  return (
    <li className='px-4 py-2 text-gray-800 hover:cursor-pointer hover:bg-slate-100 transition-all'>
      <Link href={href} className='flex items-center gap-2'>
        <span className='flex-grow whitespace-nowrap overflow-hidden'>
          {text}
        </span>
        <div className='w-4 h-auto'>
          <FontAwesomeIcon icon={icon} className='w-4 h-auto' />
        </div>
      </Link>
    </li>
  );
};
