import { ChartLine, Cloud, History, Settings, User } from 'lucide-react';

const SideBar = () => {

    const menuItems = [
        { name: 'Dashboard', icon: <ChartLine size={20} />, link: '/' },
        { name: 'History', icon: <History size={20} />, link: '/history' },
        { name: 'Settings', icon: <Settings size={20} />, link: '/settings' },
        { name: 'Account', icon: <User size={20} />, link: './account' },
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
                <ul className="space-y-5 font-medium">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <a href={item.link} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                                {item.icon}
                                <span className="ml-3">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>

    )
}
export default SideBar;