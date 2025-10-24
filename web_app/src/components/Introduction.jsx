import React,{useState} from "react";


function Introduction({handleSkip}) {


  const [steps,setSteps] = useState(1)


  function handleNext(){
    if (steps >=2){
      handleSkip()
      return
    }
    setSteps(steps +1)
  }

  function handlePrev(){
    if(steps > 1){
      setSteps(steps -1)
    }
  }
  return <>
    <div className="h-[99vh] w-[100vw] flex items-center content-center justify-center flex-col gap-4 select-none">
      <div className="w-full p-4 px-12 flex justify-end">
        <button className="text-lg mt-4" onClick={handleSkip}>Skip</button>
      </div>
      {/* this is display component */}
      {steps == 1 &&   <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-md text-center">Delusion presents</h1>
        <h1 className="text-6xl font-bold text-center">Jamvant</h1>
        <p className="text-center mt-5 text-xl">App to remind you that you are made <br /> for <b className="text-orange-600">great things</b>.</p>
      </div>}
      {steps == 2 &&   <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {/* <h1 className="text-xl text-center font-bold ">Jamvant</h1> */}
        <p className="text-center mt-5 text-xl">Tell us what you wished to be<br /> <b className="text-orange-600">reminded</b> and we will do <br /> that for you.</p>
      </div>}

      {/* this is btn holder */}
      <div className="flex flex-row content-around items-center w-full p-4 px-12 self-end">
        <button className="border px-6 py-4 rounded-xl" onClick={handlePrev}>Previous</button>
        <button className="px-10 py-4 bg-black text-white border-none rounded-xl ml-auto" onClick={handleNext}>Next</button>
      </div>
    </div>
  </>
}

export default Introduction;
