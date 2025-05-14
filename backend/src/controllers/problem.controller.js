import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import {db} from "../libs/db.js";
import { ApiResponse } from "../utils/api-response.js";


const createProblem= asyncHandler(async(req,res)=>{
    const{title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions}=req.body

    if (req.user.role !== "ADMIN") {
        throw new ApiError(401,"You are not allowed to created a problem ")
    }

    for(const [language, solutionCode] of Object.entries(referenceSolutions)){
        const languageId = getJudge0LanguageId(language)

        if(!languageId){
            throw new ApiError(400,`Language ${language} is not supported`)
        }

        const submissions=testcases.map(({input,output}) =>({
            source_code:solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output,
        }))

        // console.log(submissions);
        

        const submissionResults = await submitBatch(submissions);

        // console.log(submissionResults);
        

        const tokens= submissionResults.map((res)=>res.token)

        // console.log(tokens);
        

        const results= await pollBatchResults(tokens)

        // console.log(results);
        

       for(let i=0; i<results.length;i++){
            const result = results[i]
            console.log("Result-----",result);

        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );

        if(result.status.id !== 3){
            throw new ApiError(400,`Testcase ${i+1} failed for language ${language}`)
        }
            
    }


}

    const newProblem = await db.problem.create({
        data:{
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            userId:req.user.id,

        }
    })

    return res.status(201).json(
        new ApiResponse(201,'Problem created successfully',newProblem)
    )
})

const getAllProblems= asyncHandler(async(req,res)=>{
  const problems= await db.problem.findMany()

  if (!problems) {
    throw new ApiError(404,"no problems found")
  }

  res.status(200).json(
    new ApiResponse(200,"Problems Fetched Successfully",problems)
  )

})

const getProblemById= asyncHandler(async(req,res)=>{
   const {id} = req.params
   
   const problem= await db.problem.findUnique({
    where:{
        id,
    }
   })

   if (!problem) {
    throw new ApiError(404,"Problem not found")
   }

   res.status(200).json(
    new ApiResponse(200,"Problem found succesfully",problem)
   )
})

const updateProblem= asyncHandler(async(req,res)=>{
    const{id}=req.params
    const{title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions}=req.body
    
    const problem= await db.problem.findUnique({
        where:{
            id,
        }
    })

    if (!problem) {
        throw new ApiError(404,"Problem is not found")
    }

    const updatedProblem= await db.problem.update({
        where:{
            id,
        },
        data:{
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
        }
    })

    res.status(201).json(
        new ApiResponse(201,"Problem successfully updated",updatedProblem)
    )


    
})

const deleteProblem= asyncHandler(async(req,res)=>{
   const{id}=req.params;
   
   const problem=await db.problem.findUnique({
    where:{
        id,
    }
   })

   if (!problem) {
     throw new ApiError(404,"Problem not found")
   }

   await db.problem.delete({
    where:{
        id,
    }
   })

   res.status(200).json(
    new ApiResponse(200,"Problem deleted successfully")
   )
})

const getAllProblemsSolvedByUser= asyncHandler(async(req,res)=>{
     const problems = await db.problem.findMany({
        where:{
            solvedBy:{
                some:{
                    userId:req.user.id
                }
            }
        },
        include:{
            solvedBy:{
                where:{
                    userID:req.user.id
                }
            }
        }
     })

     res.status(200).json(
        new ApiResponse(200,problems,"Problem fetched successfully")
     )
})


export{
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
    getAllProblemsSolvedByUser
}


