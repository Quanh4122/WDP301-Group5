import React from 'react';
import { Button, Result } from 'antd';
import { useRouteError } from 'react-router-dom';

const ErrorSite: React.FC = () => {
    const error: any = useRouteError();
    return (
        <Result
            status="warning"
            title={error.statusText || error.message}
            extra={
                <Button type="primary" key="console">
                    Home
                </Button>
            }
        />
    );
};

export default ErrorSite;
