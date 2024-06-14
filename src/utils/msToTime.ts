export const msToTime = (milli: number) => {
   const seconds = Math.floor((milli / 1000) % 60);
   const minutes = Math.floor((milli / (60 * 1000)) % 60);
   return `${String(minutes).padStart(2)}:${String(seconds).padStart(2)}`;
};