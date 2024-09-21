import { useState } from 'react';
import Modal from './Modal'; // Assuming you have a Modal component
import CommentDetails from './CommentDetails';

const CommentSection = ({ comments, handleCommentSubmit, content, setContent, message, error }) => {
    const [showModal, setShowModal] = useState(false);

    const latestComment = comments.length > 0 ? comments[comments.length - 1] : null;

    const handleShowAllComments = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    


    return (
        <div className="bg-gray-800 p-4">
            <h3 className="text-xl font-semibold mb-4 flex gap-3 items-center">
                Comments <span className=''>{comments.length}</span>
            </h3>

            {latestComment && (
                <CommentDetails comment={latestComment} />
            )}

            {comments.length > 1 && (
                <button
                    onClick={handleShowAllComments}
                    className="text-yellow-400 underline mb-4 hover:italic"
                >
                    See all comments
                </button>
            )}

            <form onSubmit={handleCommentSubmit} className="flex flex-col">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 bg-gray-900 text-white rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                    rows="3"
                    placeholder="Leave a comment..."
                />
                <button
                    type="submit"
                    className="bg-red-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-800 transition duration-200"
                >
                    Add Comment
                </button>
                {message && <div className="message">{message}</div>}
                {error && <div className="error">{error}</div>}
            </form>

            {showModal && (
                <Modal onClose={handleCloseModal}>
                    <h3 className="text-lg font-semibold mb-4 text-white">All Comments</h3>
                    <div className="space-y-1">
                        {comments.map((comment) => (
                            <CommentDetails key={comment._id} comment={comment} />
                        ))}
                    </div>
                    <div className='flex justify-center items-center'>
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 bg-red-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-900 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )
            }
        </div >
    );
};

export default CommentSection;