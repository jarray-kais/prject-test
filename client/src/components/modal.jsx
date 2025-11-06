import { Modal } from "react-bootstrap";

const ModalComponent = ({ show, onHide, title, children, size = "lg" }) => {
  return <div>
    <Modal show={show} onHide={onHide} size={size}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header >
        <Modal.Body>
            {children}
        </Modal.Body>

    </Modal>
  </div>;
};

export default ModalComponent;
