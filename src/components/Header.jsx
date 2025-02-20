import { NavLink } from 'react-router'

export default function Header() {
    return (
        <div className="flex justify-center">
            <nav className="flex gap-4 bg-black/20 backdrop-blur-md border-[1px] border-white/10 shadow-sm m-2 rounded-full py-3 px-6">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? 'transition-all text-yellow-100'
                            : 'transition-all'
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/transmitter"
                    className={({ isActive }) =>
                        isActive
                            ? 'transition-all text-yellow-100'
                            : 'transition-all'
                    }
                >
                    Transmitter
                </NavLink>
                <NavLink
                    to="/receiver"
                    className={({ isActive }) =>
                        isActive
                            ? 'transition-all text-yellow-100'
                            : 'transition-all'
                    }
                >
                    Receiver
                </NavLink>
            </nav>
        </div>
    )
}
