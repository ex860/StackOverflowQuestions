import react, { useEffect, useRef } from 'react';
import './User.scss';

const User = (props) => {
    const { display_name, profile_image } = props;
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
            {display_name}
        </div>
    );
};

export default User;
