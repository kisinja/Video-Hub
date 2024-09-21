import ReactDOM from 'react-dom';

const Modal = ({ onClose, children }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-900 p-6 rounded-lg max-w-lg mx-auto w-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-white"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
