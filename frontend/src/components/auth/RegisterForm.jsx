import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    FaArrowLeft,
    FaEnvelope,
    FaUserPlus,
} from "react-icons/fa";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import api from "../../services/api";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const getErrorMessage = (error) => {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData === "string" &&
        responseData.trim()
    ) {
        return responseData;
    }

    if (
        typeof responseData?.message ===
            "string" &&
        responseData.message.trim()
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message;
    }

    return "Unable to complete registration. Please try again.";
};

const RegisterForm = () => {
    const navigate = useNavigate();

    const otpInputRefs = useRef([]);

    const [registrationStep, setRegistrationStep] =
        useState("FORM");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
    });

    const [otpDigits, setOtpDigits] = useState(
        Array(OTP_LENGTH).fill("")
    );

    const [sendingOtp, setSendingOtp] =
        useState(false);

    const [verifyingOtp, setVerifyingOtp] =
        useState(false);

    const [resendCountdown, setResendCountdown] =
        useState(0);

    /*
     * Clear every registration field when this
     * component is opened.
     */
    useEffect(() => {
        setFormData({
            fullName: "",
            email: "",
            password: "",
            role: "",
        });

        setOtpDigits(
            Array(OTP_LENGTH).fill("")
        );
    }, []);

    useEffect(() => {
        if (resendCountdown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCountdown(
                (previousSeconds) =>
                    previousSeconds - 1
            );
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [resendCountdown]);

    useEffect(() => {
        if (registrationStep === "OTP") {
            setTimeout(() => {
                otpInputRefs.current[0]?.focus();
            }, 100);
        }
    }, [registrationStep]);

    const handleChange = (event) => {
        const { name, value } =
            event.target;

        setFormData(
            (previousData) => ({
                ...previousData,
                [name]: value,
            })
        );
    };

    const validateRegistrationForm = () => {
        const fullName =
            formData.fullName.trim();

        const email =
            formData.email
                .trim()
                .toLowerCase();

        if (!fullName) {
            toast.warning(
                "Please enter your full name."
            );
            return false;
        }

        if (fullName.length < 2) {
            toast.warning(
                "Full name must contain at least 2 characters."
            );
            return false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            toast.warning(
                "Please enter a valid email address."
            );
            return false;
        }

        if (!formData.password) {
            toast.warning(
                "Please enter a password."
            );
            return false;
        }

        if (formData.password.length < 6) {
            toast.warning(
                "Password must contain at least 6 characters."
            );
            return false;
        }

        if (!formData.role) {
            toast.warning(
                "Please select Patient or Doctor."
            );
            return false;
        }

        return true;
    };

    const sendRegistrationOtp = async () => {
        if (!validateRegistrationForm()) {
            return;
        }

        try {
            setSendingOtp(true);

            await api.post(
                "/users/register/send-otp",
                {
                    email: formData.email
                        .trim()
                        .toLowerCase(),
                }
            );

            setFormData(
                (previousData) => ({
                    ...previousData,
                    fullName:
                        previousData.fullName.trim(),
                    email:
                        previousData.email
                            .trim()
                            .toLowerCase(),
                })
            );

            setOtpDigits(
                Array(OTP_LENGTH).fill("")
            );

            setRegistrationStep("OTP");

            setResendCountdown(
                RESEND_SECONDS
            );

            toast.success(
                "A 6-digit OTP has been sent to your email."
            );
        } catch (error) {
            console.error(
                "Failed to send registration OTP:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setSendingOtp(false);
        }
    };

    const handleFormSubmit = async (
        event
    ) => {
        event.preventDefault();

        await sendRegistrationOtp();
    };

    const handleOtpChange = (
        index,
        value
    ) => {
        const onlyDigit =
            value.replace(/\D/g, "");

        if (!onlyDigit) {
            setOtpDigits(
                (previousDigits) => {
                    const updatedDigits = [
                        ...previousDigits,
                    ];

                    updatedDigits[index] = "";

                    return updatedDigits;
                }
            );

            return;
        }

        /*
         * Handles autofill or multiple digits entered
         * into one OTP field.
         */
        if (onlyDigit.length > 1) {
            const incomingDigits =
                onlyDigit
                    .slice(0, OTP_LENGTH)
                    .split("");

            const updatedDigits =
                Array(OTP_LENGTH).fill("");

            incomingDigits.forEach(
                (digit, digitIndex) => {
                    updatedDigits[digitIndex] =
                        digit;
                }
            );

            setOtpDigits(updatedDigits);

            const nextIndex = Math.min(
                incomingDigits.length,
                OTP_LENGTH - 1
            );

            otpInputRefs.current[
                nextIndex
            ]?.focus();

            return;
        }

        setOtpDigits(
            (previousDigits) => {
                const updatedDigits = [
                    ...previousDigits,
                ];

                updatedDigits[index] =
                    onlyDigit;

                return updatedDigits;
            }
        );

        if (index < OTP_LENGTH - 1) {
            otpInputRefs.current[
                index + 1
            ]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index,
        event
    ) => {
        if (
            event.key === "Backspace" &&
            !otpDigits[index] &&
            index > 0
        ) {
            otpInputRefs.current[
                index - 1
            ]?.focus();
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            otpInputRefs.current[
                index - 1
            ]?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < OTP_LENGTH - 1
        ) {
            otpInputRefs.current[
                index + 1
            ]?.focus();
        }
    };

    const handleOtpPaste = (event) => {
        event.preventDefault();

        const pastedDigits =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, OTP_LENGTH)
                .split("");

        if (pastedDigits.length === 0) {
            return;
        }

        const updatedDigits =
            Array(OTP_LENGTH).fill("");

        pastedDigits.forEach(
            (digit, index) => {
                updatedDigits[index] =
                    digit;
            }
        );

        setOtpDigits(updatedDigits);

        const finalInputIndex =
            Math.min(
                pastedDigits.length,
                OTP_LENGTH
            ) - 1;

        otpInputRefs.current[
            finalInputIndex
        ]?.focus();
    };

    const verifyOtpAndRegister = async (
        event
    ) => {
        event.preventDefault();

        const otp =
            otpDigits.join("");

        if (!/^\d{6}$/.test(otp)) {
            toast.warning(
                "Please enter the complete 6-digit OTP."
            );
            return;
        }

        try {
            setVerifyingOtp(true);

            await api.post(
                "/users/register/verify-otp",
                {
                    fullName:
                        formData.fullName.trim(),

                    email:
                        formData.email
                            .trim()
                            .toLowerCase(),

                    password:
                        formData.password,

                    role: formData.role,

                    otp,
                }
            );

            toast.success(
                "Registration completed successfully. Please log in."
            );

            setFormData({
                fullName: "",
                email: "",
                password: "",
                role: "",
            });

            setOtpDigits(
                Array(OTP_LENGTH).fill("")
            );

            navigate("/");
        } catch (error) {
            console.error(
                "OTP verification failed:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        if (
            resendCountdown > 0 ||
            sendingOtp
        ) {
            return;
        }

        await sendRegistrationOtp();
    };

    const handleChangeEmail = () => {
        setRegistrationStep("FORM");

        setOtpDigits(
            Array(OTP_LENGTH).fill("")
        );

        setResendCountdown(0);
    };

    if (registrationStep === "OTP") {
        return (
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <FaEnvelope className="text-3xl" />
                    </div>
                </div>

                <h1 className="text-center text-3xl font-bold text-gray-800">
                    Verify Your Email
                </h1>

                <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                    Enter the 6-digit OTP sent to
                </p>

                <p className="mt-1 break-all text-center font-semibold text-blue-600">
                    {formData.email}
                </p>

                <form
                    onSubmit={
                        verifyOtpAndRegister
                    }
                    autoComplete="off"
                    className="mt-7"
                >
                    <div
                        className="flex justify-center gap-2 sm:gap-3"
                        onPaste={handleOtpPaste}
                    >
                        {otpDigits.map(
                            (digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        otpInputRefs.current[
                                            index
                                        ] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    autoComplete={
                                        index === 0
                                            ? "one-time-code"
                                            : "off"
                                    }
                                    aria-label={`OTP digit ${
                                        index + 1
                                    }`}
                                    value={digit}
                                    onChange={(
                                        event
                                    ) =>
                                        handleOtpChange(
                                            index,
                                            event.target
                                                .value
                                        )
                                    }
                                    onKeyDown={(
                                        event
                                    ) =>
                                        handleOtpKeyDown(
                                            index,
                                            event
                                        )
                                    }
                                    className="h-12 w-11 rounded-xl border border-gray-300 text-center text-xl font-bold text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-14 sm:w-12"
                                />
                            )
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={verifyingOtp}
                        className="mt-7 w-full cursor-pointer rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {verifyingOtp
                            ? "Verifying and Registering..."
                            : "Verify OTP & Register"}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    {resendCountdown > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend OTP in{" "}
                            <span className="font-semibold text-gray-700">
                                {resendCountdown}s
                            </span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={
                                handleResendOtp
                            }
                            disabled={sendingOtp}
                            className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {sendingOtp
                                ? "Sending OTP..."
                                : "Resend OTP"}
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleChangeEmail}
                    disabled={verifyingOtp}
                    className="mx-auto mt-5 flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FaArrowLeft />
                    Change registration details
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-4 flex justify-center">
                <FaUserPlus className="text-5xl text-green-600" />
            </div>

            <h1 className="text-center text-3xl font-bold text-gray-800">
                Create Account
            </h1>

            <p className="mb-6 mt-2 text-center text-gray-500">
                Register to use MediConnect
            </p>

            <form
                onSubmit={handleFormSubmit}
                autoComplete="off"
                className="space-y-4"
            >
                {/*
                  Hidden fields help discourage some browsers
                  from filling saved login credentials.
                */}
                <input
                    type="text"
                    name="prevent_autofill_username"
                    autoComplete="username"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden"
                />

                <input
                    type="password"
                    name="prevent_autofill_password"
                    autoComplete="current-password"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hidden"
                />

                <input
                    type="text"
                    name="registration_full_name"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(event) =>
                        setFormData(
                            (previousData) => ({
                                ...previousData,
                                fullName:
                                    event.target.value,
                            })
                        )
                    }
                    autoComplete="off"
                    required
                    className="w-full rounded-lg border px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="email"
                    name="registration_email_address"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(event) =>
                        setFormData(
                            (previousData) => ({
                                ...previousData,
                                email:
                                    event.target.value,
                            })
                        )
                    }
                    autoComplete="off"
                    spellCheck={false}
                    required
                    className="w-full rounded-lg border px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    name="new_registration_password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(event) =>
                        setFormData(
                            (previousData) => ({
                                ...previousData,
                                password:
                                    event.target.value,
                            })
                        )
                    }
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="w-full rounded-lg border px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />

                <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                        Register As
                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        className="w-full cursor-pointer rounded-lg border px-3 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            Select Role
                        </option>

                        <option value="PATIENT">
                            👤 Patient
                        </option>

                        <option value="DOCTOR">
                            👨‍⚕️ Doctor
                        </option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={sendingOtp}
                    className="w-full cursor-pointer rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {sendingOtp
                        ? "Sending OTP..."
                        : "Send Verification OTP"}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
                Already have an account?{" "}
                <Link
                    to="/"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                >
                    Login
                </Link>
            </p>
        </div>
    );
};

export default RegisterForm;