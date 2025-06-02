import { asyncHandler } from "../utils/async-handler.js";
import { db } from "../libs/db.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body;

    const userId = req.user.id; // Assuming req.user.id is correctly populated by your auth middleware

    // --- FIX START ---

    // 1. Validate input name and description
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Playlist name is required");
    }

    // 2. Ensure userId is available (good existing check)
    if (!userId) {
        throw new ApiError(404,"User ID is not found. Please ensure you are logged in.");
    }

    // 3. Check if a playlist with the same name already exists for this user
    const existingPlaylist = await db.playlist.findFirst({
        where: {
            name: name,
            userId: userId,
        },
    });

    if (existingPlaylist) {
        // If a playlist with the same name and user ID exists, throw a conflict error
        throw new ApiError(409, "A playlist with this name already exists for this user.");
    }

    // --- FIX END ---

    // If no existing playlist found, proceed to create the new playlist
    const playList = await db.playlist.create({
        data:{
            name,
            description,
            userId,
        }
    });

    res.status(200).json(
        new ApiResponse(200, playList, "Playlist created successfully")
    );
});


const getAllListDetails = asyncHandler(async(req,res)=>{
    const playlist= await db.playlist.findMany({
        where:{
            userId:req.user.id
        },
        include:{
            problems:{
                include:{
                    problem:true,
                }
            }
        }
    })

    res.status(200).json(
        new ApiResponse(200,playlist,"Playlist fetched succcessfully")
    )
})

const getPlayListDetails = asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    
    const playList=await db.playlist.findUnique({
        where:{
            id:playlistId,
            userId:req.user.id
        },
        include:{
            problems:{
                include:{
                    problem:true,
                }
            }
        }
    })

    if (!playList) {
        throw new ApiError(404,"Playlist not found")
    }

    res.status(200).json(
        new ApiResponse(200,playList,"Playlist fetched successfully")
    )
})

const addProblemToPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId}=req.params
    const{problemIds} = req.body

    if(!Array.isArray(problemIds) || problemIds.length===0){
        throw new ApiError(400,"Invalid or missing problemIds")
    }

    //create records for each  problem in the playlist
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
        data:
         problemIds.map((problemId)=>({
            playlistId,
            problemId,
        }))
    
    })

    res.status(201).json(
        new ApiResponse(200,problemsInPlaylist,"Problems added to playlist successfully")
    )
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const{playlistId}=req.params

    const deletedPlaylist=await db.playlist.delete({
        where:{
            id:playlistId,
        }
    })

    res.status(200).json(
        new ApiResponse(200,deletedPlaylist,"Playlist deleted successfully")
    )
})

const removeProblemFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const {problemIds} = req.body

    if(!Array.isArray(problemIds) || problemIds.length === 0){
        throw new ApiError(400,"Invalid or missing problemId")
    }

    const deletedProblem = await db.problemsInPlaylist.deleteMany({
        where:{
            playlistId,
            problemId:{
               in:problemIds 
            }
        }
    })

    res.status(200).json(
        new ApiResponse(200,deletedProblem,"Problem removed from playlist successfully")
    )
})


export {
    createPlaylist,
    getAllListDetails,
    getPlayListDetails,
    addProblemToPlaylist,
    deletePlaylist,
    removeProblemFromPlaylist
} 