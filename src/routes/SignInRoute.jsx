import { Route, Routes, Navigate } from 'react-router-dom';
import { SignIn } from '../pages/index';

function SignInRoute() {
    return (
        <Routes>
            <Route path="/signin" element={<SignIn />} />
        </Routes>
    );
}

export default SignInRoute;