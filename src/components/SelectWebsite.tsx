import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react';

const SelectWebsite = ({
    websites,
    onSelect,
}: {
    websites: object[];
    onSelect: (config: object) => void;
}) => {
    const [btnText, setBtnText] = useState('Select website');

    const handleChange = (config: object) => {
        setBtnText(config.name);
        onSelect(config);
    };

    const choices = (() => {
        const items = [];
        websites.forEach((config) => {
            items.push(
                <Dropdown.Item
                    key={config.name}
                    onClick={() => handleChange(config)}
                    as="button"
                    active={config.name === btnText}
                >
                    {config.name}
                </Dropdown.Item>
            );
        });

        return items;
    })();

    return (
        <Dropdown className="selectWebsite">
            <Dropdown.Toggle
                className="w-100"
                variant="light"
                id="website-select"
            >
                {btnText}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100" variant="dark">
                {choices}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SelectWebsite;
