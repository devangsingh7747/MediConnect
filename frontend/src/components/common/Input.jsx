const Input = ({
    type = "text",
    placeholder,
    value,
    onChange,
    ...props
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
            "
            {...props}
        />
    );
};

export default Input;