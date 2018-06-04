import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import  "../../css/base.css";
import style from './index.less';


class App extends Component{
	constructor(props) {
		super(props);
		this.state={
        }
	}
    componentDidMount(){
        var self = this;
    }
    
	render(){
        var self = this;
		return (
            <div className="test">
				343412312321123123123123
            </div>
		)
	}
}


ReactDOM.render(<App />,document.getElementById('app'))