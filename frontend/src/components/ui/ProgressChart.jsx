import { useProblemStore } from "../../store/useProblemStore.js"
import { useEffect } from "react"
import { Doughnut } from "react-chartjs-2"

import {Chart as ChartJS, ArcElement,Tooltip,Legend} from "chart.js"

ChartJS.register(ArcElement,Tooltip,Legend)


const ProgressChart = ({progressData})=>{

    const{getAllProblems,problems}=useProblemStore()

    useEffect(() => {
      getAllProblems()
    }, [])

    const problemData= problems.reduce(
        (acc,problem)=>{
            const difficulty= problem.difficulty;

            if (difficulty === "EASY") acc.totalEasyProblems += 1;
      else if (difficulty === "MEDIUM") acc.totalMedProblems += 1;
      else if (difficulty === "HARD") acc.totalHardProblems += 1;

      return acc;

        },

        {
      totalEasyProblems: 0,
      totalMedProblems: 0,
      totalHardProblems: 0,
      totalProblems: 0,
    }

    )

    problemData.totalProblems =
    problemData.totalEasyProblems +
    problemData.totalMedProblems +
    problemData.totalMedProblems;

  const totalSolved = progressData.solvedProblems;

  const data= totalSolved > 0 ? 

    {
          labels: ["Easy", "Medium", "Hard"],
          datasets: [
            {
              data: [
                progressData.easyProblems,
                progressData.medProblems,
                progressData.hardProblems,
              ],
              backgroundColor: ["#0cebcd", "#faae32", "#c62828"],
              borderWidth: 0,
              cutout: "90%",
              radius: "90%",
            },
          ],
        } : {
          labels: ["No Data"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#484d54"],
              borderWidth: 0,
              cutout: "90%",
              radius: "90%",
            },
          ],
        };

    const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const totals = {
              Easy: problemData.totalEasyProblems,
              Medium: problemData.totalMedProblems,
              Hard: problemData.totalHardProblems,
            };
            return `${label}: ${value}/${totals[label]} solved`;
          },
        },
      },
    },
  };
  
  return(

    <div className="flex items-center bg-transparent border-none border-neutral-800 relative h-[360px]   shadow-none shadow-neutral-500/40 justify-center  rounded-xl px-2 py-8  text-white col-span-1 row-span-1 ">
        <div className="relative w-[250px] h-[250px]">
            <Doughnut data={data} options={options}/>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-semibold text-blue-500">
                    {totalSolved}

                    <span className="text-lg text-amber-600">
                        /{progressData.totalproblems}
                    </span>
                </div>
                <div className="text-green-400 text-lg">✓ Solved</div>
            </div>
        </div>

        {/* {labels} */}

        <div className="flex flex-col gap-2 ">
        <div className="bg-background px-4 py-2 rounded-md border-2 text-[#00bfa6] text-sm font-medium flex justify-between">
          <span>Easy</span>
          <span className="ml-2 text-gray-800 dark:text-white font-bold">
            {progressData.easyProblems}
          </span>
          <span className="ml-1 text-gray-800 dark:text-white">
            /{problemData.totalEasyProblems}
          </span>
        </div>
        <div className="bg-background border-2 px-4 py-2 rounded-md text-[#f9a825] text-sm font-medium flex justify-between">
          <span>Med.</span>
          <span className="ml-2  text-gray-800 dark:text-white font-bold">
            {progressData.medProblems}
          </span>
          <span className="ml-1  text-gray-800 dark:text-white">
            /{problemData.totalMedProblems}
          </span>
        </div>
        <div className="bg-background border-2 px-4 py-2 rounded-md text-[#c62828] text-sm font-medium flex justify-between">
          <span>Hard</span>
          <span className="ml-2  text-gray-800 dark:text-white font-bold">
            {progressData.hardProblems}
          </span>
          <span className="ml-1  text-gray-800 dark:text-white">
            /{problemData.totalHardProblems}
          </span>
        </div>
      </div>
        
    </div>

  )


    
}

export default ProgressChart
