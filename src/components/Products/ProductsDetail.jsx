import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Container, Form, ListGroup, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import "./productDetail.css";
import axios from "axios";
const ProductsDetail = () => {
	// lấy giá trị id từ URL;
	const { id } = useParams();

	//// Khởi tạo reviewMsgRef với giá trị là chuỗi rỗng
	const reviewMsgRef = useRef("");
	const [tourRating, setTourRating] = useState(0);
	const [product, setProducts] = useState([]);

	useEffect(() => {
		fetchTour();
	}, []);

	const fetchTour = async () => {
		try {
			const response = await axios.get(
				`http://127.0.0.1:5000/product/${id}`
			);
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching tours:", error);
		}
	};
	console.log(product);

	const {
		photo,
		name,
		description,
		price,
		reviews,
		featured,
		stock_quantity,
	} = product;

	const totalRating = reviews?.reduce((acc, item) => acc + item.rating, 0);
	let avgRating;
	if (totalRating === 0) {
		avgRating = "";
	} else {
		if (totalRating === 1) {
			avgRating = totalRating;
		} else {
			avgRating = totalRating / reviews?.length?.toFixed(1);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [product]);

	const handleGoBack = () => {
		window.history.back(); // Quay lại trang trước trong lịch sử duyệt
	};
	return (
		<Col lg={9}>
			<div className="tour__content">
				<div className="heading__tours d-flex align-items-center gap-3">
					<div className="btn--back" onClick={handleGoBack}>
						<i class="fa ri-arrow-left-circle-fill"></i>
					</div>
					<h2>Product Details</h2>
				</div>
				<img src={photo} alt="" />

				<div className="tour__info">
					<h2>{name}</h2>

					{/* <div className="d-flex align-items-center gap-5">
						<span className="tour__rating d-flex items-center gap-1">
							<i class="ri-star-fill"></i>
							{avgRating === 0 ? null : avgRating}
							{totalRating === 0 ? (
								"Not rated"
							) : (
								<span>({reviews?.length})</span>
							)}
						</span>

						
					</div> */}

					<div className="tour__extra--details">
						<span>
							<i className="ri-map-pin-2-line"></i> {featured}
						</span>
						<span>
							<i className="ri-money-dollar-circle-line"></i> ${price} VND
						</span>
						<span className="quantity--icon">
							<i className=""></i>in stock {stock_quantity} 
						</span>
						
					
					</div>
					<div className="tour__desc">
						<h5>Description</h5>
						<p>{description}</p>
					</div>
				</div>

				{/*+++=============== Review ================*/}

				{/* <div className="tour__reviews mt-4">
					<h4>Reviews ({reviews?.length} reviews)</h4>
				</div> */}
			</div>
		</Col>
	);
};

export default ProductsDetail;
