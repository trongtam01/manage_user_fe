import React, { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from 'react-redux';


const PrivateRoutes = (props) => {

    const user = useSelector(state => state.user.user)

    if(user && !user.auth) {
        return (
            <>  
                <Alert variant="danger" className='mt-3'>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>
                    Change this and that and try again. Duis mollis, est non commodo
                    luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                    Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            </>
        )
    }
    return (
        <>
            {props.children}
        </>
    );
};

export default PrivateRoutes;