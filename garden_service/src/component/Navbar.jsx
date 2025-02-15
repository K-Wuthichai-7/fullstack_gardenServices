import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal_calculate from "./Modal_calculate";

const styleMenu = {
    color: '#cbad6c',
    transition: 'color 0.3s ease', // เพิ่มเอฟเฟกต์ transition
    cursor: 'pointer', // เปลี่ยน cursor เป็น pointer เมื่อ hover
};

const styleMenuHover = {
    color: '#ffffff', // สีเมื่อ hover
};

const Navbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [hoveredItem, setHoveredItem] = useState(null); // Hover state
    const navigate = useNavigate();

    const toAbout = () => {
        navigate('/about');
    };

    const toHome = () => {
        navigate('/');
    };

    const toCustomer = () => {
        navigate('/customer');
    };
    const toServiceManager = () => {
        navigate('/service_manager');
    };

    // Function to open modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle hover
    const handleMouseEnter = (index) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ background: '#131f30' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="https://goldenriverservicecenter.com/wp-content/uploads/cropped-LOGO-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%88%E0%B8%87%E0%B9%81%E0%B8%AA%E0%B8%87.png" alt="#" height={60} className="d-inline-block align-text-top" />
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse " id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    style={hoveredItem === 0 ? { ...styleMenu, ...styleMenuHover } : styleMenu}
                                    onClick={toHome}
                                    onMouseEnter={() => handleMouseEnter(0)}
                                    onMouseLeave={handleMouseLeave}
                                    aria-current="page"
                                    href="#"
                                >
                                    หน้าหลัก
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    style={hoveredItem === 1 ? { ...styleMenu, ...styleMenuHover } : styleMenu}
                                    onClick={toAbout}
                                    onMouseEnter={() => handleMouseEnter(1)}
                                    onMouseLeave={handleMouseLeave}
                                    href="#"
                                >
                                    บริการของเรา
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    style={hoveredItem === 2 ? { ...styleMenu, ...styleMenuHover } : styleMenu}
                                    onClick={toCustomer}
                                    onMouseEnter={() => handleMouseEnter(2)}
                                    onMouseLeave={handleMouseLeave}
                                    href="#"
                                >
                                    ลูกค้าของเรา
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    style={hoveredItem === 3 ? { ...styleMenu, ...styleMenuHover } : styleMenu}
                                    tabIndex={-1}
                                    aria-disabled="true"
                                    onMouseEnter={() => handleMouseEnter(3)}
                                    onMouseLeave={handleMouseLeave}
                                    href="#"
                                >
                                    ประชาสัมพันธ์
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    style={hoveredItem === 4 ? { ...styleMenu, ...styleMenuHover } : styleMenu}
                                    tabIndex={-1}
                                    aria-disabled="true"
                                    onClick={openModal}
                                    onMouseEnter={() => handleMouseEnter(4)}
                                    onMouseLeave={handleMouseLeave}
                                    href="#"
                                >
                                    คำนวนราคาเบื้องต้น
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                <a 
                style={{ color: '#cbad6c', width: '100px', display: 'inline-block', transition: 'color 0.2s ease-in-out',cursor: 'pointer'  }} 
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#cbad6c"}
                onClick={toServiceManager}
                >
                จัดการบริการ
                </a>

                </div>
                <div className="mx-3">
                    <button className="btn btn-warning " style={{ width: '100px' }}>เข้าสู่ระบบ</button>
                </div>
            </nav>

            {/* Overlay when modal is open */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal} />
            )}

            {/* Modal that opens when clicked */}
            {isModalOpen && <Modal_calculate closeModal={closeModal} />}
        </>
    );
};

export default Navbar;