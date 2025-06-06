import axios from "axios"
import "dotenv/config" 

const headers = {
  Authorization: `Bearer ${process.env.JUDGE0_API_KEY}`,
};

const getJudge0LanguageId = (language)=>{
    const languageMap ={
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[language.toUpperCase()]
}



const sleep = (ms)=> new Promise((resolve)=> setTimeout(resolve,ms))

const pollBatchResults = async (tokens)=>{
    while(true){
        
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            },
            headers
        })

        const results = data.submissions;

        const isAllDone = results.every(
            (r)=> r.status.id !== 1 && r.status.id !== 2
        )

        if(isAllDone) return results;
        await sleep(1000)
    }
}

const submitBatch= async(submissions)=>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions,
        headers
    })

    console.log("Submisson Results: ",data);

    return data
    
}

function getLanguageName(languageId){
    const LANGAUAGE_NAMES={
        74:"TypeScript",
        63:"JavaScript",
        71:"Python",
        62:"Java",
    }

    return LANGAUAGE_NAMES[languageId] || "Unknown"
}

export{
    getJudge0LanguageId,
    submitBatch,
    pollBatchResults,
    getLanguageName
}