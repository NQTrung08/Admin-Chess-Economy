import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Col,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import "./Tours.css";
import axios from "axios";

const Tours = () => {
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState(null);
    const [modalAdd, setModalAdd] = useState(false); // State cho modal thêm tour
    const [modalUpdate, setModalUpdate] = useState(false); // State cho modal cập nhật tour
    const [modalUpdateDiscount, setModalUpdateDiscount] = useState(false); // State cho modal cập nhật giảm giá
    const [formData, setFormData] = useState({
        name: "",
        featured: "",
        stock_quantity: "",
        price: "",
        desc: "",
        photo: "",
    });
    const [discountData, setDiscountData] = useState({
        productId: null,
        discount: 0,
    });

    useEffect(() => {
        fetchTour();
    }, []);

    const fetchTour = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/products");
            setTours(response.data);
        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    // ===================== HANDLE ADD TOUR =========================
    // Code handleAddChange và handleAddSubmit ở đây
    // ...

    // ====================== HANDLE UPDATE ===========================
    const handleUpdate = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
            setSelectedTour(response.data);
            toggleModalUpdate();
        } catch (error) {
            console.error("Error fetching tour for update:", error);
        }
    };

    // Code handleUpdateChange và handleUpdateSubmit ở đây
    // ...

    // ===================== HANDLE DELETE ===========================
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            fetchTour();
        } catch (error) {
            console.error("Error deleting tour:", error);
        }
    };

    // ===================== HANDLE UPDATE DISCOUNT ===========================
		// Handle Update Discount
	const handleUpdateDiscount = (id, currentDiscount) => {
		setDiscountData({
			productId: id,
			discount: currentDiscount,
		});
		setSelectedTour(tours.find(tour => tour._id === id)); // Thêm dòng này để set giá trị cho selectedTour
		toggleModalUpdateDiscount();
	};

    const handleUpdateDiscountSubmit = async () => {
        try {
            await axios.put(`http://127.0.0.1:5000/product/${discountData.productId}/discount`, { discount: discountData.discount });
            fetchTour();
            toggleModalUpdateDiscount();
        } catch (error) {
            console.error("Error updating discount:", error);
        }
    };

    const handleDiscountChange = (e) => {
        setDiscountData({
            ...discountData,
            discount: e.target.value,
        });
    };

    // ========================================================================

    // ===================== HANDLE MODAL =====================================
    const toggleModalAdd = () => {
        setModalAdd(!modalAdd);
    };

    const toggleModalUpdate = () => {
        setModalUpdate(!modalUpdate);
    };

    const toggleModalUpdateDiscount = () => {
        setModalUpdateDiscount(!modalUpdateDiscount);
    };

    // Render discount trong bảng
    const renderDiscount = (tour) => {
        if (tour.discount && tour.discount > 0) {
            return (
                <>
                    {tour.discount}%
                    <Button
                        color="btn btn-warning"
                        onClick={() => handleUpdateDiscount(tour._id, tour.discount)}
                    >
                        Update Discount
                    </Button>
                </>
            );
        } else {
            return "None";
        }
    };

    return (
        <Col lg={9}>
            <div className="tours__content">
                <h3>Tours</h3>
                <div className="btn__tour--add">
                    <Button color="primary" onClick={toggleModalAdd}>
                        <i className="ri-add-line"></i>
                    </Button>
                </div>
                <div className="table__outer--scroll">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Featured</th>
                                <th>Stock Quantity</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tours.map((tour) => (
                                <tr key={tour._id}>
                                    <td>
                                        <img src={tour.photo} alt="" style={{ width: "100px" }} />
                                    </td>
                                    <td>{tour.name}</td>
                                    <td>{tour.featured}</td>
                                    <td>{tour.stock_quantity}</td>
                                    <td>{tour.price}</td>
                                    <td>{renderDiscount(tour)}</td>
                                    <td>
                                        <Button
                                            color="btn btn-success"
                                            onClick={() => handleUpdate(tour._id)}
                                        >
                                            <i className="ri-pencil-fill"></i>
                                        </Button>{" "}
                                        <Button
                                            color="btn btn-danger"
                                            onClick={() => handleDelete(tour._id)}
                                        >
                                            <i className="ri-delete-bin-6-line"></i>
                                        </Button>
                                    </td>
                                    <td>
                                        <Link to={`/tours/${tour._id}`}>Detail</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Modal isOpen={modalUpdateDiscount} toggle={toggleModalUpdateDiscount}>
                <ModalHeader toggle={toggleModalUpdateDiscount}>Update Discount</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Discount (%)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={discountData.discount}
                            onChange={handleDiscountChange}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdateDiscountSubmit}>
                        Update
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleModalUpdateDiscount}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </Col>
    );
};

export default Tours;
