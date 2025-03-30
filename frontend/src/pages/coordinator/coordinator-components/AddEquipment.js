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