import react, { useEffect, useRef, useContext } from 'react';
import SearchContext from '../SearchContext';
import highlight from '../highlightSearchString';
import './User.scss';

const User = (props) => {
    const { display_name, profile_image } = props;
    const { searchString } = useContext(SearchContext);
    const imgRef = useRef(null);

    useEffect(() => {
        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry?.target) {
                    entry.target.src = profile_image;
                    imageObserver.unobserve(entry.target);
                }
            });
        };
        const imageObserver = new IntersectionObserver(callback, {});
        imageObserver.observe(imgRef.current);
        return () => {
            imageObserver.disconnect();
        };
    }, []);
    return (
        <div className="user">
            <img className="user__image" ref={imgRef} />
            {highlight(display_name, searchString)}
        </div>
    );
};

export default User;
