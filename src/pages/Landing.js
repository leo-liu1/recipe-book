import React from 'react';

import { ReactComponent as FridgeIcon } from '../assets/icons/fridge.svg';

export default function Landing() {
    document.title = "Recipe to Cook";

    return (<div className="landing">
        <div className="container">
            <FridgeIcon />
            <div className="text">
                <div className="title">
                    Recipe to Cook
                </div>
                <div className="subtitle">
                    Find recipes straight from your fridge!
                </div>
            </div>
        </div>
    </div>);
}
