"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Otp2 from "../components/Otp";
import { useStore } from "../context/store";
import Link from 'next/link';

const RegisterForm = () => {
    const { isValidLogin, setIsValidLogin, token, setToken, setUser } = useStore();

    useEffect(() => {
        if (token) {
            console.log("Redirecting, token:", token);
            window.location.href = "/home";
        }
    }, [token]); // ✅ react to token changes

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [wait, SetWait] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        terms: false,
        otp: "",
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        SetWait(true);

        if (formData.password !== formData.repeatPassword) {
            alert("Passwords do not match.");
            SetWait(false);
            return;
        }

        if (!formData.terms) {
            alert("Please accept the terms and conditions.");
            SetWait(false);
            return;
        }

        if (!isOtpSent) {
            try {
                const otpRes = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/generateVerificationOtp`,
                    { email: formData.email }
                );
                if (otpRes.status === 200) {
                    setIsOtpSent(true);
                    SetWait(false);
                    alert("OTP sent to your email.");
                    return;
                }
            } catch (error) {
                console.error("OTP error:", error?.response?.data || error.message);
                SetWait(false);
            }
        } else {
            try {
                if (formData.otp.length !== 4) {
                    alert("Please enter a valid OTP.");
                    SetWait(false);
                    return;
                }

                const registerRes = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
                    formData
                );

                if (registerRes.status === 200) {
                    SetWait(false);

                    // ✅ Store in cookie
                    Cookies.set("user", JSON.stringify(registerRes.data), {
                        expires: 1 / 24,
                        path: "/",
                        secure: true,
                        sameSite: "Lax",
                    });

                    // ✅ Update context immediately
                    setToken(registerRes.data.token);
                    setIsValidLogin(true);

                    // ✅ Update user data in context
                    setUser({
                        id: registerRes.data.user._id ? registerRes.data.user._id.toString() : null,
                        name: registerRes.data.user.name,
                        avatar: registerRes.data.user.avatar,
                        title: registerRes.data.user.title,
                    });

                    // Reset form
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        repeatPassword: "",
                        terms: false,
                        otp: "",
                    });

                    // Redirect is handled by useEffect now
                }
            } catch (error) {
                console.error("Registration error:", error?.response?.data || error.message);
                SetWait(false);
            }
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <form className="max-w-sm mx-auto w-full" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your name
                    </label>
                    <input
                        disabled={isOtpSent}
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="John Doe"
                        required
                    />
                </div>

                {/* Email */}
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                    </label>
                    <input
                        disabled={isOtpSent}
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="name@example.com"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your password
                    </label>
                    <input
                        disabled={isOtpSent}
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                {/* Repeat Password */}
                <div className="mb-5">
                    <label htmlFor="repeatPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Repeat password
                    </label>
                    <input
                        disabled={isOtpSent}
                        type="password"
                        id="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                {/* OTP input component */}
                {isOtpSent && <Otp2 formData={formData} setFormData={setFormData} />}

                {/* Terms and conditions */}
                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 
              focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                            required
                        />
                    </div>
                    <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I agree with the{" "}
                        <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                            terms and conditions
                        </a>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={wait}
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
          focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm 
          px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"

                >
                    Register new account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-5">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-[#06b6d4]">
                        Login here
                    </Link>
                </p>
            </form>
        </section>
    );
};

export default RegisterForm;
