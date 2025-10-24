import { useState } from 'react'
import Introduction from './components/Introduction'
import Auth from './components/Auth'
import Reminder from './components/Reminder'

function App() {

  const [skip,setSkip] = useState(false)
  const [loggedIn,setLoggedIn] = useState(false)
  function handleSkip(){
    setSkip(true)
  }
  function handleLogin(){
    setLoggedIn(true)
  }
  return (
    <>
      {!loggedIn && !skip && <Introduction handleSkip={handleSkip} />}
      {!loggedIn && skip && <Auth fn={handleLogin} />}
      {
        loggedIn && <Reminder/>
      }
    </>
  )
}

export default App
