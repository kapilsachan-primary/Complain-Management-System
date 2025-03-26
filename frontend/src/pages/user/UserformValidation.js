export default function UserformValidate(formData){
    const errors={};
    const contact_pattern=/^[6-9]{1}[0-9]{9}$/;
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
    if(formData.department===""){
        errors.department="Department is reqired";
    }
    if(formData.subject===""){
        errors.subject="Subject is reqired";
    }
    if(formData.description===""){
        errors.description="Description is reqired";
    }
    if(formData.model===""){
        errors.model="Model is reqired";
    }
    if(formData.priority===""){
        errors.priority="Priority has to be denoted";
    }
    return errors;
}