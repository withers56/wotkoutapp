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
