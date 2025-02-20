import './index.css'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Sync from './pages/Sync.jsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/sync" element={<Sync />} />
            </Route>
        </Routes>
    </BrowserRouter>
)
