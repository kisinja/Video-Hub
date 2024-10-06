import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [showColor, setShowColor] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const navItems = [
        {
            id: 1,
            title: "Home",
            path: "/",
        },
        {
            id: 2,
            title: "Upload Video",
            path: "/upload",
        },
        {
            id: 3,
            title: "Watch",
            path: "/videos",
        },
        {
            id: 4,
            title: 'Go Live',
            path: "/create-room"
        }
    ];

    useEffect(() => {
        /* show shadow on navbar when the user scrolls */
        window.onscroll = () => {
            if (scrollY > 1) {
                setShowColor(true);
            } else {
                setShowColor(false);
            }
        };
    }, []);

    const { currentUser } = useSelector((state) => state.user);

    const imgUrl = currentUser?.avatar.startsWith('/uploads/avatars')
        ? `http://localhost:3500${currentUser?.avatar}`  // Fetch from server if it's a custom avatar
        : currentUser?.avatar;

    const dispatch = useDispatch();

    const handleLogout = () => {
        // Remove user from local storage
        localStorage.removeItem('currentUser');

        // Dispatch logout action
        dispatch(logout());

        // Close dropdown
        setShowMobileMenu(false);
    };

    return (
        <nav className={`flex justify-between items-center bg-black py-3 px-[5%] sticky top-0 z-[10000] shadow-md  ${showColor && 'shadow-blue-700'} shadow-white`}>
            <Link to="/">
                <h1 className="text-gray-100 text-2xl font-light">
                    Video <span className="text-red-700">Hub</span>
                </h1>
            </Link>

            {/* Desktop Menu */}
            <ul className="md:flex gap-8 items-center hidden">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        >
                            {item.title}
                        </NavLink>
                    </li>
                ))}

                <li className="relative">
                    <span
                        className="nav-link flex items-center gap-1 relative cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        {currentUser && (
                            <div className="flex items-center gap-2">
                                <img
                                    src={imgUrl}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full border-2 border-red-600 object-cover" // Adjust width and height as needed
                                />
                                {/* Username */}
                                <span className="text-gray-400">{currentUser?.username}</span>
                            </div>
                        )}
                        {!currentUser && 'Account'}

                        {/* Dropdown arrow */}
                        {dropdownOpen ? (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 19L5 12H19L12 19Z" fill="white" />
                            </svg>
                        )}
                    </span>


                    {/* Dropdown */}
                    {dropdownOpen && (
                        <ul className="absolute right-0 mt-2 w-[190px] bg-white border border-gray-300 shadow-lg z-10 rounded-lg space-y-2">
                            {currentUser ? (
                                <>
                                    <li>
                                        <NavLink
                                            to="/profile"
                                            className="flex gap-2 items-center px-5 py-2 text-gray-600 hover:bg-gray-100 text-sm hover:rounded-lg cursor-pointer"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <IoMdSettings
                                                className="text-xl"
                                            />
                                            Settings
                                        </NavLink>
                                    </li>
                                    <li>
                                        <span
                                            to="/profile"
                                            className="flex gap-2 items-center px-5 py-2 text-gray-600 hover:bg-gray-100 text-sm hover:rounded-lg cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt className="text-xl" />
                                            Sign out
                                        </span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <NavLink
                                            to="/signup"
                                            className="block px-4 py-2 text-black hover:bg-gray-100"
                                        >
                                            Sign Up
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/login"
                                            className="block px-4 py-2 text-black hover:bg-gray-100"
                                        >
                                            Login
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    )
                    }
                </li >
            </ul >

            {/* Mobile Menu Toggle */}
            < button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="block md:hidden cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                >
                    {showMobileMenu ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    )}
                </svg>
            </button >

            {/* Mobile Menu */}
            {
                showMobileMenu && (
                    <ul className="md:hidden absolute top-14 left-0 w-full bg-black text-white z-10 px-3">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <NavLink
                                    to={item.path}
                                    className="block py-2 px-4"
                                    onClick={() => setShowMobileMenu(false)} // Close menu on click
                                >
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}

                        {/* Mobile Account Dropdown */}
                        <li className="relative px-2">
                            <span
                                className="nav-link flex items-center gap-1 relative cursor-pointer"
                                onClick={toggleDropdown}
                            >
                                Account
                                {dropdownOpen ? (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 19L5 12H19L12 19Z" fill="white" />
                                    </svg>
                                )}
                            </span>

                            {/* Dropdown for Mobile */}
                            {dropdownOpen && (
                                <ul className="px-6 py-2 bg-opacity-30">
                                    {currentUser ? (
                                        <>
                                            <li>
                                                <NavLink
                                                    to="/profile"
                                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    Profile (<span className="text-white">
                                                        {currentUser.username}
                                                    </span>)
                                                </NavLink>
                                            </li>
                                            <li>
                                                <span
                                                    to="/profile"
                                                    className="flex gap-2 items-center px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm"
                                                    onClick={handleLogout}
                                                >
                                                    Sign out
                                                    <FaSignOutAlt className="text-xl text-red-700" />
                                                </span>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <NavLink
                                                    to="/signup"
                                                    className="block px-4 py-2 text-black hover:bg-gray-100"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    Sign Up
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/login"
                                                    className="block px-4 py-2 text-black hover:bg-gray-100"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    Login
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>
                    </ul>
                )
            }
        </nav >
    );
};

export default Navbar;