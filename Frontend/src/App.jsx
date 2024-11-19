
import './App.css'
import {Route, RouterProvider, createBrowserRouter,createRoutesFromElements}from 'react-router-dom'
import Signup from './pages/signup'
import Signin from './pages/Signin'
import Profile from './pages/Profile'
import Home from './pages/Home'


function App() {
  const reactRouter=createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Home/>}>
        <Route path='signup' element={<Signup/>}/>
        <Route path='signin' element={<Signin/>}/>
        <Route path='profile' element={<Profile/>}/>
      </Route>

     
    )
    
  )

  return (
    <RouterProvider router={reactRouter}>
     
    </RouterProvider>
  )
}

export default App
