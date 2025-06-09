import React,{useEffect} from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'

import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import Layout from './layout/Layout.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import AddProblem from './pages/AddProblem.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
 

const App = () => {

 const{authUser,checkAuth,isCheckingAuth}= useAuthStore()

 useEffect(() => {
  checkAuth()
  
 }, [checkAuth])

 console.log(authUser);
 
 
 if(isCheckingAuth && !authUser){
  return(
     <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
    </div>
  )
 }

  return ( 


    <div className="flex flex-col items-center justify-start">
      <Toaster/>
      <Routes>
        <Route path='/' element={<Layout/>}>

        <Route
          index
          path='/'
          element={authUser ? <HomePage/> : <Navigate to={"/login"}/>}
          />
        </Route>


      
        <Route
          path='/login'
          element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}
          />
        <Route
          path='/signup'
          element={!authUser ? <SignUpPage/> : <Navigate to={"/"}/>}
          />
        <Route
          path='/problem/:id'
          element={authUser ? <ProblemPage/> : <Navigate to={"/login"}/>}
          />

          <Route
          path='/profile'
          element={authUser ? <ProfilePage/> : <Navigate to={"/login"}/>}
          />

         <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/login" />}
          />
        </Route>
      </Routes>
    </div>

  )
}

export default App