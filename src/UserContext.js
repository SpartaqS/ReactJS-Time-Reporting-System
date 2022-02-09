import { createContext } from "react";

const UserContext = createContext({
    username: new String(""), 
    setUsername: (username) => {}
  });

export default UserContext;