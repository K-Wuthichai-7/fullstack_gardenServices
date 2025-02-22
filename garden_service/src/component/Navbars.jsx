import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

import Modal_calculate from "./Modal_calculate";
import AuthPage from "../page/AuthPage";

const Navbars = () => {
    const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [Profile, setProFile] = useState(false);
    const [username, setUserName] = useState('');
    const navigate = useNavigate();

    const toAbout = () => navigate("/about");
    const toHome = () => navigate("/");
    const toCustomer = () => navigate("/customer");
    const toServiceManager = () => navigate("admin/serviceManager");
    const toAdmin = () => navigate("admin");

    // Function to close the Auth modal after login
    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    // Check if user is logged in on mount
    useEffect(() => {
        const users = localStorage.getItem("user");
        if (users) {
            const parsedUser = JSON.parse(users);
            if (parsedUser.message === "Login successful.") {
                setProFile(true); // Set profile state to true if logged in
                setUserName(parsedUser.user.name); // Set username from localStorage
            }
        }
    }, []);

    // Handle Logout functionality
    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user from localStorage
        setProFile(false); // Reset profile state
        setUserName(''); // Clear username
        navigate("/")
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ background: "#131f30" }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img 
                            src="https://goldenriverservicecenter.com/wp-content/uploads/cropped-LOGO-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%88%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%87.png" 
                            alt="#" height={60} className="d-inline-block align-text-top" 
                        />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active text-warning" style={{ cursor: 'pointer' }} onClick={toHome}>หน้าหลัก</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-warning" style={{ cursor: 'pointer' }} onClick={toAbout}>บริการของเรา</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-warning" style={{ cursor: 'pointer' }} onClick={toCustomer}>ลูกค้าของเรา</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-warning" style={{ cursor: 'pointer' }} onClick={() => setIsCalcModalOpen(true)}>คำนวณราคาเบื้องต้น</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    {/* <a className="nav-link text-warning pe-auto" style={{ width: '150px', cursor: 'pointer' }} onClick={toServiceManager}>จัดการบริการ</a> */}
                </div>
                {Profile ? (
                    <div className="mx-2">
                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav">
                            <Nav className="ms-auto">
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="warning" id="dropdown-basic">
                                    <FaUserCircle size={24} /> {username ? username.length > 15 ? username.slice(0, 15) + "..." : username : <span>Not found</span>}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={toServiceManager}>Admin</Dropdown.Item>
                                        <Dropdown.Item href="#">Settings</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                ) : (
                    <div className="mx-1" style={{ width: '150px' }}>
                        <Button variant="warning" onClick={() => setIsAuthModalOpen(true)}>เข้าสู่ระบบ</Button>
                    </div>
                )}
            </nav>

            {/* Modal คำนวณราคา */}
            <Modal show={isCalcModalOpen} onHide={() => setIsCalcModalOpen(false)}>
                <Modal.Body>
                    <Modal_calculate closeModal={() => setIsCalcModalOpen(false)} />
                </Modal.Body>
            </Modal>

            {/* Modal เข้าสู่ระบบ */}
            <Modal show={isAuthModalOpen} onHide={() => setIsAuthModalOpen(false)}>
                <Modal.Body>
                    <AuthPage closeModal={handleCloseAuthModal} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Navbars;
