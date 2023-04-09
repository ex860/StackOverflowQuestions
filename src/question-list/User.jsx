import react from 'react';
import './User.scss';


const User = (props) => {
    const { display_name, profile_image } = props;
    return (
        <div className="user">
            <img className="user__image" src={profile_image} />
            {display_name}
        </div>
    );
};

export default User;
