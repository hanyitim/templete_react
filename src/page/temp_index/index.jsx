import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import  "../../css/base.css";
import "./index.less";


class App extends Component{
	constructor(props) {
		super(props);
		this.state={
        }
	}
    componentDidMount(){
    }
    
	render(){
		return (
            <div className="test">
				343412312321123123123123
            </div>
		)
	}
}


ReactDOM.render(<App />,document.getElementById('app'))