import { useState, useEffect } from 'react';

const ServicePageCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        "https://sihospital.com.vn/uploads/202408/35/xVKTn8-banner-dichvu-kham-thai-dinh-ky.jpg",
        "https://sihospital.com.vn/uploads/202407/30/vD4yWt-banner-dichvu.jpg"
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000); // Change slide every 3 seconds

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, [slides.length]);

    return (
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
            <div style={{height: "600px"}} className="relative h-96 overflow-hidden rounded-lg md:h-96">
                {/* Slide 1 */}
                <div className={`duration-700 ease-in-out ${currentSlide === 0 ? 'block' : 'hidden'}`} data-carousel-item>
                    <img
                        src={slides[0]}
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt="First slide"
                    />
                </div>

                {/* Slide 2 */}
                <div className={`duration-700 ease-in-out ${currentSlide === 1 ? 'block' : 'hidden'}`} data-carousel-item>
                    <img
                        src={slides[1]}
                        className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt="Second slide"
                    />
                </div>

                {/* Navigation Dots */}
                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                    <button
                        type="button"
                        className={`w-3 h-3 rounded-full ${currentSlide === 0 ? 'bg-white' : 'bg-gray-400'}`}
                        aria-current="true"
                        aria-label="Slide 1"
                        onClick={() => setCurrentSlide(0)}
                    ></button>
                    <button
                        type="button"
                        className={`w-3 h-3 rounded-full ${currentSlide === 1 ? 'bg-white' : 'bg-gray-400'}`}
                        aria-current="false"
                        aria-label="Slide 2"
                        onClick={() => setCurrentSlide(1)}
                    ></button>
                </div>

                {/* Prev Button */}
                <button
                    type="button"
                    className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    data-carousel-prev
                    onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>

                {/* Next Button */}
                <button
                    type="button"
                    className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    data-carousel-next
                    onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </div>
    );
}

export default ServicePageCarousel;
