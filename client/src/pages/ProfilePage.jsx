import { useState } from "react";
import MainContent from "../components/MainContent";
import Sidebar from "../components/Sidebar";

const ProfilePage = () => {
    const [activeMenu, setActiveMenu] = useState('myLibrary');

    return (
        <div className="flex bg-black min-h-screen">
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            <main className="flex-1 bg-gray-800 text-white">
                <MainContent activeMenu={activeMenu} />
            </main>
        </div>
    );
};

export default ProfilePage;