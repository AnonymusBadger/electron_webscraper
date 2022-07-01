import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const ListItem = ({
    child,
    isRunning,
    isDone,
}: {
    child: Element;
    isRunning: boolean;
    isDone: boolean;
}) => {
    const renderIcon = () => {
        if (!isDone && isRunning) {
            return <Spinner animation="border" />;
        }
        if (isDone) {
            return <FontAwesomeIcon icon={faCheck} className="fs-2" />;
        }
        return null;
    };

    return (
        <ListGroup.Item
            as="li"
            variant={isDone ? 'success' : 'secondary'}
            active={isRunning}
            disabled={!isDone}
            className="d-flex align-items-center justify-content-between"
        >
            {child}
            {renderIcon()}
        </ListGroup.Item>
    );
};

export default ListItem;
