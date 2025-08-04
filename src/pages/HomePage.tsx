// import { useNavigate } from "react-router-dom";

// const HomePage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-main flex items-center justify-center px-4">
//       <div className="  backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 w-full max-w-4xl text-center animate-fade-in-up">
//         <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold  italic drop-shadow-md mb-6">
//           Welcome to the Task Management System
//         </h1>
//         <p className="text-lg sm:text-xl md:text-2xl text-white  font-semibold mb-8">
//           Manage your tasks efficiently and effectively.
//         </p>
//         <div className="flex flex-col md:flex-row gap-6 justify-center">
//           <button
//             onClick={() => navigate("/LoginPage")}
//             className="bg-blue-600/50 hover: text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform hover:scale-105 duration-300"
//           >
//             Get Started
//           </button>
           
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="text-center space-y-8 max-w-2xl px-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Welcome to Task Manager
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          Streamline your workflow with our intuitive task management dashboard. Organize, track, and complete your tasks efficiently.
        </p>
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Link to="/login">Log In to Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;