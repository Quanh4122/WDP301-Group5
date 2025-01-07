import React, { useEffect, useState } from 'react';

interface props {
    tabs: any[];
    chosenTab: any;
    onChange: (value: any) => void;
}

export const TabComponent = ({ tabs, chosenTab, onChange }: props) => {
    const [chosenItem, setChosenItem] = useState<any>();

    useEffect(() => {
        setChosenItem(chosenTab);
    }, [chosenTab]);

    return (
        <section
            style={{
                width: '100%',
                paddingLeft: 16,
                height: 48,
                borderBottom: '1px solid #CED4DA',
                display: 'flex',
                alignContent: 'center',
            }}
        >
            {tabs.map((element) => (
                <div
                    className={`button-style ${
                        chosenItem === element.value ? 'tab-item-chosen' : 'tab-item-normal'
                    }`}
                    onClick={() => {
                        onChange(element.value);
                        setChosenItem(element.value);
                    }}
                    key={element.value}
                    style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {element.name}
                </div>
            ))}
        </section>
    );
};
