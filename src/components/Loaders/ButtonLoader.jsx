
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const ButtonLoader = () => {
    const theme = useTheme();
    const PRIMARY_LIGHT = theme.palette.success.main;
    return (
        <div className="loading-wave" >
            <div className="loading-bar" style={{ backgroundColor: PRIMARY_LIGHT }} />
            <div className="loading-bar" style={{ backgroundColor: PRIMARY_LIGHT }} />
            <div className="loading-bar" style={{ backgroundColor: PRIMARY_LIGHT }} />
            <div className="loading-bar" style={{ backgroundColor: PRIMARY_LIGHT }} />
        </div >
    )
};

ButtonLoader.propTypes = {};

export default ButtonLoader;