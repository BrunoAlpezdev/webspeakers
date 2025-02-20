import { Outlet } from 'react-router'
import Header from '../components/Header'

export default function RootLayout() {
    return (
        <body className="min-h-screen">
            <Header />
            <main className="flex justify-center">
                <Outlet />
            </main>
        </body>
    )
}
