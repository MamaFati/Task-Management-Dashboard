// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import AppLogo from '@/assets/ AppLogo.png';  

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="bg-blue-600/50 text-white shadow-md">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center space-x-2">
//           <Link to="/"><img src={AppLogo} alt="App Logo" className="h-10 w-auto" /></Link>
//           <span className="text-xl font-semibold">Task Manager</span>
//         </div>

        
//         <div className="hidden md:flex space-x-6">
//           <Link to="/LoginPage" className="hover:text-yellow-300 transition-colors">LogIn</Link>
//           <Link to="/SigupPage" className="hover:text-yellow-300 transition-colors">SignUp</Link>
//         </div>

//         {/* Mobile menu button */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="focus:outline-none"
//           >
//             {/* Hamburger Icon */}
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               {menuOpen ? (
//                 // Close icon
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 // Hamburger icon
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
//               )}
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-blue-500 px-4 pb-4 space-y-2">
//           <Link to="/LoginPage" className="block hover:text-yellow-300">LogIn</Link>
//           <Link to="/SigupPage" className="block hover:text-yellow-300">SignUp</Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button} from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Task Manager
        </a>
        <div className="hidden sm:flex items-center space-x-6">
          <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </a>
          {isAuthenticated ? (
            <>
              <a
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Dashboard
              </a>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                Logout
              </Button>
            </>
          ) : (
            <a
              href="/login"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Login
            </a>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="sm:hidden">
            <Button variant="ghost" className="p-2">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
            <DropdownMenuItem asChild>
              <a href="/" className="text-gray-600 dark:text-gray-300">Home</a>
            </DropdownMenuItem>
            {isAuthenticated ? (
              <>
                <DropdownMenuItem asChild>
                  <a href="/dashboard" className="text-gray-600 dark:text-gray-300">Dashboard</a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-gray-600 dark:text-gray-300">
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <a href="/login" className="text-gray-600 dark:text-gray-300">Login</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;