import React, { useState, useEffect } from "react";
import Header from './Header'
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { RotatingLines } from 'react-loader-spinner'
import Dropdown from 'react-bootstrap/Dropdown';
import ReactPaginate from 'react-paginate';
import { useNavigate} from 'react-router-dom';





function Help() {
    const [data, setData] = useState([])
    const [modalData, setModalData] = useState({})
    const [lodaed, setLoaded] = useState(true)
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [remark, setRemark] = useState("")
    const [transactionID, setTransactionId] = useState("")
    const [st, setStatus] = useState(0)
    const [call,setCall]=useState(false)
    const navigate=useNavigate()

    const logout = () => {
  
        localStorage.removeItem('accessToken');
        navigate('/');
      };
      const token = localStorage.getItem('auth_token');
      
      const fetchData = async () => {
        console.log("first")
        try {
            const response = await axios.post(`${process.env.REACT_APP_COMPLAIN_LIST}`, {
                username: 'rootadmin',
            }, {
                headers: {
                    'Authorization': token,
                },

            });
            setData(response?.data?.data);
            console.log(response.data.data, "complain List")
            setLoaded(false)
            setCall(false)
            if(response.message==="token not belonging to the admin"){
                alert("Session Expired")
                logout()
              }
        } catch (error) {
            alert("Internal server Error");
            setLoaded(false)
            setCall(false)
        }
    };
    useEffect(() => {
       

       
            fetchData();
       
    }, [ ]);

     
    const offset = currentPage * itemsPerPage;

    const currentPageData = data?.slice(offset, offset + itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };


     
   
    useEffect(() => {
        setCurrentPage(0);
    }, [itemsPerPage])


    const [showModal, setShowModal] = useState(false);
  
    const handleOpenModal = (id,st) => {
     setTransactionId(id)
      setShowModal(true);
      setStatus(st)
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
    const sendRemark =async () => {
      const token = localStorage.getItem('auth_token');
      setLoaded(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_UPDATE_COMPLAIN_LIST}`, {
          username: 'rootadmin',
          status:st,
          remarks:remark,
          ticket_id:transactionID
        }, {
          headers: {
            'Authorization': token,
          },
  
        });
        
        console.log("update",response)
        fetchData();
        setShowModal(false);
        setLoaded(false)
        setTransactionId("")
      setRemark("")
      setStatus("")

      
      } catch (error) {
        alert("Internal server Error");
        setLoaded(false)
        setShowModal(false);
        setTransactionId("")
      setRemark("")
      setStatus("")
      }
    }
  

    return (



        <>    <Header />
<h3 className="text-center" style={{ color: '#000', backgroundColor: '#d5c5c5', margin: '0px 0px 0px ', padding: '0.8rem' }}>Complain List</h3>




            {lodaed ? <div className=" d-flex justify-content-center align-items-center " style={{ minHeight: '100vh',marginTop:"0px" }}>
                <RotatingLines
                    visible={true}
                    height="96"
                    width="96"
                    color="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div> : <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                        <th className="text-center" scope="col">Ticket Id</th>
                            <th className="text-center" scope="col">Updated At</th>
                            <th className="text-center" scope="col">User Name</th>
                            <th  className="text-center"scope="col">Message</th>
                            <th className="text-center" scope="col">Subject </th>
                            <th className="text-center" scope="col">Status</th>

                            <th className="text-center" scope="col">Remark</th>
                            <th className="text-center" scope="col">Action</th>

                            




                        </tr>
                    </thead>
                    <tbody>
                        {(data?.length > 0) ? currentPageData.map(item => (
                            <tr key={item}>
                                <td className="text-center">{item._id}</td>
                                <td className="text-center">{item.createdAt}</td>
                                <td className="text-center">{item.username}</td>
                                <td className="text-center">{item.message}</td>
                                <td className="text-center">{item.subject}</td>
                                <td className="text-center">{(item.status) === 0 ? <button type="button" class="btn btn-warning btnyellow-custom">Active</button> : <div  >{(item.status) === 1 ? <button type="button" class="btn btn-success btngreen-success-custom ">Resolve</button> : <button type="button" class="btn btn-danger btnred-danger-custom">Rejected</button>}</div>}</td>
                                <td className="text-center">{item.remarks}</td>

                                 

                                {/* <td className="text-center"><Button variant="primary" onClick={() => handleOpenModal(item.withdraw_details)}>
                                    See details
                                </Button></td >*/}
                                <td className="text-center">
                                    <Dropdown>
                                   
                                     { (item.status)===0?  <Dropdown.Toggle  as="i" />:<>-</>}

                                        <Dropdown.Menu>
                                            <Dropdown.Item   style={{ color: "green" }} onClick={() => handleOpenModal(item._id, 1)}>Accept</Dropdown.Item>
                                            <Dropdown.Item   style={{ color: " red" }}
                                            onClick={() => handleOpenModal(item._id, 2)}>Reject</Dropdown.Item>

                                        </Dropdown.Menu>
                                    </Dropdown>


                                </td> 
                            </tr>

                        )):
                        <td colSpan={8}><h3 className="text-center">No Data!</h3></td>}


                    </tbody>
                </table>
                <div className="pagination-container  ">

                    <select
                        className="form-select form-select-sm items-per-page"
                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                        value={itemsPerPage}
                        aria-placeholder="Items per page"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>

                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={Math.ceil(data?.length / itemsPerPage)}
                        onPageChange={handlePageClick}
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                        forcePage={currentPage}
                    />
                </div>
            </div>}





          
            <Modal show={showModal} onHide={handleCloseModal} >
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <input type="text" onChange={(e) => setRemark(e.target.value)} ></input>
        </Modal.Body>
        <div className="d-flex justify-content-center align-items-center"  >
          <Button className="btn-primary "
            onClick={()=>sendRemark()}>
            Submit
          </Button></div>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>


        </>


    )
}

export default Help