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
	const [formData, setFormData] = useState({
		name: "",
		featured: "",
		stock_quantity: "",
		price: "",
		desc: "",
		photo: "",
	});

	useEffect(() => {
		fetchTour();
	}, []);

	const fetchTour = async () => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:5000/products"
			);
			setTours(response.data);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching tours:", error);
		}
	};

	//================= HANDLE UPDATE =============
	const handleUpdate = async (id) => {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/products/${id}`
			);
			console.log(response.data);
			setSelectedTour(response.data);
			toggleModalUpdate();
		} catch (error) {
			console.error("Error fetching tour for update:", error);
		}
	};

	const handleUpdateSubmit = async () => {
		try {
			await axios.put(
				`http://127.0.0.1:5000/products/${selectedTour._id}`,
				selectedTour
			);
			fetchTour();
			toggleModalUpdate();
		} catch (error) {
			console.error("Error updating tour:", error);
		}
	};

	const handleUpdateChange = (e, field) => {
		setSelectedTour({
			...selectedTour,
			[field]: e.target.value,
		});
	};

	// ========================= DELETE ===================================

	const handleDelete = async (id) => {
		try {
			await axios.delete(
				`http://127.0.0.1:5000/products/${id}`
			);
			fetchTour();
		} catch (error) {
			console.error("Error deleting tour:", error);
		}
	};

	//===================== HANDLE MODAL ===============
	const toggleModalAdd = () => {
		setModalAdd(!modalAdd);
	};

	const toggleModalUpdate = () => {
		setModalUpdate(!modalUpdate);
	};

	// ===================== HANDLE ADD TOUR =========================

	const handleAddChange = (e, field) => {
		setFormData({
			...formData,
			[field]: e.target.value,
		});
	};

	const handleAddSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				"http://127.0.0.1:5000/products",
				formData
			);
			fetchTour();
			toggleModalAdd();
			// Reset form data after submit
			console.log("Tour added successfully!"); // Log khi tour được thêm thành công
			setFormData({
				name: "",
				featured: "",
				stock_quantity: "",
				price: "",
				desc: "",
				photo: "",
			});
		} catch (error) {
			console.error("Error adding tour:", error);
		}
	};
	/// =================================================================

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
								<tr key={tour.id}>
									<td>
										<img src={tour.photo} alt="" style={{ width: "100px" }} />
									</td>
									<td>{tour.name}</td>
									<td>{tour.featured}</td>
									<td>{tour.stock_quantity}</td>
									<td>{tour.price}</td>
									<td>{tour.discount} %</td>
									<td>
										<Button
											color="btn btn-success"
											onClick={() => handleUpdate(tour.id)}
										>
											<i className="ri-pencil-fill"></i>
										</Button>{" "}
										<Button
											color="btn btn-danger"
											onClick={() => handleDelete(tour.id)}
										>
											<i className="ri-delete-bin-6-line"></i>
										</Button>
									</td>
									<td>
										<Link to={`/tours/${tour.id}`}>Detail</Link>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
				{/* Modal for Update Tour */}
				<Modal isOpen={modalUpdate} toggle={toggleModalUpdate}>
					<ModalHeader toggle={toggleModalUpdate}>Update Tour</ModalHeader>
					<ModalBody>
						{/* Render form to update tour */}
						{selectedTour && (
							<form>
								<div className="form-group">
									<label>Name</label>
									<input
										type="text"
										className="form-control"
										value={selectedTour.name}
										onChange={(e) => handleUpdateChange(e, "name")}
									/>
								</div>
								<div className="form-group">
									<label>Featured</label>
									<input
										type="text"
										className="form-control"
										value={selectedTour.featured}
										onChange={(e) => handleUpdateChange(e, "feature")}
									/>
								</div>
					
								<div className="form-group">
									<label>Stock Quantity</label>
									<input
										type="number"
										className="form-control"
										value={selectedTour.stock_quantity}
										onChange={(e) => handleUpdateChange(e, "stock_quantity")}
									/>
								</div>
							
								<div className="form-group">
									<label>Description</label>
									<input
										type="text"
										className="form-control"
										value={selectedTour.desc}
										onChange={(e) => handleUpdateChange(e, "desc")}
									/>
								</div>
								<div className="form-group">
									<label>Price</label>
									<input
										type="number"
										className="form-control"
										value={selectedTour.price}
										onChange={(e) => handleUpdateChange(e, "price")}
									/>
								</div>

								<div className="form-group">
									<label>Photo</label>
									<input
										type="text"
										className="form-control"
										value={selectedTour.photo}
										onChange={(e) => handleUpdateChange(e, "photo")}
									/>
								</div>
							</form>
						)}
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={handleUpdateSubmit}>
							Update
						</Button>{" "}
						<Button color="secondary" onClick={toggleModalUpdate}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>

				{/* Modal for Add Tour */}
				<Modal isOpen={modalAdd} toggle={toggleModalAdd}>
					<ModalHeader toggle={toggleModalAdd}>Add Tour</ModalHeader>
					<ModalBody>
						{/* Render form to add new tour */}
						<form onSubmit={handleAddSubmit}>
							<div className="form-group">
								<label>Name</label>
								<input
									type="text"
									className="form-control"
									value={formData.name}
									onChange={(e) => handleAddChange(e, "name")}
								/>
							</div>
							<div className="form-group">
								<label>Featured</label>
								<input
									type="text"
									className="form-control"
									value={formData.featured}
									onChange={(e) => handleAddChange(e, "featured")}
								/>
							</div>
				
							<div className="form-group">
								<label>Stock Quantity</label>
								<input
									type="number"
									className="form-control"
									value={formData.stock_quantity}
									onChange={(e) => handleAddChange(e, "stock_quantity")}
								/>
							</div>
							
							<div className="form-group">
								<label>Description</label>
								<input
									type="text"
									className="form-control"
									value={formData.desc}
									onChange={(e) => handleAddChange(e, "desc")}
								/>
							</div>
							<div className="form-group">
								<label>Price</label>
								<input
									type="number"
									className="form-control"
									value={formData.price}
									onChange={(e) => handleAddChange(e, "price")}
								/>
							</div>
							<div className="form-group">
								<label>Photo</label>
								<input
									type="text"
									className="form-control"
									value={formData.photo}
									onChange={(e) => handleAddChange(e, "photo")}
								/>
							</div>
							
						</form>
					</ModalBody>
					<ModalFooter>
					<Button type="submit" color="primary" onClick={handleAddSubmit}>
								Add Tour
							</Button>{" "}
						<Button color="secondary" onClick={toggleModalAdd}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		</Col>
	);
};

export default Tours;
