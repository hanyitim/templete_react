import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import  "@css/base.css";
import style from "./index.less";

import TempWidget from "@widget/temp_widget/index.jsx";
import {testA} from '@js/test.js';

console.log(testA());
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
				page templete  11
				<div className={style.image}></div>
				<TempWidget />
            </div>
		)
	}
}


ReactDOM.render(<App />,document.getElementById('app'))