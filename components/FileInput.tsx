"use client";
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

interface FileInputProps {
  onChange: (file: File) => void;
}

export default function FileInput({ onChange }: FileInputProps) {
  const inputRef = useRef<any>();

  const [collectedProps, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    drop(item, monitor: any) {
      onChange(monitor.getItem().files);
    },
  }));

  const onClickHandler = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        className='hidden'
        onChange={onChangeHandler}
      />
      <div
        ref={drop}
        className='w-full h-full border-dashed border-2 rounded-lg border-gray-600 flex flex-col items-center justify-center p-4'
      >
        <p className='text-gray-400'>Arrastra tu archivo aca</p>
        <p className='mb-2 text-gray-400'>o</p>
        <button
          onClick={onClickHandler}
          className='px-4 py-2 border border-transparent rounded-md bg-green-400 text-white text-sm hover:cursor-pointer hover:scale-105 transition-all'
        >
          Selecciona tu archivo
        </button>
      </div>
    </>
  );
}
