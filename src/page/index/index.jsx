import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '@css/base.css';
import style from './index.less';

import TempWidget from '@widget/temp_widget/index.jsx';
import {apiTest} from '@js/api.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount() {
        apiTest().then(({data:res})=>{
            console.log(res);
        });
	}
	render() {
		return (
			<div className={style.page}>
				page templete  11
				<div className={style.image}></div>
				<TempWidget />
			</div>
		);
	}
}


ReactDOM.render(<App />, document.getElementById('app'));