import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import '../styles/ChooseAlgo.css';import Layout from "./Layout.jsx";

function ChooseAlgo({user, setUser, setSelectedAlgo, isDarkMode, toggleTheme}) {
    const [algorithms, setAlgos] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('http://localhost:3000/api/challenges')
            .then((res) => res.json())
            .then((data) => {
                setAlgos(data);
            }).catch((error) => console.error("Error fetching algorithms:", error));
    }, []);
    
    
    //fetch full list of algos from database and place them in an array in order of primary Key ID
    // const fullList = algorithms;
    // const buttons = [];
    // //iterate through list of algos
    // for(let i = 0; i < fullList.length; i++){
    //     //create buttons that display names of algos as follows: (primary Key ID): name 
    //     // (ex. 1. reverseString)
    //     buttons.push(<button onClick={submitAlgo}>{fullList[i].id} {fullList[i].name}</button>);
    // } 
        

    //when an algo button is clicked :
    function submitAlgo(algo) {
        setSelectedAlgo(algo);
        navigate('/Dashboard');
        // console.log(e);
        //send fetch request to get row of primary key ID in database
        //Prop drill rowData to dashboard
        //redirect to dashboard
        // return (
        //     <Router>
        //       <Routes>
        //         <Route
        //           path="/Dashboard.jsx"
        //           // element={user ? <Dashboard user={user} setUser={setUser}/> : <LoginPage user={user} setUser={setUser} /> }
        //           element={<Dashboard user={user} setUser={setUser} setSelectedAlgo={setSelectedAlgo} currAlgo={algorithms}/>}
        //         />
        //       </Routes>
        //     </Router>
        //   );
    }
        
    return (
        <div className="choose-algo-container">
            <h2>Choose an Algorithm</h2>
            {algorithms.length === 0 ? (
                <p className="loading-text">Loading algos...</p>
            ) : (
                <div className="algo-buttons">
                    {algorithms.sort((a,b) =>a.par- b.par).map((algo) => (
                        <button key={algo.id} onClick={() => submitAlgo(algo)}>
                            {algo.par}. {algo.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChooseAlgo;