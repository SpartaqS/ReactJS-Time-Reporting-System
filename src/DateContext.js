import { createContext } from "react";

const DateContext = createContext({
    selectedDate: new Date(), 
    setDate: (date) => {}
  });

export default DateContext;