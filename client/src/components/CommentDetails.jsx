import { MdOutlineWatchLater } from "react-icons/md";
import { formatDate } from "../formatDate";
import { useSelector } from "react-redux";

const CommentDetails = ({ comment }) => {

    const imgUrl = comment.userId?.avatar.startsWith('/uploads/avatar') ? `http://localhost:3500${comment.userId?.avatar}` : comment.userId?.avatar;

    const onlineUsers = useSelector(state => state.user.onlineUsers);

    console.log(onlineUsers);

    return (
        <div className="bg-gray-700 p-3 rounded-lg mb-4">
            <div>
                <div className='flex items-center gap-2'>
                    <img
                        src={imgUrl}
                        alt="Uploader Avatar"
                        className="w-10 h-10 rounded-full relative"
                    />

                    <p className='text-sm text-red-400 tracking-wider'>{comment.userId.username}</p>
                </div>
                <p className='text-gray-300 mt-2'>{comment.content}</p>
                <p className="text-gray-500 text-xs mt-2 flex gap-2 items-center">
                    <span className=''>
                        <MdOutlineWatchLater className='text-lg' />
                    </span>
                    {formatDate(comment.createdAt)}
                </p>
            </div>
        </div>
    );
};

export default CommentDetails;