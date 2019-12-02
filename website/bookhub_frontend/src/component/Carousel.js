// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Carousel from 'react-bootstrap/Carousel';
// import Image from 'react-bootstrap/Image';


// export default function CarouselItem(imgs) {
//     let carouselItems = [];
//     for (let i = 0; i < imgs.length; i++) {
//         carouselItems.push(
//             <Carousel.Item>
//                 {/* <img
//                     className="d-block w-100"
//                     src={imgs[i]}
//                 /> */}

//                 <Image src={imgs[i]} fluid />;
//             </Carousel.Item>
//         );
//     }
//     return (
//         <Carousel>
//             {carouselItems}
//         </Carousel>
//     );
// }

import React from "react";
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBView, MDBContainer } from
    "mdbreact";


function createCItemList(imgs) {
    let carouselItems = [];
    for (let i = 0; i < imgs.length; i++) {
        console.log("in for loop");
        // let cItem = 
        carouselItems.push(
            <MDBCarouselItem itemId={i + 1}>
                <MDBView>
                    <img
                        className="d-block w-100"
                        src={imgs[i]}
                        id={"img"+i}
                    />
                </MDBView>
            </MDBCarouselItem>
        );
        console.log(imgs[i]);
    }
    return carouselItems;
}
const CarouselItem = (imgs, img1, img2, img3) => {

    let CItems = createCItemList (imgs);


    return (
        <MDBContainer>
            <MDBCarousel
                activeItem={1}
                length={3}
                showControls={true}
                showIndicators={true}
                className="z-depth-1"
            >
                <MDBCarouselInner>
                    {/* <MDBCarouselItem itemId="1">
                        <MDBView>
                            <img
                                className="d-block w-100"
                                src={"https://www.qualtrics.com/m/assets/blog/wp-content/uploads/2018/08/shutterstoc"+"k_1068141515.jpg"}
                                alt="First slide"
                            />
                        </MDBView>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="2">
                        <MDBView>
                            <img
                                className="d-block w-100"
                                src={img1}
                                alt="Second slide"
                            />
                        </MDBView>
                    </MDBCarouselItem>
                    <MDBCarouselItem itemId="3">
                        <MDBView>
                            <img
                                className="d-block w-100"
                                src={img1}
                                alt="Third slide"
                            />
                        </MDBView>
                    </MDBCarouselItem> */}
                    {CItems}
                </MDBCarouselInner>
            </MDBCarousel>
        </MDBContainer>
    );
}

export default CarouselItem;