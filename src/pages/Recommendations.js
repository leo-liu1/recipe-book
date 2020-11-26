//import React from 'react';
import React, { useRef, useState } from 'react';
import Recipe from '../components/classes/Recipe';
import { useRecommend } from '../components/handlers/RecommendationsHandler';

export default function Recommendations() {
    document.title = "Recommendations";
    const getRecommends = useRecommend();

    return (<></>);
}
