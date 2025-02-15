import React from 'react';

const Customer = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="row">
        {[
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/pic2_2.jpg", alt: "เอ สเปซ มี สุขุมวิท 77" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/A-SPACE-sukhumvit-77.jpg", alt: "เอ สเปซ สุขุมวิท 77" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/%E0%B8%94%E0%B8%B2%E0%B8%A7%E0%B8%99%E0%B9%8C%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94-1.jpg", alt: "พาร์คแลนด์ บางนา" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/e2.jpg", alt: "เออร์บิเทีย ทองหล่อ" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/%E0%B8%A3%E0%B8%A7%E0%B8%A1%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD-%E0%B8%82%E0%B8%B2%E0%B8%A2-%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2-%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%94-%E0%B9%80%E0%B8%8B%E0%B8%B5%E0%B8%A2%E0%B8%A5%E0%B9%88%E0%B8%B2-%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%9B%E0%B8%97%E0%B8%B8%E0%B8%A1-Ciela-Sripatum.jpg", alt: "เซียล่า ศรีปทุม" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/1550728662863.jpg", alt: "ไอดีโอ มิกซ์ สุขุมวิท 103" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/6252692901a43_admin_53841.jpeg", alt: "นิชโมโน สุขุมวิท 50" },
          { src: "https://goldenriverservicecenter.com/wp-content/uploads/%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B2%E0%B8%97%E0%B8%B1%E0%B8%A2.png", alt: "ชีวาทัย เรสซิเดนซ์ อโศก" },
        ].map((image, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img
                src={image.src}
                className="rounded img-fluid w-100 h-100"
                style={{ objectFit: 'cover' }}
                alt={image.alt}
              />
            </div>
            <p className="mt-2">{image.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customer;