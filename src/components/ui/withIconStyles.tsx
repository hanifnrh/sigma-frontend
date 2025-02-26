import React from 'react';

const withIconStyles = (Icon: React.ElementType, className: string = "mr-2") => {
    return (props: React.ComponentPropsWithoutRef<'svg'>) => <Icon {...props} className={className} />;
};

export default withIconStyles;
