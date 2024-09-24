import ChangePassword from "./ChangePassword";
import MyLibrary from "./MyLibrary";
import Notifications from "./Notifications";
import Profile from "./Profile";

const MainContent = ({ activeMenu, setActiveMenu }) => {
    if (activeMenu === 'profile') {
        return <Profile />;
    }
    if (activeMenu === 'notifications') {
        return <Notifications />;
    }
    if (activeMenu === 'myLibrary') {
        return <MyLibrary setActiveMenu={setActiveMenu} />;
    }
    if (activeMenu === 'changePassword') {
        return <ChangePassword />;
    }
    // Additional submenu content goes here
    return null;
};

export default MainContent;