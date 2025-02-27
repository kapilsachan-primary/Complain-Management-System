export default function LoginValidate(formData){
    const errors={};
    const email_pattern= /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;
    if(formData.email===""){
        errors.email="Your email is reqired";
    }
    else if(!email_pattern.test(formData.email)){
        errors.email="Email isn't correct";
    }
    if(formData.password===""){
        errors.password="Password is required";
    }
    return errors;
}