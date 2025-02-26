import React from "react";

const withIconStyles = (Icon: React.ElementType, className: string = "mr-2") => {
    const WrappedIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
        <Icon {...props} className={className} />
    );

    if (typeof Icon === "function" || typeof Icon === "object") {
        (WrappedIcon as React.ComponentType).displayName = `WithIconStyles(${(Icon as any).displayName || (Icon as any).name || "Icon"})`;
    }

    return WrappedIcon;
};

export default withIconStyles;
