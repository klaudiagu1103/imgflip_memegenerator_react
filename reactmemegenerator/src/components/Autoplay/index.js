/**
 * Attempt to build Autoplay for the Imageslider, which we were not able to incorporate into our App
 * Source: https://react-slick.neostack.com/
 */

import React, { Component } from "react";
import Slider from "react-slick"; // Source: https://www.npmjs.com/package/react-slick

export default class AutoPlayMethods extends Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }
  play() {
    this.slider.slickPlay();
  }
  pause() {
    this.slider.slickPause();
  }
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
    return (
      <div>
        <h2>Auto Play & Pause with buttons</h2>
        <Slider ref={(slider) => (this.slider = slider)} {...settings}>
          {/* Insert Content which should be in the Slider here. */}
        </Slider>
        <div style={{ textAlign: "center" }}>
          <button className="button" onClick={this.play}>
            Play
          </button>
          <button className="button" onClick={this.pause}>
            Pause
          </button>
        </div>
      </div>
    );
  }
}
