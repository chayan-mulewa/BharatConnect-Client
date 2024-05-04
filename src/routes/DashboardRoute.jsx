import { Route, Routes } from "react-router-dom";
import { DashboardWrapper } from '../layouts/index';

function DashboardRoute() {
    return (
        <Routes>
            <Route path="/" element={<DashboardWrapper />} />
        </Routes>
    );
}

export default DashboardRoute;