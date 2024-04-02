import React,{ useState,useEffect} from 'react'
import Untitled from '../img/Untitled.webp';

const defaultImageSrc = Untitled
const initialFieldValues = {
    employeeId: 0,
    employeeName: '',
    ocupation: '',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null
}

function Employee(props) {

    const {addOrEdit,recordForEdit} = props
    const [values,setValues] = useState(initialFieldValues)
    const [errors,setErrors] = useState({})

    useEffect(() => {
        if (recordForEdit != null) {
            setValues(recordForEdit);
        }
    },[recordForEdit])

    const handleInputChange =  e => {
        const {name,value} = e.target;
        setValues ({
            ...values,
            [name]:value
        })
    }

   const showPreview = e => {
    if (e.target.files && e.target.files[0]) {
        let imageFile = e.target.files[0];
        if (imageFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setValues({
                    ...values,
                    imageFile: imageFile,
                    imageSrc: reader.result
                });
            };
            reader.readAsDataURL(imageFile);
        } else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            });
        }
    }
};

    const validate = () => {
        let temp = {}
        temp.employeeName = values.employeeName == ""?false:true;
        temp.imageSrc = values.imageSrc == defaultImageSrc?false:true;
        temp.ocupation =  values.ocupation == ""?false:true;
        temp.imageSrc = values.imageSrc !== defaultImageSrc; 

        setErrors(temp)
        return Object.values(temp).every(x => x==true)

    }

    const resetForm = ()=> {
        setValues(initialFieldValues)
        document.getElementById('image-uploader').value = null;
        setErrors({})
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const formData = new FormData()
            formData.append('employeeId',values.employeeId) 
            formData.append('employeeName',values.employeeName) 
            formData.append('ocupation',values.ocupation) 
            formData.append('imageName',values.imageName) 
            formData.append('imageFile',values.imageFile) 
            addOrEdit(formData,resetForm)
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field] == false)?' invalid-field':'')

  return (
    <>
        <div className="container text-center">
            <p className="lead">An Employee</p>
        </div>
        <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
            <div className="card">
                <img src={values.imageSrc} alt="uu" className="card-img-top" />
                <div className="card-body">
                    <div className="form-group">
                        <input type="file" accept="image/*" className={"form-control-file" + applyErrorClass('imageSrc')}
                        onChange={showPreview} id="image-uploader"
                        />
                    </div>
                    <div className="form-group">
                        <input type="text" className={"form-control" +applyErrorClass('employeeName')} placeholder="Employee Name" name="employeeName"
                        value={values.employeeName}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <input type="text" className={"form-control" +applyErrorClass('ocupation')} placeholder="ocupation" name="ocupation"
                        value={values.ocupation}
                        onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group text-center">
                        <button className="btn btn-light">Submit</button>
                    </div>
                 </div>
            </div>
        </form>
    </>

  )
}

export default Employee