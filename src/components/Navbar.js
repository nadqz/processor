import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { FaBars} from "react-icons/fa"
import { ImCross } from "react-icons/im"
import './NavbarStyle.css'

const Navbar = () => {
    const [Mobile, setMobile] = useState(false)

  return (
   <nav className='navbar'>
    <Link to='/'><h3 className='logo'>VProce</h3></Link>
    <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
        <Link to='/' className='home'>
            <li>Compress</li>
        </Link>
        <Link to='/convert' className='about'>
            <li>Convert</li>
        </Link>
        <Link to='/crop' className='service'>
            <li>Crop</li>
        </Link>
    </ul>
    <button className='mobile-menu-icon' onClick={() => setMobile(!Mobile)}>
        {Mobile ? <ImCross /> : <FaBars />}
    </button>
   </nav>
  )
}

export default Navbar