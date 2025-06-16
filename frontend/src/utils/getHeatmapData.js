import { format,parseISO } from "date-fns";


export const getHeatmapData = (submissions)=>{
    if(!submissions || submissions.length===0){
        return [];
    }

    const dailyCounts = new Map();

    submissions.forEach(submissions =>{
        const submissionDate=parseISO(submissions.createdAt);
        const formattedDate = format(submissionDate,'yyyy-MM-dd');

        dailyCounts.set(formattedDate,(dailyCounts.get(formattedDate)|| 0)+1)
    })

    const heatmapValues = Array.from(dailyCounts.entries()).map(([date, count]) => ({
        date,
        count,
    }));

    return heatmapValues

}