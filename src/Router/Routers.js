import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainDash from "../components/MainDash/MainDash.jsx";
import Customer from "../components/Customer/Customer.jsx";
import Products from "../components/Products/Products.jsx";
import ProductsDetail from "../components/Products/ProductsDetail.jsx";
import Orders from "../components/Orders/Orders.jsx"

const Routers = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate replace to='/mainDash' />} />
			<Route path="/mainDash" element={<MainDash />} />
			<Route path="/customers" element={<Customer />} />
			<Route path="/products" element={<Products/>}/>
			<Route path="/products/:id" element={<ProductsDetail />} />
			<Route path="/orders" element={<Orders/>}/>
		</Routes>
	);
};

export default Routers;
