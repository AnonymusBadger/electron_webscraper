import Form from 'react-bootstrap/Form';

const SearchNamer = ({ onChange }: { onChange: (value: string) => void }) => {
    const handleChange = (e: SyntheticEvent) => {
        onChange(e.target.value);
    };

    return (
        <Form
            className="nameSearch"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <Form.Control
                type="text"
                placeholder="Name search"
                onChange={handleChange}
            />
        </Form>
    );
};

export default SearchNamer;
