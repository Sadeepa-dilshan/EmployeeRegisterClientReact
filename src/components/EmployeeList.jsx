import React,{useState,useEffect} from 'react'
import Employee from './Employee'
import axios from 'axios';

function EmployeeList() {
    const [employeeList,setEmployeeList] = useState([])
    const [recordForEdit,setRecordForEdit] = useState(null)

    useEffect(() => {
        refreshEmployeeList();
    }, [])

    const employeeAPI = (url = 'https://localhost:7186/api/Employees') => {
        return {
            fetchAll: () => axios.get(url),
            create: newRecord => axios.post(url,newRecord),
            update: (id, updatedRecord) => axios.put(`${url}/${id}`, updatedRecord),
            delete: id => axios.delete(`${url}/${id}`)
        }
    }

    function refreshEmployeeList (){
        employeeAPI().fetchAll()
        .then(res => setEmployeeList(res.data))
        .catch(err => console.log(err))
    }

    const addOrEdit = (formData, onSuccess) => {
        if (formData.get('employeeId') == "0") {
            employeeAPI().create(formData)
            .then(res => {
                onSuccess();
                refreshEmployeeList();
            })
            .catch(err => console.log(err))
        } else {
            employeeAPI().update(formData.get('employeeId'),formData)
            .then(res => {
                onSuccess();
                refreshEmployeeList();
            })
            .catch(err => console.log(err))
        }
       
    }

    const showRecordDetails = data => {
        setRecordForEdit(data);
    }

    const onDelete = (e,id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure to delete this record?')) {
            employeeAPI().delete(id)
                .then(res => refreshEmployeeList())
                .catch(err => console.log(err))
        }
    }

    const imageCard = data => (
        <div className="card" onClick={()=>{showRecordDetails(data)}}>
            <img src={data.imageSrc} alt="" className="card-img-top rounded-circle" />
                <div className="card-body">
                    <h5>{data.employeeName}</h5>
                    <span>{data.ocupation}</span> <br/>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-light delete-button" onClick={e => onDelete(e,parseInt(data.employeeId))}>
                            <i className="far fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
        </div>
    )

  return (
    <div className="row">
        <div className="col-md-12">
            <div className="jumbotron jumbotron-fluid py-4" style={{ backgroundColor: '#dddddd' }}>
                <div className="container text-center text-danger">
                    <h1 className="display-4">Employee Register</h1>
                </div>
            </div>
        </div>
        <div className="col-md-4 text-center">
            <Employee 
                addOrEdit = {addOrEdit}
                recordForEdit = {recordForEdit}
            />
        </div>
        <div className="col-md-8">
            <table>
                <tbody>
                    {
                        [...Array(Math.ceil(employeeList.length/3))].map((e,i) => 
                            <tr key={i}>
                                <td>{imageCard(employeeList[3*i])}</td>
                                <td>{employeeList[3*i + 1]?imageCard(employeeList[3 * i + 1]) : null}</td>
                                <td>{employeeList[3*i + 2]?imageCard(employeeList[3 * i + 2]) : null}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default EmployeeList