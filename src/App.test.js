import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const mockAuthValue = {
  currentUser: null,
  role: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  registerResident: jest.fn(),
};

test('renders the login page heading', () => {
  render(
    <AuthContext.Provider value={mockAuthValue}>
      <App />
    </AuthContext.Provider>
  );

  expect(screen.getByText(/universal society login/i)).toBeInTheDocument();
});

test('keeps protected content hidden while auth is still loading', () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ ...mockAuthValue, loading: true }}>
        <ProtectedRoute roleRequired="admin">
          <div>Protected content</div>
        </ProtectedRoute>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
});
