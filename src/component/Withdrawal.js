import React, { useState, useEffect } from "react";
import Header from './Header'
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { RotatingLines } from 'react-loader-spinner'
import Dropdown from 'react-bootstrap/Dropdown';
import ReactPaginate from 'react-paginate';
import { useNavigate} from 'react-router-dom';





function Withdrawal() {
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

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const fetchData = async () => {
            console.log("first")
            try {
                const response = await axios.post(`${process.env.REACT_APP_WITHDRAWAL}`, {
                    username: 'rootadmin',
                }, {
                    headers: {
                        'Authorization': token,
                    },

                });
                setData(response.data.data);
                console.log(response.data.data, "data")
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

       
            fetchData();
       
    }, [call]);

    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (data) => {
        console.log("HH", data)
        setModalData(data)
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const offset = currentPage * itemsPerPage;

    const currentPageData = data?.slice(offset, offset + itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };


    const [showRemarksModal, setRemarksModal] = useState(false);

    const handleRemarkModal = (id, st) => {
        setTransactionId(id)
        setRemarksModal(true);
        setStatus(st)


    };
    const sendRemark = async () => {
        const token = localStorage.getItem('auth_token');

        setLoaded(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_UPDATE_WITHDRAW}`, {
                username: 'rootadmin',
                status: st,
                remarks: remark,
                transaction_id: transactionID
            }, {
                headers: {
                    'Authorization': token,
                },

            });

            console.log(response)
            setShowModal(false);
            setLoaded(false)
            setTransactionId("")
            setRemark("")
            setStatus("")
            setRemarksModal(false);
            setCall(true)

        } catch (error) {
            alert("Internal server Error");
            setLoaded(false)
            setShowModal(false);
            setTransactionId("")
            setRemark("")
            setStatus(0)
            setRemarksModal(false);
            setCall(true)
        }
    }
    useEffect(() => {
        setCurrentPage(0);
    }, [itemsPerPage])

    return (



        <>    <Header />
<h3 className="text-center" style={{ color: '#000', backgroundColor: '#d5c5c5', margin: '0px 0px 0px ', padding: '0.8rem' }}>Withdrawal Details</h3>




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
                            <th className="text-center" scope="col">Player ID</th>
                            <th className="text-center" scope="col">User Name</th>
                            <th  className="text-center"scope="col">Opening Balance</th>
                            <th className="text-center" scope="col">Withdraw Amount</th>
                            <th className="text-center" scope="col">Transaction ID</th>

                            <th className="text-center" scope="col">Remark</th>
                            <th className="text-center" scope="col"> Status</th>
                            <th  className="text-center"scope="col">Withdrawal Details</th>
                            <th className="text-center" scope="col">Action</th>





                        </tr>
                    </thead>
                    <tbody>
                        {(data?.length > 0) ? currentPageData.map(item => (
                            <tr key={item}>
                                <td className="text-center">{item.player_id}</td>
                                <td className="text-center">{item.username}</td>
                                <td className="text-center">{item.opening_bal}</td>
                                <td className="text-center">{item.withdraw_amount}</td>
                                <td className="text-center">{item.transaction_id}</td>

                                <td className="text-center">{item.remarks}</td>
                                <td className="text-center">{(item.withdraw_status) === 0 ? <button type="button" class="btn btn-warning btnyellow-custom">Pending</button> : <div  >{(item.withdraw_status) === 1 ? <button type="button" class="btn btn-success btngreen-success-custom ">Approved</button> : <button type="button" class="btn btn-danger btnred-danger-custom">Rejected</button>}</div>}</td>

                                <td className="text-center"><Button variant="primary" onClick={() => handleOpenModal(item.withdraw_details)}>
                                    See details
                                </Button></td >
                                <td className="text-center">
                                    <Dropdown>
                                   
                                     { (item.withdraw_status)===0?  <Dropdown.Toggle  as="i" />:<>-</>}

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleRemarkModal(item._id, 1)} style={{ color: "green" }}>Accept</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleRemarkModal(item._id, 2)} style={{ color: " red" }}>Reject</Dropdown.Item>

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
                    <Modal.Title>Modal Title</Modal.Title>
                </Modal.Header>
                <Modal.Body> <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>

                                {modalData?.method && <tr> <th scope="col">Method</th>  <td>{modalData?.method}</td>  </tr>}
                                {modalData?.account_numbe && <tr>  <th scope="col">Account Number</th>    <td>{modalData?.account_number}</td> </tr>}
                                {modalData?.ifsc_code && <tr>  <th scope="col">IFCS Code</th>   <td>{modalData?.ifsc_code}</td> </tr>}
                                {modalData?.account_holder_name && <tr>  <th scope="col">Account Holder Name</th>  <td>{modalData?.account_holder_name}</td> </tr>}
                                {modalData?.upi && <tr> <th scope="col">Upi Id</th> <td>{modalData?.upi}</td>  </tr>}
                                {modalData?.phonepe && <tr>  <th scope="col">Number</th>  <td>{modalData?.phonepe}</td> </tr>}
                            </tr>
                        </thead>
                    </table>
                </div></Modal.Body>

            </Modal>

            <Modal show={showRemarksModal} onHide={handleCloseModal} >
                <Modal.Header closeButton onClick={() => setRemarksModal(false)}>
                    <Modal.Title>Remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <input type="text" onChange={(e) => setRemark(e.target.value)} ></input>
                </Modal.Body>
                <div className="d-flex justify-content-center align-items-center"  >
                    <Button className="btn-primary "
                        onClick={() => sendRemark()}>
                        Submit
                    </Button></div>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>



        </>


    )
}

export default Withdrawal