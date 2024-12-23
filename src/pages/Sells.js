import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sells = () => {
  const navigate = useNavigate();
  return (
    <div>
      Sells
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default Sells