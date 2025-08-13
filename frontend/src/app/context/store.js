"use client";
import React, { useContext, createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [isValidLogin, setIsValidLogin] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null); // Add user state

  useEffect(() => {
    const storedUser = Cookies.get("user"); // Assuming the cookie stores the user object directly
    if (storedUser) {
      try {
        const parsedResponse = JSON.parse(storedUser); // Renamed to parsedResponse for clarity
        setIsValidLogin(true);
        setToken(parsedResponse.token);
        // Extract user details from the nested 'user' object within parsedResponse
        setUser({
          id: parsedResponse.user._id ? parsedResponse.user._id.toString() : null, // Access parsedResponse.user._id
          name: parsedResponse.user.name, // Access parsedResponse.user.name
          avatar: parsedResponse.user.avatar, // Access parsedResponse.user.avatar
          title: parsedResponse.user.title, // Access parsedResponse.user.title
        });
        console.log("Context initialized from cookie with user data");
      } catch (err) {
        console.error("Error parsing stored user data from cookie:", err);
        // Clear invalid cookie data
        Cookies.remove("user");
        setIsValidLogin(false);
        setToken("");
        setUser(null);
      }
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{ isValidLogin, setIsValidLogin, token, setToken, user, setUser }} // Include user and setUser in context value
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
