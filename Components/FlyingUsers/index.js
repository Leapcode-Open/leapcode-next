import { Noise } from 'noisejs';
import React, { useState } from 'react';
const CANVAS_WIDTH = 2300;
// The amplitude. The amount the noise affects the movement.
const NOISE_AMOUNT = 5;
// The frequency. Smaller for flat slopes, higher for jagged spikes.
const NOISE_SPEED = 0.004;
// Pixels to move per frame. At 60fps, this would be 18px a sec.
const SCROLL_SPEED = 0.3;

const noise = new Noise();
const bubbles = [
    {
      s: 0.6,
      x: 934,
      y: 45,
    },
    {
      s: 0.6,
      x: 998,
      y: 231,
    },
    {
      s: 0.6,
      x: 1361,
      y: 242,
    },
    {
      s: 0.6,
      x: 1799,
      y: 49,
    },
    {
      s: 0.8,
      x: 450,
      y: 264,
    },
    {
      s: 0.6,
      x: 2271,
      y: 226,
    },
    {
      s: 0.6,
      x: 795,
      y: 176,
    },
    {
      s: 0.6,
      x: 276,
      y: 226,
    },
    {
      s: 0.6,
      x: 1110,
      y: 145,
    },
    {
      s: 0.6,
      x: 464,
      y: 93,
    },
    {
      s: 0.6,
      x: 2545,
      y: 267,
    },
    {
      s: 0.8,
      x: 703,
      y: 43,
    },
    {
      s: 0.8,
      x: 1207,
      y: 58,
    },
    {
      s: 0.8,
      x: 633,
      y: 220,
    },
    {
      s: 0.8,
      x: 323,
      y: 60,
    },
    {
      s: 0.8,
      x: 129,
      y: 257,
    },
    {
      s: 0.8,
      x: 1420,
      y: 102,
    },
    {
      s: 0.8,
      x: 1629,
      y: 253,
    },
    {
      s: 0.8,
      x: 1935,
      y: 140,
    },
    {
      s: 0.8,
      x: 2176,
      y: 82,
    },
    {
      s: 0.8,
      x: 2654,
      y: 162,
    },
    {
      s: 0.8,
      x: 2783,
      y: 60,
    },
    {
      s: 1.0,
      x: 1519,
      y: 118,
    },
    {
      s: 1.0,
      x: 1071,
      y: 203,
    },
    {
      s: 1.0,
      x: 1773,
      y: 148,
    },
    {
      s: 1.0,
      x: 2098,
      y: 285,
    },
    {
      s: 1.0,
      x: 2423,
      y: 234,
    },
    {
      s: 1.0,
      x: 901,
      y: 285,
    },
    {
      s: 1.0,
      x: 624,
      y: 111,
    },
    {
      s: 1.0,
      x: 75,
      y: 103,
    },
    {
      s: 1.0,
      x: 413,
      y: 267,
    },
    {
      s: 1.0,
      x: 2895,
      y: 271,
    },
    {
      s: 1.0,
      x: 1990,
      y: 75,
    },
  ];



const FlyingUsers = (props) => {



    const animationRef = React.useRef();
    const bubblesRef = React.useRef(
        bubbles.map((bubble) => ({
        ...bubble,
        noiseSeedX: Math.floor(Math.random() * 64000),
        noiseSeedY: Math.floor(Math.random() * 64000),
        xWithNoise: bubble.x,
        yWithNoise: bubble.y,
        })),
    );

  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 200);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);


  function animate() {
    bubblesRef.current = bubblesRef.current.map((bubble, index) => {
      const newNoiseSeedX = bubble.noiseSeedX + NOISE_SPEED;
      const newNoiseSeedY = bubble.noiseSeedY + NOISE_SPEED;

      const randomX = noise.simplex2(newNoiseSeedX, 0);
      const randomY = noise.simplex2(newNoiseSeedY, 0);

      const newX = bubble.x - SCROLL_SPEED;

      const newXWithNoise = newX + randomX * NOISE_AMOUNT;
      const newYWithNoise = bubble.y + randomY * NOISE_AMOUNT;

      const element = document.getElementById(`bubble-${index}`);

      if (element) {
        element.style.transform = `translate(${newXWithNoise}px, ${newYWithNoise}px) scale(${bubble.s})`;
      }

      return {
        ...bubble,
        noiseSeedX: newNoiseSeedX,
        noiseSeedY: newNoiseSeedY,
        x: newX < -200 ? CANVAS_WIDTH : newX,
        xWithNoise: newXWithNoise,
        yWithNoise: newYWithNoise,
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }






    console.log('ffu', props.contributors.length, bubbles.length )
    return(
        <div className="bubbles-wrapper">
             <div className="bubbles">
                {props.contributors.map((contributor, index) => (
                    <div
                        className="bubble"
                        id={`bubble-${index}`}
                        key={`${bubbles[index].x} ${bubbles[index].y}`}
                        style={{
                        backgroundImage: `url(${contributor.displayPhoto})`,
                        transform: `translate(${bubbles[index].x}px, ${bubbles[index].y}px) scale(${bubbles[index].s})`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default FlyingUsers;