import React,{Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import style from './page.less';

//page
import Index from '@/page/index/index.jsx';

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./service-worker.js').then(registration => {
//             console.log('SW registered: ', registration);
//         }).catch(registrationError => {
//             console.log('SW registration failed: ', registrationError);
//         });
//     });
// }

class Pages extends Component{
    constructor(props) {
        super(props);
        this.state = {
            login:true
        };
    }
    render(){
        let {props} = this,
            {match} = props;
        return (
            <div className={style.page}>
                <Route path={`${match.url}/index`} render={ props => <Index {...props} /> } />
            </div>
        );
    }
}
Pages.propTypes = {
    match:PropTypes.object
};

class Main extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={() => ( <Redirect to="/pages" /> )}/>
                    <Route path="/pages" render={ props => <Pages {...props} /> } />
                    <Route render={() => <h1 style={{ textAlign: 'center', marginTop: '160px', color:'rgba(255, 255, 255, 0.7)' }}>页面不见了</h1>} />
                </Switch>
            </Router>
        );
    }
}


const render = () =>{
    ReactDOM.render(<Main />,document.getElementById('app'));
};

if(module.hot){
    module.hot.accept('@/page/main.jsx',function(){
        render();
    });
}
render();