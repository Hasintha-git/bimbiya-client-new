// This tells TypeScript that swiper/bundle is a valid module
declare module 'swiper/bundle' {
  const Swiper: any;
  export default Swiper;
}

// Also add the main swiper module just in case
declare module 'swiper' {
  const Swiper: any;
  export default Swiper;
}