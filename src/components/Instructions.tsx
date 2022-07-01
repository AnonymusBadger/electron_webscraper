import ListGroup from 'react-bootstrap/ListGroup';

const Instructions = () => {
    return (
        <>
            <h1>Instructions</h1>
            <ListGroup as="ol" numbered>
                <ListGroup.Item as="li">
                    Select website to scrape
                </ListGroup.Item>
                <ListGroup.Item as="li">Set save directory</ListGroup.Item>
                <ListGroup.Item as="li">
                    Name your search (optional)
                </ListGroup.Item>
                <ListGroup.Item as="li">Make a search</ListGroup.Item>
                <ListGroup.Item as="li">Run!</ListGroup.Item>
            </ListGroup>
        </>
    );
};

export default Instructions;
