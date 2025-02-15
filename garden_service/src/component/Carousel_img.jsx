import React from "react";
import img from "../assets/img/content.jpg";
import img_2 from "../assets/img/content-2.jpg";
// import img_3 from "../assets/img/content-3.jpg";

const Carousel_img = () => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" >
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={1} aria-label="Slide 2" />
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={2} aria-label="Slide 3" />
      </div>

      <div className="carousel-inner" style={{ maxHeight: "600px", overflow: "hidden" }}>
        <div className="carousel-item active">
          <img src={img} className="d-block w-100" alt="#" style={{ height: "600px", objectFit: "cover" }} />
        </div>
        <div className="carousel-item">
          <img src={img_2} className="d-block w-100" alt="#" style={{ height: "600px", objectFit: "cover" }} />
        </div>
        {/* <div className="carousel-item">
          <img src={img_3} className="d-block w-100" alt="#" style={{ height: "600px", objectFit: "cover" }} />
        </div> */}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel_img;
