import MyLibrary from "./MyLibrary";
import Notifications from "./Notifications";
import Profile from "./Profile";

const MainContent = ({ activeMenu }) => {
    if (activeMenu === 'profile') {
        return <Profile />;
    }
    if (activeMenu === 'notifications') {
        return <Notifications />;
    }
    if (activeMenu === 'myLibrary') {
        return <MyLibrary />;
    }
    // Additional submenu content goes here
    return null;
};

export default MainContent;