"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import PhoneInput, {
    isValidPhoneNumber,
} from "react-phone-number-input"; // ADD: international phone input



type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
};

export function LoginModal({
    isOpen,
    onClose,
    onLoginSuccess,
}: LoginModalProps) {
    // ADD: modal open থাকলে body scroll বন্ধ
// state 

  const [phone, setPhone] = useState<string | undefined>();
  const [loginMethod, setLoginMethod] =
    useState<"phone" | "email">("phone");
  const [email, setEmail] = useState("");



    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    // ADD: Escape press করলে modal close
    useEffect(() => {
        if (!isOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    // validation update 

    const isPhoneValid = phone ? isValidPhoneNumber(phone) : false;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // CHANGE: active login method অনুযায়ী button enable হবে
    const canSendOtp =
        loginMethod === "phone"
            ? isPhoneValid
            : isEmailValid;



    return (
        <div
            className=" fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 "
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
                className="  relative grid h-[min(824px,92vh)] w-full max-w-[960px] overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-[51%_49%] "
            >
                {/* LEFT IMAGE — mobile-এ hide */}
                <div className="relative hidden overflow-hidden bg-[#f8fbf9] md:block">
                    <Image
                        src="/images/login.png"
                        alt="Players available nearby"
                        fill
                        priority
                        sizes="(min-width: 768px) 510px"
                        className=" object-contain object-center scale-[0.94] "
                    />
                </div>

                {/* RIGHT FORM */}
                <div className="relative overflow-y-auto px-6 py-7 sm:px-8 md:px-8">
                    <div className="flex items-center justify-between border-b border-[#e2e6e4] pb-6">
                        <h2
                            id="login-modal-title"
                            className="text-[21px] font-semibold text-black"
                        >
                            Login
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close login modal"
                            className=" flex h-9 w-9 items-center justify-center rounded-full text-[#4c5a54] transition hover:bg-[#f1f4f2] "
                        >
                            <X size={25} strokeWidth={1.6} />
                        </button>
                    </div>

                    <form
                        className="pt-12"
                        onSubmit={(event) => {
                            event.preventDefault();

                            if (!canSendOtp) return;

                            console.log("Send OTP to:", phone);
                            onLoginSuccess?.();
                            onClose();
                        }}
                    >
                        <label
                            htmlFor={loginMethod === "phone" ? "phone" : "email"}
                            className="mb-3 block text-[15px] font-medium text-[#72887e]"
                        >
                            {loginMethod === "phone"
                                ? "Enter Mobile No"
                                : "Enter Email Address"}

                            <span className="text-red-500"> *</span>
                        </label>

                        {/* CHANGE: login method অনুযায়ী phone অথবা email field দেখাবে */}
                        {loginMethod === "phone" ? (
                            <div className="login-phone-input">
                                <PhoneInput
                                    id="phone"
                                    international
                                    defaultCountry="BD"
                                    countryCallingCodeEditable={false}
                                    value={phone}
                                    onChange={setPhone}
                                    placeholder="1XXXXXXXXX"
                                    aria-label="Enter mobile number"
                                    className="login-phone-control"
                                />
                            </div>
                        ) : (
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="
                                    h-[49px]
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#dce2df]
                                    bg-white
                                    px-4
                                    text-[15px]
                                    text-[#1e2723]
                                    outline-none
                                    transition
                                    placeholder:text-[#a1aaa6]
                                    focus:border-[#16b866]
                                    "
                            />
                        )}

                        <button
                            type="submit"
                            disabled={!canSendOtp}
                            className=" mt-4 h-[49px] w-full rounded-lg bg-[#13b968] text-[15px] font-semibold text-white transition hover:bg-[#0da459] disabled:cursor-not-allowed disabled:bg-[#f4f6f5] disabled:text-[#b9c2bd]"
                        >
                            Send OTP
                        </button>

                        <div className="my-10 flex items-center justify-center">
                            <span className="text-[15px] font-medium text-[#71877d]">
                                or
                            </span>
                        </div>

                        <div className="flex items-start justify-center gap-12">
                            {/* Email login */}
                            <button
                                type="button"
                                onClick={() =>
                                    setLoginMethod((currentMethod) =>
                                        currentMethod === "phone" ? "email" : "phone",
                                    )
                                }
                                className="flex flex-col items-center gap-2 text-[#1e2723]"
                            >
                                <span
                                    className=" flex h-[38px]  w-[38px]  items-center justify-center rounded-full border border-[#dce2df] "
                                >
                                    <Mail size={20} strokeWidth={1.8} />
                                </span>

                                 {loginMethod === "email" ? (

                                <span className="text-[15px]">Email</span>):  <span className="text-[15px]">Phone</span>}
                            </button>

                            {/* Google login */}
                            <button
                                type="button"
                                onClick={() => {
                                    onLoginSuccess?.();
                                    onClose();
                                }}
                                className="flex flex-col items-center gap-2 text-[#1e2723]"
                            >
                                <span
                                    className=" flex  h-[42px] w-[42px] items-center justify-center rounded-full border border-[#dce2df] text-[20px] font-bold "
                                >
                                    G
                                </span>

                                <span className="text-[15px]">Google</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
