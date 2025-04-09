export default function UserformValidate(formData,isServiceEnabled,products){
    const errors={};
    const contact_pattern=/^[6-9]{1}[0-9]{9}$/;
    const email_pattern= /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;
    if(formData.name===""){
        errors.name="Complainee's name is reqired";
    }
    if(formData.roomNo===""){
        errors.roomNo="Room No. is reqired";
    }
    if(formData.contactNo===""){
        errors.contactNo="Contact no. is required.";
    }
    else if(!contact_pattern.test(formData.contactNo)){
        errors.contactNo="Contact no isn't correct";
    }
    if(formData.email===""){
        errors.email="Email is required.";
    }
    else if(!email_pattern.test(formData.email)){
        errors.email="Email isn't correct";
    }
    if(formData.department===""){
        errors.department="Department is reqired";
    }
    if(formData.category===""){
        errors.category="Category is reqired";
    }
    if(formData.services==="" && isServiceEnabled == true){
        errors.services="Services is reqired";
    }
    // if(formData.productdescription==="" && products.length !== 0 ){
    //     errors.productdescription="Product description is reqired";
    // }
    if(formData.productdescription==="" ){
        errors.productdescription="Product description is reqired";
    }
    // if(formData.priority===""){
    //     errors.priority="Priority has to be denoted";
    // }
    return errors;
}