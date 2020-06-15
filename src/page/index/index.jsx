import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import style from './index.less';

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
				page2
				<div className={style.image}></div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));