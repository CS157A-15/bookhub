import React, { Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel'


export default function CarouselItem({imgs: []}) { 
    let carouselItems = [];
    for(let i = 0; i < this.props.imgs.length; i++){
        carouselItems.push(
            <Carousel.Item>
            <img
                className="d-block w-100"
                src = {this.props.imgs[i]}
            />
            </Carousel.Item>
        );
    }
    return (
        <Carousel>
            {carouselItems}
        </Carousel>
    );
}