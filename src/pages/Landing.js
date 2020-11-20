import React from 'react';

import './../css/pages.scss';
import { ReactComponent as Fridge } from './../assets/fridge.svg';

export default function Landing() {
    return (<div className="landing">
        <div className="container">
            <Fridge />
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
