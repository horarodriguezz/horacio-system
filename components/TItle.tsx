interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <h1 className='text-xl font-bold px-8 py-4 bg-white text-gray-800 shadow-sm mb-8'>
      {title}
    </h1>
  );
}
