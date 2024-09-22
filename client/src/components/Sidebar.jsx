import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { VscLibrary } from "react-icons/vsc";
import { MdOutlineSecurity } from "react-icons/md";

// Sidebar component
const Sidebar = ({ activeMenu, setActiveMenu }) => {
    return (
        <div className="md:w-64 w-[100px] bg-black md:p-6 p-4 shadow shadow-red-700">
            <h2 className="text-2xl font-bold text-white md:mb-12 hidden md:inline">Settings</h2>
            <ul className="space-y-4 flex flex-col-reverse">
                <li>
                    <button
                        onClick={() => setActiveMenu('changePassword')}
                        className={`text-lg font-semibold w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none flex gap-2 items-center mt-4
                            ${activeMenu === 'changePassword' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                    >
                        <MdOutlineSecurity className="text-2xl" />
                        <span className="hidden md:inline">Change Password</span>
                    </button>
                </li>

                <li>
                    <button
                        onClick={() => setActiveMenu('profile')}
                        className={`text-lg font-semibold w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none flex items-center gap-2
                            ${activeMenu === 'profile' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                    >
                        <CgProfile className='text-2xl' />
                        <span className="hidden md:inline">Profile</span>
                    </button>
                </li>

                <li>
                    <button
                        onClick={() => setActiveMenu('notifications')}
                        className={`text-lg font-semibold w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none flex gap-2 items-center
                            ${activeMenu === 'notifications' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                    >
                        <IoNotificationsOutline className="text-2xl" />
                        <span className="hidden md:inline">Notifications</span>
                    </button>
                </li>

                <li>
                    <button
                        onClick={() => setActiveMenu('myLibrary')}
                        className={`text-lg font-semibold w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none flex gap-2 items-center 
                            ${activeMenu === 'myLibrary' ? 'bg-red-600 text-white' : 'text-gray-400'}`}
                    >
                        <VscLibrary className="text-2xl" />
                        <span className="hidden md:inline">My Library</span>
                    </button>
                </li>
                {/* Add more menu items here */}
            </ul>
        </div>
    );
};

export default Sidebar;