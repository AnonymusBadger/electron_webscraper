import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const SelectSavePath = ({
    savePath,
    onSet,
    onOpen,
    className,
}: {
    savePath: string;
    className: string;
    onSet: () => void;
    onOpen: () => void;
}) => {
    const handleSet = (e) => {
        onSet(e);
    };

    const handleOpen = (e) => {
        onOpen(e);
    };

    return (
        <ButtonGroup className={className}>
            <Button
                onClick={handleSet}
                variant="light"
                type="submit"
                className="pathName"
            >
                {savePath || 'Set save directory'}
            </Button>
            <Button
                className="openFolder"
                variant="secondary"
                type="submit"
                disabled={!savePath}
                onClick={handleOpen}
            >
                <FontAwesomeIcon icon={faFolderOpen} />
            </Button>
        </ButtonGroup>
    );
};

SelectSavePath.propTypes = {
    savePath: PropTypes.string,
};

SelectSavePath.defaultProps = {
    savePath: null,
};

export default SelectSavePath;
