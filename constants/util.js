export const spliceTime = (time) => {
          let splitTime = time.split(' ')
          let splicedData = splitTime[splitTime.length - 1]
          let splitAMPM = splicedData.replaceAll("PM","").replaceAll("AM", "");
          let hourMinuteSeconds = splitAMPM.split(':')

          let startSecondHolder = 0;

          for (let index = 0; index < hourMinuteSeconds.length; index++) {
            
            switch (index) {
              case 0: startSecondHolder = startSecondHolder + (parseInt(hourMinuteSeconds[index]) * 3600);
                break;
              case 1: startSecondHolder = startSecondHolder + (parseInt(hourMinuteSeconds[index]) * 60)  
                break;
              case 2: startSecondHolder = startSecondHolder + (parseInt(hourMinuteSeconds[index]))
                break;
              default: return 
            }
          }

          return startSecondHolder;
    }

export function convertTimes (end_time, start_time) {
    if (end_time === null || start_time === null) {
      return '';
    };
    const time = (spliceTime(end_time) - spliceTime(start_time)) * 1000;
    return new Date(time).toISOString().substring(14, 19)
}

export function formatDateRangeFromToday(range) {
  console.log(range);
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  switch (range) {
    case '1M':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3M':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '6M':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case '1Y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'ALL':
      startDate.setFullYear(2000); // Arbitrary start date for "All"
      break;
    default:
      break;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const formatLocalYYYYMMDD = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return {
    startDate: formatLocalYYYYMMDD(startDate),
    today: formatLocalYYYYMMDD(endDate),
  }
}
