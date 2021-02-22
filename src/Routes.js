import React from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import AddEntry from './pages/AddEntry'
import Payment from './pages/PaymentCondition'
import SearchEntry from './pages/SearchEntry'
import Reports from './pages/Reports'

export  const routes = {
    "/": () => <Login />,
    "/home": () => <Home />,
    "/addEntry":() => <AddEntry />,
     "/payment":() => <Payment />,
      "/search":() => <SearchEntry />,
     "/reports": () => <Reports />
  };
  