import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '@css/base.css';
import style from './index.less';


// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./service-worker.js').then(registration => {
//             console.log('SW registered: ', registration);
//         }).catch(registrationError => {
//             console.log('SW registration failed: ', registrationError);
//         });
//     });
// }

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	componentDidMount() {
	}
	render() {
		return (
			<div className={style.page}>
				page
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));