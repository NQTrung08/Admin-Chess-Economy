import React, { useState, useEffect } from "react";
import { Button, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import "./Customer.css";

const Customer = () => {
  const [customers, setCustomer] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState(null);
  const [modalUpdate, setModalUpdate] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/customers");
      console.log("Fetched customers:", response.data); // Log data
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/customer/${id}`);
      console.log("Customer to update:", response.data); // Log data
      setselectedCustomer(response.data);
      toggleModalUpdate();
    } catch (error) {
      console.error("Error fetching customer for update:", error);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
        console.log("Updating customer:", selectedCustomer); // Log dữ liệu trước khi gửi
        await axios.put(`http://127.0.0.1:5000/customer/${selectedCustomer.id}`, selectedCustomer);
        fetchCustomer();
        toggleModalUpdate();
    } catch (error) {
        console.error("Error updating customer:", error);
    }
};


  const handleUpdateChange = (e, field) => {
    setselectedCustomer({
      ...selectedCustomer,
      [field]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/customer/${id}`);
      fetchCustomer();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const toggleModalUpdate = () => {
    setModalUpdate(!modalUpdate);
  };

  return (
    <Col lg={9} className="customers__content">
      <h3>Customers</h3>
      <div className="table-container">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal isOpen={modalUpdate} toggle={toggleModalUpdate}>
          <ModalHeader toggle={toggleModalUpdate}>Update Customer</ModalHeader>
          <ModalBody>
            {selectedCustomer && (
              <form>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" value={selectedCustomer.name} onChange={(e) => handleUpdateChange(e, "name")} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={selectedCustomer.email} onChange={(e) => handleUpdateChange(e, "email")} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" className="form-control" value={selectedCustomer.role} onChange={(e) => handleUpdateChange(e, "role")} />
                </div>
                {/* Add password field if needed */}
              </form>
            )}
          </ModalBody>
          
        </Modal>
      </div>
    </Col>
  );
};

export default Customer;
