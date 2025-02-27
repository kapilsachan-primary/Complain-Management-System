export default function RegisterValidate(formData){
    const errors={};
    const contact_pattern=/^[6-9]{1}[0-9]{9}$/;
    const email_pattern= /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;
    if(formData.name===""){
        errors.name="Your name is reqired";
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
    if(formData.password===""){
        errors.password="Password is reqired";
    }
    if(formData.confirmpass===""){
        errors.confirmpass="Confirm Password is required";
    }
    else if(formData.confirmpass!==formData.password){
        errors.confirmpass="Confirm Password does not match";
    }
    return errors;
}