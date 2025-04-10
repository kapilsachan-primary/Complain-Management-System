export function AddProductorService(formData){
    const errors={};    
    if(formData.department===""){
        errors.department="Department is reqired";
    }
    if(formData.category._id===""|| formData.category.name===""){
        errors.category="Category is required.";
    }
    if(formData.type===""){
        errors.type="Type has to be specified.";
    }
    if(formData.modelNo===""){
        errors.modelNo="Service Name/Model No. isn't entered";
    }
    return errors;
}
export function AddCategory(newCategory){
    const errors={};
    if(newCategory===""){
        errors.newCategory="Category has to be entered";
    }
    return errors;
}
export function HandleExcelValidate(selectedFile){
    const errors={};
    if(selectedFile===null){
        errors.selectedFile="Upload a File in .xlsx or .xls format only";
    }
    else {
        const allowedtypes=[
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", /* .xlsx*/
            "application/vnd.ms-excel", // .xls
        ];
        if(!allowedtypes.includes(selectedFile.type)){
            errors.selectedFile="Enter a .xlsx or .xls file only";
        }
    }
    return errors;
}