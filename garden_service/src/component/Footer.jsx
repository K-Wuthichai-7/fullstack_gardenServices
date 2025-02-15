import React from 'react'

const Footer = () => {
  return (
    <>
        <div className='footer mt-3'>
            
            <footer className=" sticky-bottom d-flex flex-wrap justify-content-between align-items-center py-3  border-top mt-3" style={{background:'#131f30'}}>
         
                
                <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <svg className="bi" width={30} height={24}><use xlinkHref="#bootstrap" /></svg>
                </a>
               <div>
               <h5 style={{color:'#cbad6c'}}>บริษัท โกลเด้นริเวอร์ เซอร์วิส จำกัด</h5>
               <span style={{color:'#cbad6c'}}> เลขที่ 677/1 ถนนพระราม 4 แขวงรองเมือง เขตปทุมวัน กรุงเทพมหานคร 10330 โทร. 02 096 3579</span>
               </div>
      
                </div>
                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex mx-3">
                <li className="ms-3"><a href="https://lin.ee/LGAKERv" target="_blank" ><img src="/img/linelogo.png" alt="" height={32} width={32} /></a></li>
                <li className="ms-3"><a href="https://www.facebook.com/Goldenriverservice" target="_blank"><img src="/img/facebook_icon.svg" alt="" height={29} width={29} /></a></li>
                <li className="ms-3"><a href="https://www.instagram.com/goldenriverservice/" target="_blank"><img src="/img/ig_logo.png" alt="" height={30} width={30} /></a></li>
                </ul>
            </footer>
        </div>

    </>
  )
}

export default Footer