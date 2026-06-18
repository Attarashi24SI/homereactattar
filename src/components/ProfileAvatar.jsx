import React from "react";
import { useTheme } from "../context/ThemeContext";

const ProfileAvatar = ({ name = "", src, alt = name }) => {
    const { isLight } = useTheme();
    const initials = name
        .split(" ")
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className="h-11 w-11 rounded-full object-cover"
            />
        );
    }

    return (
        <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${isLight ? "bg-teal-500" : "bg-gradient-to-br from-amber-300 to-orange-600"}`}>
            {initials}
        </div>
    );
};

export default ProfileAvatar;
