export function Editform(formData){
    const errors={};
    const contact_pattern=/^[6-9]{1}[0-9]{9}$/;
    const email_pattern= /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;
    if(formData.name===""){
        errors.name="Your name is reqired";
    }
    if(formData.contactno===""){
        errors.contactno="Contact no. is required.";
    }
    else if(!contact_pattern.test(formData.contactno)){
        errors.contactno="Contact no isn't correct";
    }
    if(formData.email===""){
        errors.email="Email is required.";
    }
    else if(!email_pattern.test(formData.email)){
        errors.email="Email isn't correct";
    }
    return errors;
}
export function Resetpass(password){
    const errors={};
    if(password===""){
        errors.password="Password is reqired";
    }
    return errors;
}