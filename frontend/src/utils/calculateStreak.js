import { format,subDays,isSameDay,parseISO} from "date-fns";


export const calculateDailyStreak = (submissions)=>{
    if(!submissions || submissions.length === 0){
        return {currentStreak:0,isTodaySolved:false,longestStreak:0}
    }

    const solvedDatesSet= new Set();

    submissions.forEach(submission =>{
        if (submission.status === "Accepted") {
            const submissionDate = parseISO(submission.createdAt)
            solvedDatesSet.add(format(submissionDate,'yyyy-MM-dd'))
        }
    })

    const sortedSolvedDates = Array.from(solvedDatesSet).sort();

    let currentStreak=0;
    let longestStreak=0;
    let isTodaySolved=false;

    const today = new Date();
    const todayFormatted = format(today,'yyyy-MM-dd');
    const yesterday = subDays(today,1);
    const yesterdayFormatted = format(yesterday, 'yyyy-MM-dd');

    isTodaySolved = solvedDatesSet.has(todayFormatted);

    let tempCurrentStreak = 0;

    let checkingDate = new Date();

    if(isTodaySolved){
        tempCurrentStreak = 1;
        checkingDate = subDays(checkingDate,1)
    }
    else{
        checkingDate = yesterday
    }

    while(true){
        const formattedDate = format(checkingDate,'yyyy-MM-dd')

        if(solvedDatesSet.has(formattedDate)){
            tempCurrentStreak++;
        }else{
            if(tempCurrentStreak ===0){
                currentStreak = 0
            }
            break;
        }
        checkingDate=subDays(checkingDate,1);

        
    }
    currentStreak = tempCurrentStreak

    // A special case: if today is not solved, and the latest solved date was older than yesterday,
  // then the current streak should actually be 0. This means the actual streak ended earlier.

  if (!isTodaySolved && currentStreak > 0){
    const latestSolvedDateInSet = sortedSolvedDates.length>0 ? parseISO(sortedSolvedDates[sortedSolvedDates.length-1]) : null;

    if(latestSolvedDateInSet && !isSameDay(latestSolvedDateInSet,yesterday)){
        currentStreak =0
    }
  }

  let maxStreak = 0;
  let currentSegmentStreak = 0;

  for(let i=0;i<sortedSolvedDates.length;i++){
    const currentDate= parseISO(sortedSolvedDates[i]);
    if (i===0) {
        currentSegmentStreak =1;
    }else{
        const prevDate = parseISO(sortedSolvedDates[i-1])
        if(isSameDay(subDays(currentDate,1),prevDate)){
            currentSegmentStreak++;
        }else{
            maxStreak = Math.max(maxStreak,currentSegmentStreak)
            currentSegmentStreak =1
        }
    }
  }

  maxStreak = Math.max(maxStreak,currentSegmentStreak);

  return { currentStreak,isTodaySolved,longestStreak:maxStreak}

}