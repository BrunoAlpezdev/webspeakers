import './index.css'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Receiver from './pages/Receiver.jsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Transmitter from './pages/Transmitter.jsx'

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/receiver" element={<Receiver />} />
                <Route path="/transmitter" element={<Transmitter />} />
            </Route>
        </Routes>
    </BrowserRouter>
)
