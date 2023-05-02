// Requires
const React = require('react');
const ReactDOM = require('react-dom');
const generic = require('./genericElements.jsx');

const init = async () => {
    // Checks if Logged In
    const loginResult = await generic.checkLogin();
    
    let isSubscribed = false;
    if (loginResult.loggedIn) {
        // Renders the Component to the screen
        const response = await fetch('/checkPremium', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        isSubscribed = result.subscribed;
    }
    
    ReactDOM.render(
        <generic.AccountDropdown loggedIn={loginResult.loggedIn} username={loginResult.username} subscribed={isSubscribed}/>,
        document.getElementById('header')
    );
}

window.onload = init; 