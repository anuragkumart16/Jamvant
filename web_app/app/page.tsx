'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/healthcheck`)
    .then(res => res.json())
    .then(data=>{
      console.log(data)
      if(data.success){
        router.push('/auth')
      }
    })
    .catch(err=>console.error(err))
  },[])

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center">
      <div className="bg-black flex flex-col items-center justify-center border shadow rounded-xl p-8 gap-3">
            <h1 className="text-4xl">Please Wait...</h1>
            <p>Please wait while spin up the server...</p>
      </div>
    </div>
  );
}
