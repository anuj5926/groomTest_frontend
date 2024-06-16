import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import axios from 'axios';
import { MdOutlineAttachMoney } from "react-icons/md";
import { RotatingLines } from 'react-loader-spinner'
import ReactPaginate from 'react-paginate';
import { useNavigate} from 'react-router-dom';



const Dashboard = () => {

    const [data, setData] = useState([])
    const [sessionData, setSessionData] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [lodaed, setLoaded] = useState(true)

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
                const response = await axios.post(`${process.env.REACT_APP_DASHBOARD_DATA}`, {
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
        const fetchDashboardData = async () => {
            console.log("first")
            try {
                const response = await axios.post(`${process.env.REACT_APP_DASHBOARD_SESSION_DATA}`, {
                    username: 'rootadmin',
                }, {
                    headers: {
                        'Authorization': token,
                    },

                });
                setSessionData(response.data.session_history);
                console.log(response.data.session_history.length, "dataSession")
            } catch (error) {
                alert("Internal server Error, Unable get session details");
            }
        };

        fetchData();
        fetchDashboardData();
    }, []);

    //console.log(Object.keys(data).length < 0)

    const offset = currentPage * itemsPerPage;
    const currentPageData = sessionData?.slice(offset, offset + itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    useEffect(() => {
        setCurrentPage(0);
    }, [itemsPerPage])


    return (

        <div style={{backgroundColor:"#d5c5c5" }}>{lodaed ?
            <div className=" d-flex justify-content-center align-items-center " style={{ minHeight: '100vh' }}>
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
            </div> :
            <Container  >
                <Container className="container-no-border">

                    <div className="w-100 rounded  p-5 ">
                        <Row>
                            <Col md="6" className="mb-4">
                                <Card>
                                    <Card.Body>

                                        <Card.Title> <div className="row"><div className="col-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" color="#000000" fill="none">
                                            <path d="M20.9427 16.8354C20.2864 12.8866 18.2432 9.94613 16.467 8.219C15.9501 7.71642 15.6917 7.46513 15.1208 7.23257C14.5499 7 14.0592 7 13.0778 7H10.9222C9.94081 7 9.4501 7 8.87922 7.23257C8.30834 7.46513 8.04991 7.71642 7.53304 8.219C5.75682 9.94613 3.71361 12.8866 3.05727 16.8354C2.56893 19.7734 5.27927 22 8.30832 22H15.6917C18.7207 22 21.4311 19.7734 20.9427 16.8354Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            <path d="M7.25662 4.44287C7.05031 4.14258 6.75128 3.73499 7.36899 3.64205C8.00392 3.54651 8.66321 3.98114 9.30855 3.97221C9.89237 3.96413 10.1898 3.70519 10.5089 3.33548C10.8449 2.94617 11.3652 2 12 2C12.6348 2 13.1551 2.94617 13.4911 3.33548C13.8102 3.70519 14.1076 3.96413 14.6914 3.97221C15.3368 3.98114 15.9961 3.54651 16.631 3.64205C17.2487 3.73499 16.9497 4.14258 16.7434 4.44287L15.8105 5.80064C15.4115 6.38146 15.212 6.67187 14.7944 6.83594C14.3769 7 13.8373 7 12.7582 7H11.2418C10.1627 7 9.6231 7 9.20556 6.83594C8.78802 6.67187 8.5885 6.38146 8.18945 5.80064L7.25662 4.44287Z" stroke="currentColor" stroke-width="1.5" />
                                        </svg> </div><div className="col-auto"> <p>{data?.total_bet}</p>  <span className="d-block"><h6>TOTAL BET</h6></span></div>
                                        </div></Card.Title>


                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md="6" className="mb-4">
                                <Card>
                                    <Card.Body>

                                        <Card.Title> <div className="row"><div className="col-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" color="#000000" fill="none">
                                            <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" stroke-width="1.5" />
                                            <path d="M18.9 8C18.9656 7.67689 19 7.34247 19 7C19 4.23858 16.7614 2 14 2C11.2386 2 9 4.23858 9 7C9 7.34247 9.03443 7.67689 9.10002 8" stroke="currentColor" stroke-width="1.5" />
                                            <path d="M7 7.99324H16C18.8284 7.99324 20.2426 7.99324 21.1213 8.87234C22 9.75145 22 11.1663 22 13.9961V15.9971C22 18.8269 22 20.2418 21.1213 21.1209C20.2426 22 18.8284 22 16 22H10C6.22876 22 4.34315 22 3.17157 20.8279C2 19.6557 2 17.7692 2 13.9961V11.9952C2 8.22211 2 6.33558 3.17157 5.16344C4.11466 4.2199 5.52043 4.03589 8 4H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        </svg> </div><div className="col-auto"> <p>{data?.total_deposit}</p>  <span className="d-block"><h6>TOTAL DEPOSITE</h6></span></div>
                                        </div></Card.Title>


                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md="6" className="mb-4">
                                <Card>
                                    <Card.Body>

                                        <Card.Title> <div className="row"><div className="col-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={50} height={50} color={"#000000"} fill={"none"}>
                                            <path d="M20.774 18C21.5233 18 22.1193 17.5285 22.6545 16.8691C23.7499 15.5194 21.9513 14.4408 21.2654 13.9126C20.568 13.3756 19.7894 13.0714 19 13M18 11C19.3807 11 20.5 9.88071 20.5 8.5C20.5 7.11929 19.3807 6 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M3.22596 18C2.47666 18 1.88067 17.5285 1.34555 16.8691C0.250089 15.5194 2.04867 14.4408 2.73465 13.9126C3.43197 13.3756 4.21058 13.0714 5 13M5.5 11C4.11929 11 3 9.88071 3 8.5C3 7.11929 4.11929 6 5.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M8.0838 15.1112C7.06203 15.743 4.38299 17.0331 6.0147 18.6474C6.81178 19.436 7.69952 20 8.81563 20H15.1844C16.3005 20 17.1882 19.436 17.9853 18.6474C19.617 17.0331 16.938 15.743 15.9162 15.1112C13.5201 13.6296 10.4799 13.6296 8.0838 15.1112Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>  </div><div className="col-auto"> <p>{data?.total_signup}</p>  <span className="d-block"><h6>TOTAL SIGNUP</h6></span></div>
                                        </div></Card.Title>


                                    </Card.Body>
                                </Card>
                            </Col>


                            <Col md="6" className="mb-4">
                                <Card>
                                    <Card.Body>

                                        <Card.Title> <div className="row"><div className="col-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={50} height={50} color={"#000000"} fill={"none"}>
                                            <path d="M12 17C10.3264 17 8.86971 18.265 8.11766 20.1312C7.75846 21.0225 8.27389 22 8.95877 22H15.0412C15.7261 22 16.2415 21.0225 15.8823 20.1312C15.1303 18.265 13.6736 17 12 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M18.5 5H19.7022C20.9031 5 21.5035 5 21.8168 5.37736C22.13 5.75472 21.9998 6.32113 21.7393 7.45395L21.3485 9.15307C20.7609 11.7086 18.6109 13.6088 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5.5 5H4.29779C3.09692 5 2.49649 5 2.18324 5.37736C1.86999 5.75472 2.00024 6.32113 2.26075 7.45395L2.65148 9.15307C3.23914 11.7086 5.38912 13.6088 8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 17C15.0208 17 17.565 12.3379 18.3297 5.99089C18.5412 4.23558 18.647 3.35793 18.0868 2.67896C17.5267 2 16.6223 2 14.8134 2H9.18658C7.37775 2 6.47333 2 5.91317 2.67896C5.35301 3.35793 5.45875 4.23558 5.67025 5.99089C6.435 12.3379 8.97923 17 12 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>  </div><div className="col-auto">  <p>{data?.total_win}</p> <span className="d-block"><h6>TOTAL WIN</h6></span></div>
                                        </div></Card.Title>


                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md="6" className="mb-4">
                                <Card>
                                    <Card.Body>

                                        <Card.Title> <div className="row"><div className="col-auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" color="#000000" fill="none">
                                            <path d="M14 18C18.4183 18 22 14.4183 22 10C22 5.58172 18.4183 2 14 2C9.58172 2 6 5.58172 6 10C6 14.4183 9.58172 18 14 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            <path d="M13.1669 20.9689C12.063 21.6239 10.7742 21.9999 9.3975 21.9999C5.31197 21.9999 2 18.688 2 14.6024C2 13.2258 2.37607 11.9369 3.03107 10.833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        </svg>  </div><div className="col-auto">  <p>{data?.total_withdraw}</p> <span className="d-block"><h6>TOTAL WITHDRAW</h6></span></div>
                                        </div></Card.Title>


                                    </Card.Body>
                                </Card>
                            </Col>


                        </Row>
                    </div>
 
                    <h3 className="text-center" style={{ color: '#000', backgroundColor: 'rgb(118 118 118)', margin: '0px 0px 0px ', padding: '0.8rem' }}>Session Details</h3>


                    <div class="table-responsive" style={{backgroundColor:"white" }}>
                        <table class="table table-striped  rounded-lg ">
                            <thead>
                                <tr>
                                    <th  className="text-center" scope="col">Session ID</th>

                                    <th  className="text-center"scope="col">Collected Amount</th>
                                    <th className="text-center" scope="col">Wining Number</th>
                                    <th  className="text-center" scope="col">Registration Status</th>





                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData?.length > 0 && currentPageData.map(item => (
                                    <tr key={item}>
                                        <td className="text-center">{item.session_id}</td>
                                        <td className="text-center">{item.collection_amount}</td>
                                        <td className="text-center">{item.winning_number}</td>
                                        <td  className="text-center">{item.registration_status}</td>


                                    </tr>
                                ))}
{sessionData?.length === 0&& <td colSpan={4}><h4 className="text-center" >No data!</h4></td>}

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
                                pageCount={Math.ceil(sessionData?.length / itemsPerPage)}
                                onPageChange={handlePageClick}
                                pageClassName="page-item"
                                forcePage={currentPage}
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
                            />

                        </div>

                    </div>

                </Container>
            </Container>}


        </div>
    )
}


export default Dashboard;