import { useState } from 'react'

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Heading } from './components/Heading'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { SendMoney } from './pages/SendMoney'
import { Dashboard } from './pages/Dashboard'
import { Success } from './pages/success'

function App() {

  return (
    <>

      <BrowserRouter>

        <Routes>
        <Route path='/' element={<Signup/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin' element= {<Signin/>} />
          <Route path='/dashboard' element= {<Dashboard/>} />
          <Route path='/send' element= {<SendMoney/>} />
          <Route path='/success' element= {<Success/>} />
        </Routes>

      </BrowserRouter>
     


    </>
  )
}

export default App



