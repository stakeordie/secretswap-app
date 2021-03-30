import React from 'react';
import  "./header.scss";
import Secret_swap from '../../../public/static/secret-swap.svg';

const Header = () =>{

    return(
        <>
            <nav className="menu">

                {/* <div className="content_brand">
                    <div className="brand">
                        <img src={Secret_swap} alt="Logo" className="icon"></img>
                        <p>Secret Swap</p>
                    </div>
                </div> */}
                
                <ul>

                    {/* Brand Icon */}
                    <li><a href="#">Swap</a></li>
                    <li><a href="#">Pool</a></li>
                    <li><a href="#">Earn</a></li>
                    <li><a href="#">Governance</a></li>

                </ul>

                <div className="">
                     {/* Buttons */}
                     <button className="btn-main">
                        <li><a href="#">324 SCRT</a></li>
                    </button>
                    <button className="btn-secondary">
                        <li><a href="#">324 SEFI</a></li>
                    </button>
                </div>
            </nav>


        </>
    )

}

export default Header;