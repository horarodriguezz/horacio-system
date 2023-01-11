"use client";
import { PropsWithChildren } from "react";
import Sidebar from "../../components/Sidebar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export default function DashboardLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <DndProvider backend={HTML5Backend}>
      <main className='w-screen h-screen bg-slate-50'>
        <Sidebar />
        <div className='pl-[250px] w-full h-full bg-transparent overflow-hidden'>
          {children}
        </div>
      </main>
    </DndProvider>
  );
}
