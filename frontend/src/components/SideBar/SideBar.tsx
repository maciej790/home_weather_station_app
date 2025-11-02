import { ChartLine, Cloud, History, Settings, User } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';


const SideBar = () => {
    const { pathname } = useLocation();
    const menuItems = [
        { name: 'Dashboard', icon: <ChartLine size={20} />, link: '/' },
        { name: 'History', icon: <History size={20} />, link: '/history' },
        { name: 'Settings', icon: <Settings size={20} />, link: '/settings' },
        { name: 'Account', icon: <User size={20} />, link: '/account' },
    ];

    return (
        <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-md"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-4 overflow-y-auto bg-white">
                <div className='flex items-center p-3 pb-8 mb-6 bg-white border-b border-gray-200'>
                    <div className='flex items-center rounded-xl justify-center bg-blue-600 p-2 mr-4'>
                        <Cloud className='text-white' size={35} />
                    </div>

                    <h1 className='text-left font-bold text-gray-800'>
                        Home weather station app
                        <span>
                            <p className='text-gray-500 text-sm'>IoT</p>
                        </span>
                    </h1>
                </div>
                <ul className="space-y-2 font-medium">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.link;

                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.link}
                                    className={`
                                        flex items-center p-3 rounded-xl transition-colors
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-md' // Styl aktywnego linku
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' // Styl nieaktywnego linku
                                        }
                                    `}
                                >
                                    {/* Upewnienie się, że ikona ma odpowiedni kolor w aktywnym stanie */}
                                    <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`}>
                                        {item.icon}
                                    </span>

                                    <span className="font-semibold">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </aside>

    )
}
export default SideBar;