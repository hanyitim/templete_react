import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import  "@css/base.css";
import "./index.less";

import TempWidget from "@widget/temp_widget/index.jsx";

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
            <div className={["$pageName"].join(" ")}>
				page templete
				<TempWidget />
            </div>
		)
	}
}


ReactDOM.render(<App />,document.getElementById('app'))