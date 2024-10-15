import React from "react";
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/pagination";
import "swiper/css";

//Images
import img2 from './../../../../images/image2.png';
import pic1 from './../../../../images/roomgrid-img/pic-1.jpg';
import pic2 from './../../../../images/roomgrid-img/pic-2.jpg';
import pic3 from './../../../../images/roomgrid-img/pic-3.jpg';
import pic4 from './../../../../images/roomgrid-img/pic-4.jpg';
import pic5 from './../../../../images/roomgrid-img/pic-5.jpg';
import pic6 from './../../../../images/roomgrid-img/pic-6.jpg';
import pic7 from './../../../../images/roomgrid-img/pic-7.jpg';
import pic8 from './../../../../images/roomgrid-img/pic-8.jpg';



import SwiperCore, { Autoplay, Pagination } from 'swiper';
SwiperCore.use([Pagination]);

//SwiperCore.use([EffectCoverflow,Pagination]);

const RoomData = [
    { image: img2, title: 'AVAILABLE', details: '404 Brrom Str, Fl2', classChange: 'badge-success' },
    { image: pic1, title: 'Booked', details: '235 Cream, G32', classChange: 'badge-primary' },
    { image: pic2, title: 'AVAILABLE', details: '992 Green, HF', classChange: 'badge-success' },
    { image: pic3, title: 'AVAILABLE', details: '914 White Cream', classChange: 'badge-success' },
    { image: pic4, title: 'Booked', details: '172 Grey 22F, JF', classChange: 'badge-primary' },
    { image: pic5, title: 'Booked', details: '235 Cream, G32', classChange: 'badge-primary' },
    { image: pic6, title: 'AVAILABLE', details: '82 Green, HF', classChange: 'badge-success' },
    { image: pic7, title: 'Booked', details: '409 Brrom Str, Fl2', classChange: 'badge-primary' },
    { image: pic8, title: 'AVAILABLE', details: '35 Grey 22F, JF', classChange: 'badge-success' },
];

export default function RoomsSlider(data) {
    // console.log('parkingsList: ', data.parkingsList);
    const paginationRef = React.useRef(null)



    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-sm-0 mb-2">
                <h2 className="font-w500">Current Parkings</h2>
                <div ref={paginationRef} className="swiper-pagination style-1 room-swiper-pagination"></div>
            </div>
            <Swiper className="swiper front-view-slider"
                speed={1500}
                slidesPerView={5}
                spaceBetween={30}
                centeredSlides={false}
                loop={false}
                //pagination = {true}
                pagination={{
                    //el: paginationRef.current
                    el: '.room-swiper-pagination',
                    clickable: true,
                    /* renderBullet: function (index, className) {									
                      return '<div class="' + className + '">'+ (aboutBlog[index].datatitle) +'<span> 0'+ (index + 1) +'</span>' + '</div>';
                    }, */
                }}
                // autoplay={{
                //     delay: 0,
                // }}
                autoplay={false}
                modules={[Pagination]}
            // breakpoints={{
            //     360: {
            //         slidesPerView: 1,
            //         spaceBetween: 20,
            //     },
            //     575: {
            //         slidesPerView: 3,
            //         spaceBetween: 20,
            //     },
            //     768: {
            //         slidesPerView: 3,
            //         spaceBetween: 20,
            //     },
            //     1024: {
            //         slidesPerView: 3,
            //     },
            //     1400: {
            //         slidesPerView: 5,
            //         spaceBetween: 20,
            //     },
            //     1600: {
            //         slidesPerView: 5,
            //         spaceBetween: 30,
            //     },
            // }}
            >
                {/* {RoomData.map((d, i) => (
                    <SwiperSlide key={i}>
                        <div className="popular-rooms">
                            <img src={d.image} alt="image" />
                            <div className="content">
                                <span className={`badge ${d.classChange}`}>{d.title}</span>
                                <h3 className="font-w500 text-white pt-3 pb-2 m-0"><Link to={"#"}>{d.details}</Link></h3>
                                <span className="font-w400 text-white">Type 234</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))} */}

                {data.parkingsList.map((d, i) => (
                    <SwiperSlide key={i}
                    //  className={d._id == data.currentParkingIdForGraph ? 'swiper-slide-active' : ''}
                    >
                        <div className="popular-rooms" onClick={e => { console.log(d._id); e.stopPropagation(); data.update(d._id) }}>
                            <img src={RoomData[i].image} alt="image" />
                            <div className="content">
                                {/* <span className={`badge badge-success`}>{d.parkingNo}</span> */}
                                <h3 className="font-w500 text-white pt-3 pb-2 m-0">{d.parkingName} - {d.parkingNo}</h3>
                                <span className="font-w400 text-white">{d.address}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}