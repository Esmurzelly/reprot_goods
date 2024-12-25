import React from 'react'
import { ColorRing } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div className='w-full min-h-screen border z-50 flex flex-col justify-center items-center absolute'>
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
            <p>Подождите, идёт загрузка</p>
        </div>
    )
}

export default Loader