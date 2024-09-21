import { Link } from "react-router-dom"

const Footer = () => {

    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto text-center text-gray-400">
                <p>&copy; {year} VideoStream. All rights reserved.</p>
                <div className="mt-4">
                    <Link to="/about" className="text-gray-400 hover:text-white mx-2">About Us</Link>
                    <Link to="/contact" className="text-gray-400 hover:text-white mx-2">Contact</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer