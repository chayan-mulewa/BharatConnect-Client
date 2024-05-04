import { Route, Routes, Navigate } from 'react-router-dom';
import { ResetPassword } from '../pages/index';

function ResetPasswordRoute() {
    return (
        <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    );
}

export default ResetPasswordRoute;