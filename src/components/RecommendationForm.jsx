import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addRecommendation } from "../recommendationsSlice";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const RecommendationForm = ({ show, handleClose }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isAuthenticated) {
      dispatch(addRecommendation({ title, author, recommendation }));

      // Show a toast notification
      toast.success("Recommendation submitted");
    } else {
      alert("Please Login before Submitting the Recomendation form");
    }
    // Dispatch an action to save the recommendation details in Redux store

    // Close the modal
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Submit Recommendation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Book Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="recommendation">
            <Form.Label>Recommendation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RecommendationForm;
