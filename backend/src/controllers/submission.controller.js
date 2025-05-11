import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../libs/db.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const getAllSubmission = asyncHandler(async(req,res)=>{

    const userId=req.user.id

    if (!userId) {
        throw new ApiError(404,"user id is not found")
    }

    const submission=await db.submission.findMany({
        where:{
            userId:userId
        }
    })

    res.status(200).json(
        new ApiResponse(200,submission,"Submissions Fetched Successfully")
    )
})

const getSubmissionForProblem = asyncHandler(async(req,res)=>{

    const userId= req.user.id;
    const problemId= req.params.problemId;
    const submissions = await db.submission.findMany({
        where:{
            userId:userId,
            problemId:problemId
        }
    })

    res.status(200).json(
        new ApiResponse(200,submissions,"Submissions Fetched Successfully")
    )
})

const getAllTheSubmissionsForProblem= asyncHandler(async(req,res)=>{

    const problemId = req.params.problemId
    const submission = await db.submission.count({
        where:{
            problemId:problemId
        }
    })

    res.status(200).json(
        new ApiResponse(200,submission,"Submissions Fetched Successfully")
    )
})


export {
    getAllSubmission,
    getSubmissionForProblem,
    getAllTheSubmissionsForProblem
}
