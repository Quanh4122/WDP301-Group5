import React from 'react';
import { Button, Result } from 'antd';

interface props {
    username: string;
    toHome: () => void;
}

const SuccessResult = ({ username, toHome }: props) => {
    return (
        <div className="width-full-screen height-full-screen">
            <Result
                status="success"
                title={`Register new account successfullly, ${username}`}
                extra={[
                    <Button type="primary" key="console" onClick={toHome}>
                        Home
                    </Button>,
                ]}
            />
        </div>
    );
};

export default SuccessResult;
