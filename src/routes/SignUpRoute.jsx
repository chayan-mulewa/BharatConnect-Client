import { Route, Routes, Navigate } from 'react-router-dom';
import { SignUp } from '../pages/index';

function SignUpRoute() {
    return (
        <Routes>
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default SignUpRoute;