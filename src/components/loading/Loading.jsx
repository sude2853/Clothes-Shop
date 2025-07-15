import { useSelector } from 'react-redux';

function Loading() {
    const { isLoading } = useSelector((state) => state.main);

    if (!isLoading) return null;

    return (
        <div className="global-loading-overlay">
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;
