import { BrowserRouter } from 'react-router-dom';
import { DashboardRoute, SignInRoute, SignUpRoute, InvalidRoute, ResetPasswordRoute } from './routes/index';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <DashboardRoute />
      <SignInRoute />
      <SignUpRoute />
      <InvalidRoute />
      <ResetPasswordRoute />
    </BrowserRouter>
  );
}

export default App;