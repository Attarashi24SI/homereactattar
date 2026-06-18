import React from "react";
import { useTheme } from "../context/ThemeContext";

const PageHeader = ({ title, breadcrumb }) => {
    const { isLight } = useTheme();

    return (
        <div className="mb-4">
            {/* Breadcrumb */}
            {breadcrumb && (
                <div className={`mb-1.5 flex items-center gap-2 text-sm ${isLight ? "text-slate-500" : "text-gray-400"}`}>
                    {Array.isArray(breadcrumb)
                        ? breadcrumb.map((item, index) => (
                            <span key={index} className="flex items-center gap-2">
                                {index !== 0 && <span>›</span>}
                                <span
                                    className={
                                        index === breadcrumb.length - 1
                                            ? `${isLight ? "text-gray-700" : "text-white"} font-medium`
                                            : ""
                                    }
                                >
                                    {item}
                                </span>
                            </span>
                        ))
                        : breadcrumb}
                </div>
            )}

            {/* Title */}
            <h1 className={`${isLight ? "text-slate-900" : "text-white"} text-[28px] font-bold tracking-tight`}>
                {title}
            </h1>

        </div>
    );
};

export default PageHeader;
