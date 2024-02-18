import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound404 = () => {
  return (
    <div>
        NotFound404
        <h2>Page Not found</h2>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt magnam officiis voluptas ducimus provident inventore doloremque id cum! Odio, iste quam. Ut delectus hic expedita aliquid repellat. Explicabo, dicta amet.</p>

        <p>Go to the <NavLink to='/'>HomePage</NavLink>.</p>
        </div>
  )
}

export default NotFound404