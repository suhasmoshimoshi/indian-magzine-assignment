import React from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeRecommendation } from "../recommendationsSlice";

const RecommendedBookList = ({ show, handleShow, handleClose }) => {
  const recommendations = useSelector(
    (state) => state.recommendations.recommendations
  );
  const dispatch = useDispatch();

  const handleRemove = (index) => {
    dispatch(removeRecommendation(index));
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Recommended Book List
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Recommended Books</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {recommendations.map((book, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {book.author}
                </Card.Subtitle>
                <Card.Text>{book.recommendation}</Card.Text>
                <Button variant="danger" onClick={() => handleRemove(index)}>
                  Remove
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecommendedBookList;
