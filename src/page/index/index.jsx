import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import style from './index.less';
import Test from '@/widget/temp_widget/index.jsx';

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
				<Test />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));