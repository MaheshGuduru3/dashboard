import React, { useEffect, useRef, useState } from 'react'
import '../../index.css'
const Dashboard = () => {

    const [data , setData] = useState([])
    const [searching , setSearching] = useState('')
    const [search , setSearch] = useState('')
    const [ filterProperty ,setFilterProperty] = useState('name')
    const [totalPages , setTotalPages] = useState()
    const [edit , setEdit ] = useState(0)
    const [editTog , setEditTog] = useState(false)
    
    const [ currentPage ,setCurrentPage] = useState(1);



    const [ updateName , setUpdateName] = useState('')
    const [ updateEmail , setUpdateEmail] = useState('')
    const [ updateRole , setUpdateRole] = useState('')



    const [check , setCheck] = useState([])


    const checkref = useRef(null)
  
    const allDeleteHandler = ()=>{
        check?.map((itm)=>(
            setData((prev)=>(
                prev.filter((i)=> i.id !== itm.id)
            ))
        ))

      checkref.current.checked = false 
    } 

    
    const allSelectedHandler = (e)=>{
    
        if(e.target.checked){
             data?.slice((currentPage-1) * 10 , (currentPage * 10 ))?.map((i)=>(
                  setCheck((prev)=>([...prev , i]))
             ))

        }
        else{
          setCheck([])
        }
    }
    
    
    const fetchApi = async()=>{
        const result = await fetch(process.env.REACT_APP_API)
        const outcome = await result.json()
     
        setData(outcome)
   
        setTotalPages(Math.ceil(data.length/10)) 
     
    }

 
    const editHandler = (id)=>{
        setEdit(id)
        setEditTog(true)
    }

    const deleteHandler = (id)=>{
          const result  = data?.filter((itm)=> itm.id != id)
          setData(result)
    } 

     let res  = []

    const saveHandler = ()=>{
          if( updateEmail && updateName && updateRole ){         
            const dataUp = {
                 id : edit,
                 name : updateName,
                 email : updateEmail,
                 role : updateRole
            }
            setData((prev)=>(
                 prev.map((itm)=> parseInt(itm.id) === parseInt(edit) ? {...itm , ...dataUp} : itm) 
            ))  
         
            setEditTog(false)
          }    
          else{
                alert("required")
          }
    }


     const checkableHandler  = (e , itm)=>{
       if(e.target.checked){
         setCheck((prev)=>([...prev , itm]))
        }   
         else{
          setCheck((prev)=>(
              prev.filter((it) => parseInt(it.id) !== parseInt(itm.id) && {...it , itm})
          ))
        }
     }

    const keyHandler = (e)=>{
         if(e.key === 'Enter'){
              setSearch(searching)
         }
    }


     useEffect(()=>{
   
          if(res.length < 5){         
             setTotalPages(Math.ceil(res.length / 10))  
          }
          else{
            setTotalPages(Math.ceil(data.length / 10))
          }
     },[res])


    useEffect(()=>{
       fetchApi()
      
    },[])





  return (  
    <div className='container-fluid p-0'>
        <header className='container-fluid p-0 shadow'>
            <div className='p-2 text-center'>
                <h5 className='h4'>Admin Dashboard</h5>
            </div>
        </header>

        <div className='container-fluid p-0'>
           <div className='container mt-4'>
                <div className='container container-md shadow p-4 d-flex flex-column gap-2'>
                     <div className='d-flex justify-content-evenly'>
                         <div className='w-100 d-flex flex-md-row flex-column gap-2'>
                        
                            <input type="search" className="form-control" id="example" placeholder={`search by ${filterProperty}`} onKeyUp={(e)=> keyHandler(e)  } onChange={(e)=>setSearching(e.target.value)} />
          
                            <select className="form-select"  id="custom-select" onChange={(e)=>setFilterProperty(e.target.value)}>
                              <option value="select property" disabled>select property</option>
                              <option value="name" selected>name</option>
                              <option value="email">email</option>
                              <option value="role">role</option>
                            </select>
                         </div>
                         <button className='btn btn-danger' disabled={ check.length > 2 ? false : true} data-bs-toggle="modal" data-bs-target="#alldelete" ><i class="bi bi-trash"></i></button>
                                    <div class="modal fade" id="alldelete" aria-hidden="true">
                                              <div class="modal-dialog modal-dialog-centered">
                                                <div class="modal-content">
                                                  <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">All Delete Data</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                  </div>
                                                  <div class="modal-body">
                                                    you want Delete selected data?
                                                  </div>
                                                  <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"  onClick={()=> allDeleteHandler()}>Delete</button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                     
                     </div>
                     <div className='table-responsive'>
                     <table class="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col"><input type='checkbox' class="form-check-input"  ref={checkref}   onChange={(e)=>allSelectedHandler(e)} /></th>  
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                               {
                                 res = data?.filter((itms)=> itms[filterProperty].toLowerCase().includes(searching)).slice((currentPage-1) * 10 , (currentPage * 10 )).map((itm , i)=>(
                                  <tr key={i} className={ check?.find((i)=> parseInt(i.id) === parseInt(itm.id)) ? 'border b-2' : ''}  > 
                                    <td scope="row"><input type='checkbox' class="form-check-input" checked={ check?.find((i)=> parseInt(i.id) === parseInt(itm.id)) ? true : false}  onChange={(e)=> checkableHandler(e , itm)} /></td>
                                    {
                                       parseInt(edit) === parseInt(itm.id) && editTog ? <>
                                         <td><input type='search' className='form-control' placeholder={itm.name} onChange={(e)=>setUpdateName(e.target.value)}  required /></td>
                                         <td><input type='search' className='form-control' placeholder={itm.email} onChange={(e)=>setUpdateEmail(e.target.value)} required /></td>
                                         <td><input type='search' className='form-control' placeholder={itm.role} onChange={(e)=>setUpdateRole(e.target.value)} required /></td> 
                                      </>
                                      : 
                                      <>
                                        <td className={ check?.find((i)=> parseInt(i.id) === parseInt(itm.id)) ? 'bg-secondary text-white border b-2' : ''}>{itm.name}</td>
                                        <td className={ check?.find((i)=> parseInt(i.id) === parseInt(itm.id)) ? 'bg-secondary text-white border b-2' : ''}>{itm.email}</td> 
                                        <td className={ check?.find((i)=> parseInt(i.id) === parseInt(itm.id)) ? 'bg-secondary text-white border b-2' : ''}>{itm.role}</td>      
                                      </>     
                                    }
                                    <td className={ check?.find((i)=> parseInt(i.id) === parseInt(itm.id)) ? 'bg-secondary text-white border b-2 d-flex gap-1' : 'd-flex gap-1'}>
                                      { parseInt(edit) === parseInt(itm.id) && editTog &&    <>                            
                                       <button className='btn btn-outline-primary save'  data-bs-toggle="modal" data-bs-target="#edit">save</button>
                                         <div class="modal fade" id="edit" aria-hidden="true">
                                              <div class="modal-dialog modal-dialog-centered">
                                                <div class="modal-content">
                                                  <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Update Data</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                  </div>
                                                  <div class="modal-body">
                                                    You want Updated data?
                                                  </div>
                                                  <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={()=>saveHandler()}>Update</button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                       
                                       
                                       <button className='btn btn-outline-info cancel' onClick={()=>setEditTog(false)}>x</button>
                                       </>      
                                       }
                                      <button className='btn btn-outline-primary edit'  onClick={()=>editHandler(itm.id)}><i class="bi bi-pencil"></i></button>
                                      <button className='btn btn-outline-danger delete' data-bs-toggle="modal" data-bs-target="#delete"><i class="bi bi-trash"></i></button>                                  

                                          <div class="modal fade" id="delete" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered">
                                              <div class="modal-content">
                                                <div class="modal-header">
                                                  <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Data</h1>
                                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                  Are You sure?
                                                </div>
                                                <div class="modal-footer">
                                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                  <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={()=>deleteHandler(itm.id)}>Delete</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                    </td>
                                  </tr>
                                

                                 ))
                                
                               }
                               {
                                 res.length === 0 && <div>
                                     <p>No Data Found.</p>
                                 </div>
                               }
                            </tbody>
                          </table>

                     </div>
                     <div >
                         <div className='d-flex flex-md-row flex-column align-items-center gap-1 justify-content-between'>
                            <div>
                               {(currentPage-1)*10 + res.length} to {data.length} rows
                            </div>
                            <div>
                                page 
                                <button className='btn btn-outline-warning first-page'>{currentPage}</button> 
                                 <span>--</span>
                                <button className='btn btn-outline-info last-page'>{totalPages}</button>
                            </div>
                            <div className='d-flex gap-1'>
                               <button className='btn btn-primary previous-page' onClick={()=> currentPage <= 1 ? setCurrentPage(totalPages) : setCurrentPage(currentPage-1)}>Prev</button>
                                {
                                   [...Array(totalPages)].map((itm,i)=>(
                                        <button className={ currentPage - 1 === i ? "btn btn-secondary page-number" : 'btn btn-danger page-number'} onClick={()=> setCurrentPage(i+1)}>{i+1}</button>
                                   ))
                                }
                               <button className='btn btn-primary next-page' onClick={()=> currentPage < totalPages ? setCurrentPage(currentPage + 1) : setCurrentPage(1)  } >Next</button>
                            </div>
                         </div>
                     </div>
                </div>
           </div>
        </div>
    </div>
  )
}

export default Dashboard