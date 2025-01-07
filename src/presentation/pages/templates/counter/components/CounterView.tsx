import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';

interface props {
    count: number;
    addOne: () => void;
    minusOne: () => void;
    addByValue: (value: number) => void;
    minusByValue: (value: number) => void;
}

export const CounterView = ({ count, addOne, minusOne, addByValue, minusByValue }: props) => {
    return (
        <div
            className="width-full-screen"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '86vh',
            }}
        >
            <Card style={{ minWidth: 500, textAlign: 'center' }}>
                <Title>Count: {count}</Title>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        marginBottom: 30,
                    }}
                >
                    <Button onClick={() => minusByValue(2)} size="large">
                        <MinusOutlined />
                        <MinusOutlined />
                    </Button>
                    <Button size="large" onClick={() => minusOne()}>
                        <MinusOutlined />
                    </Button>
                    <div style={{ width: 150 }}></div>
                    <Button size="large" onClick={() => addOne()}>
                        <PlusOutlined />
                    </Button>
                    <Button size="large" onClick={() => addByValue(2)}>
                        <PlusOutlined />
                        <PlusOutlined />
                    </Button>
                </div>
            </Card>
        </div>
    );
};
