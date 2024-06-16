import React, { useState, useEffect } from "react";
import Header from './Header'
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner'
import Dropdown from 'react-bootstrap/Dropdown';
import ReactPaginate from 'react-paginate';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';


function Deposite() {
  const [data, setData] = useState([])
  const [lodaed, setLoaded] = useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [remark, setRemark] = useState("")
  const [transactionID,setTransactionId]=useState("")
  const [st,setStatus]=useState("")
  
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
        const response = await axios.post(`${process.env.REACT_APP_DEPOSIT}`, {
          username: 'rootadmin',
        }, {
          headers: {
            'Authorization': token,
          },

        });
       setData(response.data.data);
        console.log(response.data.data, "data")
        setLoaded(false)
        if(response.message==="token not belonging to the admin"){
          alert("Session Expired")
          logout()
        }
      } catch (error) {
        alert("Internal server Error");
        setLoaded(false)
      }
    };

    fetchData();
  }, [lodaed]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
      const response = await axios.post(`${process.env.REACT_APP_UPDATE_DEPOSIT}`, {
        username: 'rootadmin',
        status:st,
        remarks:remark,
        transaction_id:transactionID
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
      
      <h3 className="text-center" style={{ color: '#000', backgroundColor: "rgb(213,197,197)", margin: '0px 0px 0px ', padding: '0.8rem' }}> Deposit Details</h3>
      {lodaed ? <div className=" d-flex justify-content-center align-items-center " style={{ minHeight: '100vh' }}>
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
              <th className="text-center"scope="col">Player ID</th>
              <th className="text-center"scope="col">User Name</th>
              <th className="text-center"scope="col">Deposit Amount</th>
              <th className="text-center"scope="col">Transaction ID</th>
              <th className="text-center"scope="col">Opening Balance</th>
              <th className="text-center"scope="col"> Status</th>

              <th className="text-center"scope="col">Remark</th>
              <th className="text-center"scope="col"> Action</th>


            </tr>
          </thead>
          <tbody>
            {(data?.length > 0) ? currentPageData.map(item => (
              <tr key={item}>
                <td className="text-center">{item.player_id
                }</td>
                <td className="text-center">{item.username}</td>
                <td className="text-center">{item.deposit_amount}</td>
                <td className="text-center">{item.transaction_id}</td>
                <td className="text-center">{item.opening_bal}</td>
                <td className="text-center">{(item.deposit_status) === 0 ? <button type="button" class="btn btn-warning btnyellow-custom">Pending</button> : <div style={{ color: 'green' }}>{(item.deposit_status) === 1 ? <button type="button" class="btn btn-success btngreen-success-custom">Approved</button> : <button type="button" class="btn btn-danger btnred-danger-custom">Rejected</button>}</div>}</td>

                <td className="text-center">{item.remarks}</td>
                <td className="text-center" >
                  <Dropdown>
                  { (item.deposit_status)===0?  <Dropdown.Toggle  as="i" />:<>-</>}
                  
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleOpenModal(item.transaction_id, 1)} style={{ color: "green" }}>Accept</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleOpenModal(item.transaction_id, 2)} style={{ color: " red" }}>Reject</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>


                </td>

              </tr>
            )):<td colSpan={8}><h3 className="text-center">No Data!</h3></td>}


          </tbody>
        </table>
      </div>}
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

export default Deposite