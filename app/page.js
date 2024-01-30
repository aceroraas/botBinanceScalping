'use client'
import Main from "@/components/main";
import Bot from "@/lib/bot";
import { IsRuning } from "@/lib/stores/stores";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";


export default function Home() {
  const isStart = useStore(IsRuning);
  useMemo(() => {
    if (isStart == 0) {
      Bot()
    } else {
      console.log("isRuning");
    }
  }, [isStart])
  return (
    <main >
      <Main />
    </main>
  );
}

