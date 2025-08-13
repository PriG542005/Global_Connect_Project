"use client";
import React, { useState, useRef } from "react";
export default function Otp2({ formData, setFormData }) {
    const [otp, setOtp] = useState(Array(4).fill(""));
    const inputRefs = useRef([]);

    const handleKeyDown = (e) => {
        if (!/^[0-9]{1}$/.test(e.key) && !["Backspace", "Delete", "Tab"].includes(e.key) && !e.metaKey) {
            e.preventDefault();
        }

        if (["Delete", "Backspace"].includes(e.key)) {
            const index = inputRefs.current.indexOf(e.target);
            if (index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                setFormData((prev) => ({ ...prev, otp: newOtp.join("") }));
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleInput = (e) => {
        const { target } = e;
        const index = inputRefs.current.indexOf(target);
        const value = target.value;

        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setFormData((prev) => ({ ...prev, otp: newOtp.join("") }));

            if (index < otp.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleFocus = (e) => e.target.select();

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").slice(0, otp.length);
        if (!/^\d+$/.test(text)) return;

        const newOtp = text.split("");
        setOtp(newOtp);
        setFormData((prev) => ({ ...prev, otp: newOtp.join("") }));
    };

    return (
        <section className="py-10">
           <div className="container">
  <p className="mb-1.5 text-sm font-medium text-dark dark:text-white">Secure code</p>
  <div id="otp-form" className="flex gap-2">
    {otp.map((digit, index) => (
      <input
        key={index}
        type="text"
        maxLength={1}
        value={digit}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onPaste={handlePaste}
        ref={(el) => (inputRefs.current[index] = el)}
        className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-2 text-center text-2xl font-medium text-gray-5 outline-none sm:text-4xl dark:border-dark-3 dark:bg-white/5"
      />
    ))}
  </div>
</div>
        </section>
    );
}
