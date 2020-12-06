export const getTodayInfo = () => {
    let date: Date = new Date();
    let years: string = date.getFullYear() + '年';
    let month: string = date.getMonth()+1 + '月';
    let day: string = date.getDate() + '日';
    let today: string =  years + month + day;
    let arr: string[] = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    let week = arr[date.getDay()];
    return { today, week };
}

export const getTodayTimeTip = () => {
    let hours: number = new Date().getHours();
    let timeTips: string = '';
    if ( hours >= 0 && hours < 9 ) {
      timeTips = '早安';
    } else if ( hours >=9 && hours < 11 ) {
      timeTips = '上午好';
    } else if ( hours >=11 && hours < 13 ) {
      timeTips = '中午好';
    } else if ( hours >=13 && hours < 19 ) {
      timeTips = '下午好';
    } else {
      timeTips = '晚安';
    }
    return timeTips;
}