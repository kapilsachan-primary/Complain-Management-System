export default function ReportValidate(startDate,closeDate){
    const errors={};
    if(startDate===""){
        errors.startDate="Start date is reqired";
    }
    if(closeDate===""){
        errors.closeDate="Closure date is reqired";
    }
    if(startDate!=="" && closeDate!==""){
        const start=new Date(startDate);
        const close=new Date(closeDate);
        const todaydate=new Date();
        if(start.setHours(0,0,0,0)>todaydate.setHours(0,0,0,0) || close.setHours(0,0,0,0)>todaydate.setHours(0,0,0,0)){
            if(start.setHours(0,0,0,0)<todaydate.setHours(0,0,0,0)){
                errors.startDate="Date should not be greater than of today";
            }
            if(close.setHours(0,0,0,0)<todaydate.setHours(0,0,0,0)){
                errors.closeDate="Date should not be greater than of today";
            }
        }
        else if((start.setHours(0,0,0,0) > close.setHours(0,0,0,0))){
            errors.startDate="Start date has to be lower than Closure date";
            errors.closeDate="Start date has to be lower than Closure date";
        }
    }
    return errors;
}