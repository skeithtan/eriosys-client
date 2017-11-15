import MemorandumArchives from "./memorandums";
import React from "react";


const tabs = [
    {
        name : "Memorandums",
        tab : <MemorandumArchives/>,
        image : "./images/memorandumgrey.png",
        activeImage : "./images/memorandumgreen.png",
    },
    {
        name : "Programs",
        tab : undefined,
        image : "./images/programsgrey.png",
        activeImage : "./images/programsgreen.png",
    },
    {
        name : "Students",
        tab : undefined,
        image : "./images/studentgrey.png",
        activeImage : "./images/studentgreen.png",
    },
];

export default tabs;